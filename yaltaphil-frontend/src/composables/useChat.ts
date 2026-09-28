import { onMounted, onUnmounted, ref } from 'vue'
import type IChatMessage from '@/models/IChatMessage'
import { listMessages, parseFrame, postMessage, socketUrl } from '@/api/chat'

const AUTHOR_KEY = 'chat-author'
const MAX_AUTHOR_LENGTH = 32
const MAX_MESSAGE_LENGTH = 500
const FIRST_RETRY_MS = 1000
const LAST_RETRY_MS = 15_000

export type ChatStatus = 'connecting' | 'online' | 'offline'

const storedAuthor = (): string => {
  const raw = localStorage.getItem(AUTHOR_KEY)
  return typeof raw === 'string' ? raw.trim().slice(0, MAX_AUTHOR_LENGTH) : ''
}

/**
 * Owns the messages list, the socket's lifecycle and the retry ladder. The socket is
 * push-only — every send goes over REST and comes back to us as a broadcast, which is what
 * makes all open tabs converge on the same list without any client-side protocol.
 */
export function useChat() {
  const messages = ref<IChatMessage[]>([])
  const status = ref<ChatStatus>('connecting')
  const author = ref(storedAuthor())
  const historyError = ref('')
  const sendError = ref('')
  const sending = ref(false)
  const loadingHistory = ref(true)

  let ws: WebSocket | null = null
  let retryTimer: number | null = null
  let attempt = 0
  let disposed = false
  let wasOnline = false

  const clearRetry = () => {
    if (retryTimer === null) return
    window.clearTimeout(retryTimer)
    retryTimer = null
  }

  /** Upsert rather than append: our own POST lands before its echo does, so a
   *  `message:new` we already have must replace, not duplicate. */
  const put = (incoming: IChatMessage) => {
    const at = messages.value.findIndex((m) => m.id === incoming.id)
    if (at === -1) messages.value.push(incoming)
    else messages.value[at] = incoming
    // Broadcasts carry no ordering guarantee between separate writes.
    messages.value.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  const drop = (id: string) => {
    messages.value = messages.value.filter((m) => m.id !== id)
  }

  const loadHistory = async () => {
    historyError.value = ''
    try {
      messages.value = await listMessages()
    } catch (error) {
      historyError.value = error instanceof Error ? error.message : 'History unavailable'
    } finally {
      loadingHistory.value = false
    }
  }

  const detach = () => {
    if (!ws) return
    // Nulling the handlers first is what stops a deliberate close from scheduling a retry.
    ws.onopen = null
    ws.onmessage = null
    ws.onclose = null
    ws.close()
    ws = null
  }

  const connect = () => {
    if (disposed || ws || retryTimer !== null) return
    status.value = 'connecting'

    let socket: WebSocket
    try {
      socket = new WebSocket(socketUrl())
    } catch {
      status.value = 'offline'
      scheduleRetry()
      return
    }
    ws = socket

    socket.onopen = () => {
      attempt = 0
      status.value = 'online'
      // Frames emitted while we were away are gone for good, so a reconnect re-reads the list.
      if (wasOnline) void loadHistory()
      wasOnline = true
    }

    socket.onmessage = (event) => {
      const frame = parseFrame(event.data)
      if (!frame) return
      if (frame.event === 'message') put(frame.message)
      else drop(frame.id)
    }

    // No onerror handler on purpose: a failed socket always reaches close, so close is the
    // single place that decides what happens next.
    socket.onclose = () => {
      if (ws === socket) ws = null
      if (disposed) return
      status.value = 'offline'
      scheduleRetry()
    }
  }

  function scheduleRetry() {
    if (disposed || retryTimer !== null) return
    retryTimer = window.setTimeout(
      () => {
        retryTimer = null
        connect()
      },
      Math.min(FIRST_RETRY_MS * 2 ** attempt, LAST_RETRY_MS),
    )
    attempt++
  }

  /** Manual "Try again": jumps the ladder and re-reads history in case REST is back first. */
  const retry = () => {
    clearRetry()
    detach()
    attempt = 0
    void loadHistory()
    connect()
  }

  const signIn = (name: string): boolean => {
    const clean = name.trim().slice(0, MAX_AUTHOR_LENGTH)
    if (!clean) return false
    author.value = clean
    localStorage.setItem(AUTHOR_KEY, clean)
    sendError.value = ''
    return true
  }

  /** Clears the stored name; kept separate from sign-in so the gate can be re-shown
   *  to switch identities without touching the message list. */
  const signOut = () => {
    localStorage.removeItem(AUTHOR_KEY)
    author.value = ''
    sendError.value = ''
  }

  /** Returns whether the message reached the server, so the caller knows whether to clear the draft. */
  const send = async (rawText: string): Promise<boolean> => {
    const text = rawText.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!text || !author.value) return false

    sendError.value = ''
    if (status.value !== 'online') {
      sendError.value = 'Not connected — the message was not sent.'
      return false
    }

    sending.value = true
    try {
      put(await postMessage(text, author.value))
      return true
    } catch (error) {
      sendError.value = error instanceof Error ? error.message : 'Message not sent.'
      return false
    } finally {
      sending.value = false
    }
  }

  onMounted(() => {
    void loadHistory()
    connect()
  })

  onUnmounted(() => {
    disposed = true
    clearRetry()
    detach()
  })

  return {
    messages,
    status,
    author,
    historyError,
    sendError,
    sending,
    loadingHistory,
    maxMessageLength: MAX_MESSAGE_LENGTH,
    maxAuthorLength: MAX_AUTHOR_LENGTH,
    retry,
    signIn,
    signOut,
    send,
  }
}
