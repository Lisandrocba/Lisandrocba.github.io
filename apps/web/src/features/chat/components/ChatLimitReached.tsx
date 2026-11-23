import { useEffect, useRef } from 'react'
import { Icon, Title } from '@portfolio/ui'
import type { Contact } from '@portfolio/api'
import { ContactButtons } from './ContactButtons.tsx'
import styles from './ChatLimitReached.module.css'

type ChatLimitReachedProps = {
  contact: Contact
}

/** Figma: "Límite de consultas" (`69:802`) — aviso y canales de contacto (QUERY_LIMIT, ABUSE_LIMIT y GLOBAL_LIMIT). */
export function ChatLimitReached({ contact }: ChatLimitReachedProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // Aparece al agotar las consultas, cuando el input con el foco se deshabilita: el foco pasa al aviso.
  useEffect(() => {
    sectionRef.current?.focus()
  }, [])

  return (
    <section ref={sectionRef} tabIndex={-1} className={styles.limit} aria-labelledby="chat-limit-title">
      <p className={styles.status}>
        <Icon name="circle-alert" />
        CONSULTAS AGOTADAS
      </p>
      <Title level={3} size="md" id="chat-limit-title" className={styles.title}>Sigamos en contacto_</Title>
      <p className={styles.message}>Ya utilizaste todas tus consultas disponibles.</p>
      <p className={styles.invitation}>Para obtener más información, podés comunicarte directamente con Lisandro.</p>
      <ContactButtons contact={contact} />
      <p className={styles.address}>{contact.email}</p>
    </section>
  )
}
