// Contrato de portfolio-back (`docu-for-fe.md` §7). Si no coincide con `GET /docs/json`, gana `/docs/json`.

export type ChatReason = 'OK' | 'QUERY_LIMIT' | 'ABUSE_LIMIT' | 'GLOBAL_LIMIT' | 'LLM_UNAVAILABLE'

export type ChatRequest = {
  visitorId?: string | null
  conversationId?: string | null
  /** 1 a 500 caracteres después del trim. */
  message: string
}

export type Contact = {
  email: string
  linkedinUrl: string
  /** `null` hasta que el visitante deja sus datos. */
  phone: string | null
}

export type ChatResponse = {
  visitorId: string
  conversationId: string
  /** Texto plano: nunca interpretarlo como HTML ni Markdown. */
  reply: string
  /** Consultas que le quedan hoy al visitante. */
  remaining: number
  showCta: boolean
  reason: ChatReason
  contact: Contact
}

export type ApiErrorBody = {
  statusCode: number
  error: string
  message: string
  /** Solo en los 400 de validación. */
  details?: { path: string; message: string }[]
}
