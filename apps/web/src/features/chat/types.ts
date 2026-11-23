import type { ChatResponse, Contact } from '@portfolio/api'

export type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  /** Texto plano. Los párrafos se separan con una línea en blanco. */
  text: string
  /** Solo en respuestas: contacto a mostrar debajo (CTA con `showCta` o `LLM_UNAVAILABLE`). */
  cta?: Contact
}

/** Lo que se guarda en sessionStorage para restaurar la vista al recargar. */
export type ChatView = {
  messages: ChatMessage[]
  /** Estado de la última respuesta: decide límite, consultas restantes y contacto. */
  last: Pick<ChatResponse, 'reason' | 'remaining' | 'contact'> | null
}
