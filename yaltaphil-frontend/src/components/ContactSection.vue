<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import SectionHeading from './SectionHeading.vue'
import { useReveal } from '@/composables/useReveal'

const { el: cards, visible: cardsVisible } = useReveal(0.1)

const channels = [
  { icon: 'mail',     label: 'Email',    value: 'yaltaphil@gmail.com', href: 'mailto:yaltaphil@gmail.com', external: false },
  { icon: 'telegram', label: 'Telegram', value: 't.me/Yaltaphil',      href: 'https://t.me/Yaltaphil',     external: true },
  { icon: 'github',   label: 'GitHub',   value: 'github.com/yaltaphil',href: 'https://github.com/yaltaphil',external: true },
] as const
</script>

<template>
  <section id="contact" class="py-20 md:py-24 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-content mx-auto px-4 text-center">

      <SectionHeading
        eyebrow="Availability"
        title="Get in touch"
        subtitle="Looking for frontend development cooperation — freelancing or remote work. I usually reply within a day."
      />

      <div
        ref="cards"
        :class="['flex flex-wrap justify-center gap-4 md:gap-6', { 'section-visible': cardsVisible }]"
      >
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
            <span class="block text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">{{ c.label }}</span>
            <span class="block text-sm break-all">{{ c.value }}</span>
          </span>
        </a>
      </div>

    </div>
  </section>
</template>
