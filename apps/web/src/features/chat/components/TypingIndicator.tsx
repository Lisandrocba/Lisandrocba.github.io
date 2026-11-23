import styles from './TypingIndicator.module.css'

/** Carga de la respuesta (no definida en Figma): tres puntos de acento, como el "Indicador" del encabezado. */
export function TypingIndicator() {
  return (
    <>
      <span className={styles.srOnly}>El asistente está escribiendo una respuesta…</span>
      <span className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
    </>
  )
}
