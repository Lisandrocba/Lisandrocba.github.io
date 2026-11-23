import { ApiError, apiFetch } from './fetch.ts'
import type { ChatRequest, ChatResponse } from './types.ts'

export const MAX_MESSAGE_CHARS = 500

const VISITOR_KEY = 'portfolio-chat:visitorId'
const CONVERSATION_KEY = 'portfolio-chat:conversationId'

// El storage puede no estar disponible (modo privado, cookies bloqueadas): en ese caso el chat sigue sin ids.
function readId(storage: () => Storage, key: string) {
  try {
    return storage().getItem(key)
  } catch {
    return null
  }
}

function writeId(storage: () => Storage, key: string, value: string | null) {
  try {
    if (value === null) storage().removeItem(key)
    else storage().setItem(key, value)
  } catch {
    // Sin storage, el backend crea ids nuevos en cada mensaje.
  }
}

const local = () => localStorage
const session = () => sessionStorage

function postChat(body: ChatRequest) {
  return apiFetch<ChatResponse>('/chat', { method: 'POST', body })
}

/** Paths de los ids guardados que el backend rechazó por formato inválido (400). */
function rejectedIds(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 400) return []
  return (error.body?.details ?? []).map((detail) => detail.path).filter((path) => path === '/visitorId' || path === '/conversationId')
}

/**
 * Envía un mensaje a `POST /chat` y guarda los ids que devuelve el backend
 * (`visitorId` en localStorage, `conversationId` en sessionStorage).
 * Si un id guardado está corrupto, lo descarta y reintenta una sola vez sin él.
 */
export async function sendChatMessage(rawMessage: string): Promise<ChatResponse> {
  const message = rawMessage.trim()
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    throw new ApiError('invalid', `El mensaje tiene que tener entre 1 y ${MAX_MESSAGE_CHARS} caracteres`)
  }

  const request: ChatRequest = {
    visitorId: readId(local, VISITOR_KEY),
    conversationId: readId(session, CONVERSATION_KEY),
    message,
  }

  let data: ChatResponse
  try {
    data = await postChat(request)
  } catch (error) {
    const rejected = rejectedIds(error)
    if (rejected.length === 0) throw error

    const retry = { ...request }
    if (rejected.includes('/visitorId')) {
      writeId(local, VISITOR_KEY, null)
      retry.visitorId = null
    }
    if (rejected.includes('/conversationId')) {
      writeId(session, CONVERSATION_KEY, null)
      retry.conversationId = null
    }
    data = await postChat(retry)
  }

  // El backend es la autoridad: siempre se guardan los ids que devuelve.
  writeId(local, VISITOR_KEY, data.visitorId)
  writeId(session, CONVERSATION_KEY, data.conversationId)
  return data
}
