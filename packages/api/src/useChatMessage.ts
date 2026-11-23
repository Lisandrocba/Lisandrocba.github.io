import { useCallback, useRef, useState } from 'react'
import { sendChatMessage } from './chat.ts'
import { ApiError } from './fetch.ts'
import type { ChatResponse } from './types.ts'

/**
 * Consumo de `POST /chat`. La petición sale solo al llamar a `send` (nunca desde un efecto),
 * así no se duplican mensajes ni consultas del límite.
 *
 * - `data`: última respuesta correcta. `error`: último error (se limpia al volver a enviar).
 * - `send(message)`: envía un mensaje. Mientras hay uno en curso, no hace nada y devuelve `null`.
 * - `refresh()`: reintenta el último mensaje (para el "Reintentar" de un error).
 * Ambos devuelven la respuesta, o `null` si falló o no se envió.
 */
export function useChatMessage() {
  const [data, setData] = useState<ChatResponse | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(false)
  const lastMessage = useRef<string | null>(null)
  const inFlight = useRef(false)

  const send = useCallback(async (message: string) => {
    if (inFlight.current) return null
    inFlight.current = true
    lastMessage.current = message
    setLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage(message)
      setData(response)
      return response
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError('network', 'Error inesperado al consultar la API'))
      return null
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    if (lastMessage.current === null) return null
    return send(lastMessage.current)
  }, [send])

  return { data, error, loading, send, refresh }
}
