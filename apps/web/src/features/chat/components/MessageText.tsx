import { useTypewriter } from '../hooks/useTypewriter.ts'
import styles from './MessageText.module.css'

type MessageTextProps = {
  text: string
  /** Escribe el texto carácter por carácter con un cursor `_` (animación no definida en Figma). */
  animate?: boolean
  onRevealEnd?: () => void
}

const noop = () => {}

/**
 * Párrafos de un mensaje (separados por una línea en blanco).
 * El texto completo queda siempre para lectores de pantalla; la versión animada es solo visual.
 */
export function MessageText({ text, animate = false, onRevealEnd = noop }: MessageTextProps) {
  const visible = useTypewriter(text, animate, onRevealEnd)
  const paragraphs = text.split(/\n{2,}/)
  const visibleParagraphs = text.slice(0, visible).split(/\n{2,}/)

  return (
    <>
      <div className={styles.srOnly}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.paragraphs} aria-hidden="true">
        {visibleParagraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph}
            {animate && index === visibleParagraphs.length - 1 && <span className={styles.cursor}>_</span>}
          </p>
        ))}
      </div>
    </>
  )
}
