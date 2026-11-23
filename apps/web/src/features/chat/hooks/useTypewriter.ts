import { useEffect, useState } from 'react'

const TICK_MS = 15
/** Las respuestas largas escriben varios caracteres por paso para no superar esta duración. */
const MAX_DURATION_MS = 4000

/**
 * Cantidad de caracteres visibles de `text` mientras se escribe.
 * Con `active` en `false` (o con `prefers-reduced-motion`) el texto se muestra completo.
 * El estado vive en el componente, así que reabrir el drawer no repite la animación.
 */
export function useTypewriter(text: string, active: boolean, onDone: () => void) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }

    const step = Math.max(1, Math.ceil(text.length / (MAX_DURATION_MS / TICK_MS)))
    let visible = 0
    const interval = window.setInterval(() => {
      visible = Math.min(visible + step, text.length)
      setCount(visible)
      if (visible === text.length) {
        window.clearInterval(interval)
        onDone()
      }
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [text, active, onDone])

  return active ? count : text.length
}
