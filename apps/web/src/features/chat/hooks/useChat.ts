import { useCallback, useEffect, useRef, useState } from 'react'
import { useChatMessage } from '@portfolio/api'
import type { ChatReason, ChatResponse, Contact } from '@portfolio/api'
import { profile } from '../../../pages/home/data/profile.ts'
import type { ChatView } from '../types.ts'

const VIEW_KEY = 'portfolio-chat:view'
const LIMIT_REASONS: ChatReason[] = ['QUERY_LIMIT', 'ABUSE_LIMIT', 'GLOBAL_LIMIT']

/** Contacto mientras el backend no haya respondido (o si falla): los datos que ya muestra el portfolio. */
const FALLBACK_CONTACT: Contact = { email: profile.email, linkedinUrl: profile.linkedin.href, phone: null }

function isChatView(value: unknown): value is ChatView {
  return typeof value === 'object' && value !== null && 'messages' in value && Array.isArray(value.messages) && 'last' in value
}

function readView(): ChatView {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(VIEW_KEY) ?? 'null')
    if (isChatView(stored)) return stored
  } catch {
    // Storage no disponible o contenido corrupto: se empieza de cero.
  }
  return { messages: [], last: null }
}

function writeView(view: ChatView) {
  try {
    sessionStorage.setItem(VIEW_KEY, JSON.stringify(view))
  } catch {
    // Sin storage, la conversación no se restaura al recargar.
  }
}

/**
 * Conversación con el asistente de portfolio-back. El backend decide el límite y el CTA; acá solo se refleja.
 * - `isPending`: esperando la respuesta. `revealingId`: respuesta que se está escribiendo (`finishReveal` al terminar).
 * - `isBusy`: no se puede enviar (esperando o escribiendo).
 * - `isLimitReached`: el backend respondió con un límite y la respuesta ya terminó de escribirse.
 * - `error`: error de la última petición (429, 503, red, timeout); `retry` reenvía el último mensaje.
 */
export function useChat() {
  const [view, setView] = useState(readView)
  const [revealingId, setRevealingId] = useState<number | null>(null)
  const request = useChatMessage()
  const nextId = useRef(view.messages.reduce((max, message) => Math.max(max, message.id + 1), 0))

  useEffect(() => {
    writeView(view)
  }, [view])

  const isBusy = request.loading || revealingId !== null
  const isLimitReached = view.last !== null && LIMIT_REASONS.includes(view.last.reason) && !isBusy

  const appendAnswer = useCallback((response: ChatResponse | null) => {
    if (!response) return
    const id = nextId.current++
    const showContact = (response.reason === 'OK' && response.showCta) || response.reason === 'LLM_UNAVAILABLE'

    setView((current) => ({
      messages: [
        ...current.messages,
        { id, role: 'assistant', text: response.reply, cta: showContact ? response.contact : undefined },
      ],
      last: { reason: response.reason, remaining: response.remaining, contact: response.contact },
    }))
    setRevealingId(id)
  }, [])

  const { send: sendRequest, refresh } = request

  const send = useCallback(
    async (question: string) => {
      const text = question.trim()
      if (!text || isBusy || isLimitReached) return

      setView((current) => ({ ...current, messages: [...current.messages, { id: nextId.current++, role: 'user', text }] }))
      appendAnswer(await sendRequest(text))
    },
    [isBusy, isLimitReached, sendRequest, appendAnswer],
  )

  const retry = useCallback(async () => appendAnswer(await refresh()), [refresh, appendAnswer])
  const finishReveal = useCallback(() => setRevealingId(null), [])

  return {
    messages: view.messages,
    remaining: view.last?.remaining ?? null,
    contact: view.last?.contact ?? FALLBACK_CONTACT,
    error: request.error,
    isPending: request.loading,
    isBusy,
    isLimitReached,
    revealingId,
    send,
    retry,
    finishReveal,
  }
}
