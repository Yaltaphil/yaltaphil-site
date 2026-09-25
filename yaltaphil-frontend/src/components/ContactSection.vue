<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import SectionHeading from './SectionHeading.vue'
import { useReveal } from '@/composables/useReveal'

const { el: cards, visible: cardsVisible } = useReveal(0.1)

const EMAIL = 'yaltaphil@gmail.com'

const channels = [
  { icon: 'mail',     label: 'Email',    value: EMAIL,               href: `mailto:${EMAIL}`,        external: false },
  { icon: 'telegram', label: 'Telegram', value: 't.me/Yaltaphil',    href: 'https://t.me/Yaltaphil', external: true },
  { icon: 'github',   label: 'GitHub',   value: 'github.com/yaltaphil', href: 'https://github.com/yaltaphil', external: true },
] as const

const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: number | undefined

const copyLabel = computed(() => {
  if (copyState.value === 'copied') return 'Copied'
  if (copyState.value === 'failed') return 'Copy failed — select it above'
  return 'Copy email'
})

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
    copyState.value = 'copied'
  } catch {
    // Insecure context or a denied permission. The address is on screen either way,
    // so the button degrades to a message instead of a dead click.
    copyState.value = 'failed'
  }
  window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => { copyState.value = 'idle' }, 2500)
}

onUnmounted(() => window.clearTimeout(resetTimer))
</script>

<template>
  <section id="contact" class="py-20 md:py-24 bg-gray-50 dark:bg-gray-950 print:hidden">
    <div class="max-w-content mx-auto px-4 text-center">

      <SectionHeading
        eyebrow="Availability"
        title="Get in touch"
        subtitle="Looking for a frontend role in a team with a strong engineering process. Remote work is welcome. I usually reply within a day."
      />

      <!-- The ref sits on the wrapper, not the card row: the copy button is a `.stagger-item`
           too, and outside `.section-visible` it would stay at opacity 0 forever. -->
      <div ref="cards" :class="[{ 'section-visible': cardsVisible }]">
        <div class="flex flex-wrap justify-center gap-4 md:gap-6">
          <a
            v-for="(c, i) in channels"
            :key="c.href"
            :href="c.href"
            :target="c.external ? '_blank' : undefined"
            :rel="c.external ? 'noopener' : undefined"
            class="stagger-item group flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-brand-200 dark:hover:border-brand-700 transition-all duration-200 text-gray-800 dark:text-white font-medium"
            :style="{ '--delay': `${i * 0.1}s` }"
          >
            <span class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
              <AppIcon :name="c.icon" class="w-5 h-5" />
            </span>
            <span class="text-left">
              <span class="block text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{{ c.label }}</span>
              <span class="block text-sm break-all">{{ c.value }}</span>
            </span>
          </a>
        </div>

        <div class="stagger-item mt-8 flex justify-center" :style="{ '--delay': '0.3s' }">
          <button
            type="button"
            @click="copyEmail"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-card transition-all duration-200 hover:border-brand-200 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-brand-700"
          >
            <AppIcon :name="copyState === 'copied' ? 'check' : 'mail'" class="w-4 h-4" />
            <span aria-live="polite">{{ copyLabel }}</span>
          </button>
        </div>
      </div>

    </div>
  </section>
</template>
