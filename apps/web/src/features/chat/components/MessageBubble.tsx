import type { ReactNode } from 'react'
import { Text } from '@portfolio/ui'
import type { ChatMessage } from '../types.ts'
import styles from './MessageBubble.module.css'

const senders = {
  user: { label: 'VOS', tone: 'secondary' },
  assistant: { label: 'ASISTENTE / IA', tone: 'accent' },
} as const

type MessageBubbleProps = {
  role: ChatMessage['role']
  /** Burbuja ajustada al contenido en lugar del ancho de Figma (indicador de carga). */
  compact?: boolean
  children: ReactNode
  /** Contenido debajo de la burbuja, con su mismo ancho (CTA de contacto). */
  footer?: ReactNode
}

/** Figma: "Mensaje enviado" y "Mensaje recibido" — remitente y burbuja. */
export function MessageBubble({ role, compact = false, children, footer }: MessageBubbleProps) {
  const sender = senders[role]

  return (
    <li className={`${styles.message} ${styles[role]}`}>
      <Text as="span" variant="label" size="2xs" tone={sender.tone}>{sender.label}</Text>
      <div className={compact ? `${styles.bubble} ${styles.compact}` : styles.bubble}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </li>
  )
}
