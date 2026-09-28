<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useChat } from '@/composables/useChat'
import type { ChatStatus } from '@/composables/useChat'

const {
  messages,
  status,
  author,
  historyError,
  sendError,
  sending,
  loadingHistory,
  maxMessageLength,
  maxAuthorLength,
  retry,
  signIn,
  signOut,
  send,
} = useChat()

const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })

// One derived pass instead of helpers in the markup: an unparseable timestamp must not
// reach Intl.DateTimeFormat, which throws RangeError on an Invalid Date.
const rows = computed(() =>
  messages.value.map((m) => {
    const at = Date.parse(m.createdAt)
    return {
      id: m.id,
      text: m.text,
      author: m.author,
      mine: m.author === author.value,
      time: Number.isNaN(at) ? '' : clock.format(at),
      full: Number.isNaN(at) ? '' : new Date(at).toLocaleString(),
    }
  }),
)

const nameDraft = ref('')
const draft = ref('')
const nameField = ref<HTMLInputElement | null>(null)
const composer = ref<HTMLInputElement | null>(null)
const scroller = ref<HTMLElement | null>(null)

// Scrolling up should not be fought by an incoming message, so the list only follows
// the bottom while the reader is already near it.
const pinned = ref(true)

const onScroll = () => {
  const el = scroller.value
  if (!el) return
  pinned.value = el.scrollHeight - el.scrollTop - el.clientHeight < 96
}

const scrollToBottom = () => {
  const el = scroller.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(
  () => messages.value.length,
  async () => {
    if (!pinned.value) return
    await nextTick()
    scrollToBottom()
  },
)

watch(author, async (value) => {
  if (!value) return
  await nextTick()
  composer.value?.focus()
})

onMounted(async () => {
  if (author.value) return
  await nextTick()
  nameField.value?.focus()
})

const submitName = () => {
  signIn(nameDraft.value)
}

/** Keeps the current name in the field so "change" is an edit, not a blank slate. */
const changeName = () => {
  nameDraft.value = author.value
  signOut()
}

const submitMessage = async () => {
  pinned.value = true
  if (await send(draft.value)) draft.value = ''
  else scrollToBottom()
}

const statusLabel: Record<ChatStatus, string> = {
  connecting: 'Connecting',
  online: 'Live',
  offline: 'Offline',
}
</script>

<template>
  <div class="flex flex-col h-[100dvh] overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans">
    <header
      class="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div class="max-w-content mx-auto flex items-center justify-between gap-4 px-4 h-16">
        <a
          href="/"
          class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-white transition-colors duration-150 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span aria-hidden="true" class="text-base leading-none">&larr;</span>
          <span class="font-semibold text-sm">yaltaphil</span>
        </a>

        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            :class="{
              'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200':
                status === 'online',
              'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200':
                status === 'connecting',
              'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200':
                status === 'offline',
            }"
            :aria-label="`Connection status: ${statusLabel[status]}`"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="{
                'bg-emerald-500': status === 'online',
                'bg-amber-500 animate-pulse': status === 'connecting',
                'bg-rose-500': status === 'offline',
              }"
              aria-hidden="true"
            />
            {{ statusLabel[status] }}
          </span>
          <button
            v-if="author"
            type="button"
            @click="changeName"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-white transition-colors duration-150 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {{ author }} · change
          </button>
        </div>
      </div>
    </header>

    <!-- Name gate. There is no account system, so a display name is all a message needs. -->
    <main v-if="!author" class="flex-1 grid place-items-center px-4">
      <form
        @submit.prevent="submitName"
        class="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-card p-6"
      >
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Demo chat</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pick a display name to join. Messages are stored on a public demo server with no
          account and no privacy — write nothing you would not say out loud.
        </p>
        <label
          for="chat-name"
          class="block mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Display name
        </label>
        <input
          id="chat-name"
          ref="nameField"
          v-model="nameDraft"
          type="text"
          :maxlength="maxAuthorLength"
          autocomplete="nickname"
          placeholder="yalta"
          class="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        <button
          type="submit"
          :disabled="!nameDraft.trim()"
          class="mt-4 w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors duration-150 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Enter chat
        </button>
      </form>
    </main>

    <template v-else>
      <main class="flex-1 min-h-0 flex flex-col">
        <div
          v-if="historyError"
          class="shrink-0 border-b border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 px-4 py-3"
        >
          <div class="max-w-content mx-auto flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-rose-800 dark:text-rose-200">
              {{ historyError }} — the backend may not be running.
            </p>
            <button
              type="button"
              @click="retry"
              class="rounded-lg border border-rose-300 dark:border-rose-700 px-3 py-1.5 text-sm font-medium text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Try again
            </button>
          </div>
        </div>

        <div
          ref="scroller"
          @scroll.passive="onScroll"
          class="flex-1 overflow-y-auto px-4 py-6"
        >
          <p
            v-if="loadingHistory"
            class="max-w-content mx-auto text-sm text-gray-500 dark:text-gray-400"
          >
            Loading messages…
          </p>
          <p
            v-else-if="!rows.length && !historyError"
            class="max-w-content mx-auto text-sm text-gray-500 dark:text-gray-400"
          >
            No messages yet — say the first one.
          </p>

          <ol v-else role="log" aria-live="polite" class="max-w-content mx-auto space-y-3">
            <li
              v-for="row in rows"
              :key="row.id"
              class="flex"
              :class="row.mine ? 'justify-end' : 'justify-start'"
            >
              <div class="max-w-[85%] sm:max-w-[70%]">
                <p
                  v-if="!row.mine"
                  class="mb-1 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400"
                >
                  {{ row.author }}
                </p>
                <p
                  :title="row.full"
                  class="whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm shadow-card"
                  :class="
                    row.mine
                      ? 'bg-brand-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-bl-sm'
                  "
                >
                  {{ row.text }}
                </p>
                <p
                  class="mt-1 px-1 text-right text-[11px] text-gray-400 dark:text-gray-500"
                >
                  {{ row.time }}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </main>

      <footer class="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        <form @submit.prevent="submitMessage" class="max-w-content mx-auto">
          <div class="flex items-end gap-2">
            <label for="chat-composer" class="sr-only">Message</label>
            <input
              id="chat-composer"
              ref="composer"
              v-model="draft"
              type="text"
              :maxlength="maxMessageLength"
              autocomplete="off"
              :placeholder="status === 'online' ? 'Type a message' : 'Waiting for the server…'"
              class="flex-1 min-w-0 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-60"
            />
            <button
              type="submit"
              :disabled="!draft.trim() || sending || status !== 'online'"
              class="shrink-0 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors duration-150 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Send
            </button>
          </div>
          <p v-if="sendError" class="mt-2 text-sm text-rose-700 dark:text-rose-300" role="alert">
            {{ sendError }}
          </p>
        </form>
      </footer>
    </template>
  </div>
</template>
