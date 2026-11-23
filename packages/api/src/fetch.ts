import type { ApiErrorBody } from './types.ts'

/** El backend espera al LLM hasta 15 s por proveedor (`docu-for-fe.md` §6). */
const TIMEOUT_MS = 30_000

/**
 * - `http`: respuesta con status de error (400, 429, 503…).
 * - `network`: sin conexión, CORS o respuesta ilegible.
 * - `timeout`: no respondió en 30 s.
 * - `invalid`: el mensaje no cumple el contrato y no se envió.
 */
export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'invalid'

type ApiErrorOptions = {
  status?: number | null
  body?: ApiErrorBody | null
  retryAfterSeconds?: number | null
}

/** Único tipo de error que devuelve el paquete. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  readonly body: ApiErrorBody | null
  /** Segundos del header `Retry-After` (429). `null` si no viene o el CORS del back no lo expone. */
  readonly retryAfterSeconds: number | null

  constructor(kind: ApiErrorKind, message: string, { status = null, body = null, retryAfterSeconds = null }: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.body = body
    this.retryAfterSeconds = retryAfterSeconds
  }
}

type ApiRequest = {
  method?: 'GET' | 'POST'
  /** Se envía como JSON. */
  body?: unknown
}

/** `fetch` a portfolio-back: URL base de `VITE_API_URL`, JSON, timeout de 30 s y errores normalizados en `ApiError`. */
export async function apiFetch<T>(path: string, { method = 'GET', body }: ApiRequest = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) throw new ApiError('network', 'VITE_API_URL no está definida')

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('timeout', 'La API no respondió a tiempo')
    }
    throw new ApiError('network', 'No se pudo conectar con la API')
  }

  if (!response.ok) {
    const errorBody: ApiErrorBody | null = await response.json().catch(() => null)
    const retryAfter = Number(response.headers.get('retry-after'))
    throw new ApiError('http', errorBody?.message ?? `HTTP ${response.status}`, {
      status: response.status,
      body: errorBody,
      retryAfterSeconds: retryAfter > 0 ? retryAfter : null,
    })
  }

  try {
    const data: T = await response.json()
    return data
  } catch {
    throw new ApiError('network', 'La API devolvió una respuesta ilegible', { status: response.status })
  }
}
