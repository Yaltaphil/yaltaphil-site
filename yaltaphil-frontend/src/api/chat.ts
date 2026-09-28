import type IChatMessage from '@/models/IChatMessage'

/** REST and the socket share one port on the backend; the `/api` prefix exists only so the
 *  browser can stay same-origin — vite.config.ts forwards it to yaltaphil-backend and strips
 *  the prefix again. In production the host needs the equivalent proxy rules. */
const REST_PATH = '/api/messages'
const SOCKET_PATH = '/api/ws'

/** Document exactly as Mongoose serialises it: `_id`, plus the `__v` we deliberately ignore. */
interface WireChatMessage {
  _id: string
  text: string
  author: string
  createdAt: string
}

/**
 * Normalised socket frame. Deliberately narrower than the wire protocol: the backend sends
 * `message:new` and `message:updated` with a full document and `message:deleted` with a bare
 * `id`, so the asymmetry is absorbed here instead of leaking into the UI.
 */
export type ChatFrame =
  | { event: 'message'; message: IChatMessage }
  | { event: 'removed'; id: string }

export const socketUrl = (): string =>
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${SOCKET_PATH}`

const toMessage = (wire: WireChatMessage): IChatMessage => ({
  id: wire._id,
  text: wire.text,
  author: wire.author,
  createdAt: wire.createdAt,
})

/**
 * fetch() rejects with a bare `TypeError: Failed to fetch` when nothing answers at all — the one
 * failure the reader can act on, so it gets a sentence instead of Chrome's internals.
 */
const call = async (init?: RequestInit): Promise<Response> => {
  try {
    return await fetch(REST_PATH, init)
  } catch {
    throw new Error('Server unreachable')
  }
}

/**
 * There is no ValidationPipe on the backend, so an empty or missing `text` is caught by
 * Mongoose's required path and surfaces as a bare 500 rather than a 400 — callers must
 * reject blank input here rather than rely on the server to.
 */
export const listMessages = async (): Promise<IChatMessage[]> => {
  const res = await call({ headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`History unavailable (${res.status})`)
  const wire = (await res.json()) as WireChatMessage[]
  return wire.map(toMessage)
}

export const postMessage = async (text: string, author: string): Promise<IChatMessage> => {
  const res = await call({
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ text, author }),
  })
  if (!res.ok) throw new Error(`Message rejected (${res.status})`)
  return toMessage((await res.json()) as WireChatMessage)
}

const asWireMessage = (value: unknown): WireChatMessage | null => {
  if (typeof value !== 'object' || value === null) return null
  const wire = value as Partial<WireChatMessage>
  if (typeof wire._id !== 'string' || typeof wire.text !== 'string') return null
  return { _id: wire._id, text: wire.text, author: wire.author ?? 'anonymous', createdAt: wire.createdAt ?? '' }
}

/** Anything unrecognised — including the `ready` handshake frame — returns null and is dropped. */
export const parseFrame = (raw: unknown): ChatFrame | null => {
  if (typeof raw !== 'string') return null

  let frame: unknown
  try {
    frame = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof frame !== 'object' || frame === null) return null

  const { event, data } = frame as { event?: unknown; data?: unknown }
  if (event === 'message:new' || event === 'message:updated') {
    const wire = asWireMessage(data)
    return wire ? { event: 'message', message: toMessage(wire) } : null
  }
  if (event === 'message:deleted') {
    const id = (data as { id?: unknown } | null)?.id
    // The backend echoes back the URL segment it was handed, so a delete issued against
    // `6ABA…` arrives verbatim — while documents carry Mongoose's lowercase hex. Normalise
    // here or that row is stranded in every open tab until the next reconnect re-reads it.
    return typeof id === 'string' ? { event: 'removed', id: id.toLowerCase() } : null
  }
  return null
}
