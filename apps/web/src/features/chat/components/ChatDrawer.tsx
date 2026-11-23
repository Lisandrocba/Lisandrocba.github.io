import { useEffect, useRef } from 'react'
import { IconButton } from '@portfolio/ui'
import { profile } from '../../../pages/home/data/profile.ts'
import { useChat } from '../hooks/useChat.ts'
import { ChatComposer } from './ChatComposer.tsx'
import { ChatConversation } from './ChatConversation.tsx'
import styles from './ChatDrawer.module.css'

type ChatDrawerProps = {
  id: string
  open: boolean
  onClose: () => void
}

/**
 * Figma: "Asistente de perfil" (`69:710` y, con las consultas agotadas, `69:789`).
 * `<dialog>` modal: atrapa el foco, cierra con Esc o al hacer clic fuera y devuelve el foco al botón que lo abrió.
 */
export function ChatDrawer({ id, open, onClose }: ChatDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const chat = useChat()
  const titleId = `${id}-title`

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className={styles.drawer}
      aria-labelledby={titleId}
      onClose={onClose}
      // El panel ocupa todo el dialog: un clic sobre el propio elemento solo puede venir del backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              PERFIL / IA
            </p>
            <h2 id={titleId} className={styles.title}>Preguntá sobre mí_</h2>
          </div>
          <IconButton icon="x" label="Cerrar chat" size="sm" onClick={onClose} />
        </header>

        <div className={styles.scope}>
          <p className={styles.assistant}>Asistente de {profile.name}</p>
          <p className={styles.restriction}>Solo respondo preguntas sobre su perfil, experiencia y tecnologías.</p>
        </div>

        <ChatConversation
          messages={chat.messages}
          isPending={chat.isPending}
          isLimitReached={chat.isLimitReached}
          revealingId={chat.revealingId}
          onRevealEnd={chat.finishReveal}
          error={chat.error}
          onRetry={chat.retry}
          contact={chat.contact}
        />
        <ChatComposer disabled={chat.isLimitReached} busy={chat.isBusy} remaining={chat.remaining} onSend={chat.send} />
      </div>
    </dialog>
  )
}
