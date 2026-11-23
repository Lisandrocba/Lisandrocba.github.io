import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MAX_MESSAGE_CHARS } from '@portfolio/api'
import { IconButton } from '@portfolio/ui'
import styles from './ChatComposer.module.css'

type ChatComposerProps = {
  /** Límite alcanzado: Figma "Compositor deshabilitado" (`69:817`). */
  disabled: boolean
  /** Esperando o escribiendo una respuesta: no se puede escribir ni enviar. */
  busy: boolean
  /** Consultas que quedan hoy según el backend; `null` antes de la primera respuesta. */
  remaining: number | null
  onSend: (question: string) => void
}

function noteText(disabled: boolean, remaining: number | null) {
  if (disabled) return 'Podés seguir la charla por LinkedIn o Email.'
  if (remaining === null) return 'Una conversación sobre mi recorrido profesional.'
  if (remaining === 0) return 'No te quedan consultas por hoy.'
  return remaining === 1 ? 'Te queda 1 consulta por hoy.' : `Te quedan ${remaining} consultas por hoy.`
}

/** Figma: "Compositor de consulta" (`69:733`). */
export function ChatComposer({ disabled, busy, remaining, onSend }: ChatComposerProps) {
  const [question, setQuestion] = useState('')
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const wasBusy = useRef(busy)

  // El input se deshabilita mientras espera y pierde el foco: al terminar, vuelve a él.
  useEffect(() => {
    if (wasBusy.current && !busy && !disabled) inputRef.current?.focus()
    wasBusy.current = busy
  }, [busy, disabled])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !question.trim()) return
    onSend(question)
    setQuestion('')
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className={disabled ? `${styles.status} ${styles.ended}` : styles.status}>
        {disabled ? 'SESIÓN FINALIZADA' : 'TU CONSULTA'}
      </label>
      <div className={styles.field}>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={styles.input}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={disabled ? 'Consultas agotadas' : 'Escribí tu pregunta...'}
          maxLength={MAX_MESSAGE_CHARS}
          autoComplete="off"
          disabled={disabled || busy}
        />
        <IconButton
          type="submit"
          variant="primary"
          icon={disabled ? 'lock-keyhole' : 'arrow-up-large'}
          label={disabled ? 'Envío deshabilitado' : busy ? 'Esperando la respuesta' : 'Enviar consulta'}
          disabled={disabled}
          // `aria-disabled` y no `disabled`: si el botón tiene el foco, no lo pierde mientras espera.
          aria-disabled={busy && !disabled ? true : undefined}
        />
      </div>
      <p className={styles.note}>{noteText(disabled, remaining)}</p>
    </form>
  )
}
