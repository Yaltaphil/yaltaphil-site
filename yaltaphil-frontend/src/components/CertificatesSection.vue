<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import SectionHeading from './SectionHeading.vue'
import { certificates } from '@/assets/data/certificates'
import { useReveal } from '@/composables/useReveal'
import { useScrollLock } from '@/composables/useScrollLock'

const current = ref<number | null>(null)
const closeBtn = ref<HTMLElement | null>(null)
const cert = computed(() => (current.value === null ? null : certificates[current.value]))

const { lock, unlock } = useScrollLock()
const { el: grid, visible: gridVisible } = useReveal(0.05)

// Return focus to the tile that opened the overlay, not to wherever the page drifted.
let trigger: HTMLElement | null = null

function open(index: number, event: MouseEvent) {
  trigger = event.currentTarget as HTMLElement
  current.value = index
  lock()
  window.addEventListener('keydown', onKey)
  void nextTick(() => closeBtn.value?.focus())
}

function close() {
  if (current.value === null) return
  current.value = null
  window.removeEventListener('keydown', onKey)
  unlock()
  trigger?.focus()
  trigger = null
}

function step(delta: number) {
  if (current.value === null) return
  current.value = (current.value + delta + certificates.length) % certificates.length
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section id="certificates" class="py-20 md:py-24 bg-white dark:bg-gray-900">
    <div class="max-w-content mx-auto px-4">

      <SectionHeading
        eyebrow="Learning"
        title="Certificates"
        subtitle="Conference and course certificates. Click any of them to open the full scan."
      />

      <div
        ref="grid"
        :class="['grid grid-cols-2 md:grid-cols-5 gap-4', { 'section-visible': gridVisible }]"
      >
        <button
          v-for="(c, i) in certificates"
          :key="c.full"
          @click="open(i, $event)"
          :aria-label="`Open certificate: ${c.title}`"
          class="stagger-item group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          :style="{ '--delay': `${i * 0.08}s` }"
        >
          <!-- object-contain: cropping a document at its serial number is not a thumbnail. -->
          <span class="block aspect-[3/2] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <img
              :src="c.thumb"
              :alt="c.alt"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-contain p-1.5 group-hover:scale-[1.03] transition-transform duration-300"
            />
          </span>
          <span class="block px-2.5 py-2 text-left">
            <span class="block text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2">
              {{ c.title }}
            </span>
            <span class="mt-0.5 block text-[11px] text-gray-400 dark:text-gray-500 font-mono">
              {{ c.issuer }} · {{ c.year }}
            </span>
          </span>
        </button>
      </div>

    </div>

    <!-- Lightbox -->
    <Transition name="lb-backdrop">
      <div
        v-if="cert"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        :aria-label="`Certificate: ${cert.title}`"
        @click.self="close"
      >
        <Transition name="lb-card" appear>
          <div v-if="cert" class="relative w-full max-w-3xl flex flex-col items-center gap-3">
            <div class="relative w-full">
              <button
                ref="closeBtn"
                @click="close"
                aria-label="Close certificate"
                class="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <AppIcon name="close" class="w-4 h-4" />
              </button>

              <img
                :src="cert.full"
                :alt="cert.alt"
                class="w-full max-h-[75vh] object-contain rounded-xl shadow-2xl bg-white"
              />

              <button
                v-if="certificates.length > 1"
                @click="step(-1)"
                aria-label="Previous certificate"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <AppIcon name="chevron-down" class="w-5 h-5 rotate-90" />
              </button>
              <button
                v-if="certificates.length > 1"
                @click="step(1)"
                aria-label="Next certificate"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <AppIcon name="chevron-down" class="w-5 h-5 -rotate-90" />
              </button>
            </div>

            <p class="text-center text-white/85 text-sm">
              <span class="font-semibold">{{ cert.title }}</span>
              <span class="text-white/50"> — {{ cert.issuer }}, {{ cert.year }}</span>
              <span class="hidden sm:inline text-white/35"> · ← → to browse, Esc to close</span>
            </p>
          </div>
        </Transition>
      </div>
    </Transition>

  </section>
</template>

<style scoped>
/* Backdrop */
.lb-backdrop-enter-active { transition: opacity 0.25s ease; }
.lb-backdrop-leave-active { transition: opacity 0.2s ease; }
.lb-backdrop-enter-from,
.lb-backdrop-leave-to { opacity: 0; }

/* Card */
.lb-card-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lb-card-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.lb-card-enter-from {
  opacity: 0;
  transform: scale(0.82);
}
.lb-card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
