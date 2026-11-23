import { Button, Icon } from '@portfolio/ui'
import type { ApiError, Contact } from '@portfolio/api'
import { ContactButtons } from './ContactButtons.tsx'
import styles from './ChatError.module.css'

type ChatErrorProps = {
  error: ApiError
  contact: Contact
  onRetry: () => void
}

function describe(error: ApiError) {
  if (error.status === 429) {
    return {
      label: 'DEMASIADOS MENSAJES',
      text: error.retryAfterSeconds
        ? `Estás escribiendo muy rápido. Probá de nuevo en ${error.retryAfterSeconds} segundos.`
        : 'Estás escribiendo muy rápido. Esperá un momento y probá de nuevo.',
    }
  }
  if (error.status === 503) {
    return {
      label: 'SERVICIO SATURADO',
      text: 'El asistente tiene mucha demanda ahora. Probá de nuevo en un rato o escribile directamente a Lisandro.',
    }
  }
  return {
    label: 'SIN CONEXIÓN',
    text: 'No pude conectarme con el asistente. Probá de nuevo o escribile directamente a Lisandro.',
  }
}

/** Error de la petición (429, 503, red, timeout). No definido en Figma: sigue el estilo de "Límite de consultas". */
export function ChatError({ error, contact, onRetry }: ChatErrorProps) {
  const { label, text } = describe(error)

  return (
    <div className={styles.error}>
      <p className={styles.status}>
        <Icon name="circle-alert" />
        {label}
      </p>
      <p className={styles.text}>{text}</p>
      <Button onClick={onRetry} className={styles.retry}>Reintentar</Button>
      <ContactButtons contact={contact} />
    </div>
  )
}
