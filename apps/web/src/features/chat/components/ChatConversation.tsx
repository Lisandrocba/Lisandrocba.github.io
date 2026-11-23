import { useEffect, useRef } from 'react'
import type { ApiError, Contact } from '@portfolio/api'
import type { ChatMessage } from '../types.ts'
import { ChatError } from './ChatError.tsx'
import { ChatLimitReached } from './ChatLimitReached.tsx'
import { ContactButtons } from './ContactButtons.tsx'
import { MessageBubble } from './MessageBubble.tsx'
import { MessageText } from './MessageText.tsx'
import { TypingIndicator } from './TypingIndicator.tsx'
import styles from './ChatConversation.module.css'

type ChatConversationProps = {
  messages: ChatMessage[]
  isPending: boolean
  isLimitReached: boolean
  /** Respuesta que se está escribiendo. */
  revealingId: number | null
  onRevealEnd: () => void
  error: ApiError | null
  onRetry: () => void
  /** Contacto de la última respuesta (o el del portfolio) para el límite y los errores. */
  contact: Contact
}

/** Figma: "Contenido de la conversación" — intercambio de mensajes y, al final, el aviso de límite o de error. */
export function ChatConversation({
  messages,
  isPending,
  isLimitReached,
  revealingId,
  onRevealEnd,
  error,
  onRetry,
  contact,
}: ChatConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Sigue el final de la conversación mientras crece: mensajes nuevos, carga y texto que se va escribiendo.
  useEffect(() => {
    const container = scrollRef.current
    const log = logRef.current
    if (!container || !log) return

    const observer = new ResizeObserver(() => {
      container.scrollTop = container.scrollHeight
    })
    observer.observe(log)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={scrollRef} className={styles.conversation}>
      <div ref={logRef} role="log" aria-live="polite" aria-label="Conversación" className={styles.log}>
        {(messages.length > 0 || isPending) && (
          <ol className={styles.messages}>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                footer={message.cta && message.id !== revealingId && <ContactButtons contact={message.cta} />}
              >
                <MessageText
                  text={message.text}
                  animate={message.id === revealingId}
                  onRevealEnd={onRevealEnd}
                />
              </MessageBubble>
            ))}
            {isPending && (
              <MessageBubble role="assistant" compact>
                <TypingIndicator />
              </MessageBubble>
            )}
          </ol>
        )}
        {error && !isPending && <ChatError error={error} contact={contact} onRetry={onRetry} />}
        {isLimitReached && <ChatLimitReached contact={contact} />}
      </div>
    </div>
  )
}
