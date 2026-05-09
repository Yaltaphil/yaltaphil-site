<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const { el: heading, visible: headingVisible } = useIntersectionObserver(0.3)
const { el: cards, visible: cardsVisible } = useIntersectionObserver(0.1)
</script>

<template>
  <section id="contact" class="py-20 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-4 text-center">

      <div ref="heading" :class="['fade-in-up', { visible: headingVisible }]">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Get in touch
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-10">
          Looking for frontend development cooperation — freelancing or remote work.
        </p>
      </div>

      <div
        ref="cards"
        :class="['flex flex-wrap justify-center gap-6', { 'section-visible': cardsVisible }]"
      >
        <a
          href="mailto:yaltaphil@gmail.com"
          class="stagger-item flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-gray-800 dark:text-white font-medium"
          style="--delay: 0s"
        >
          <img alt="email" class="w-6 h-6" src="/img/icons/email.svg" />
          yaltaphil@gmail.com
        </a>
        <a
          href="https://t.me/Yaltaphil"
          target="_blank"
          rel="noopener"
          class="stagger-item flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-gray-800 dark:text-white font-medium"
          style="--delay: 0.1s"
        >
          <img alt="telegram" class="w-6 h-6" src="/img/icons/telegram.svg" />
          t.me/Yaltaphil
        </a>
        <a
          href="https://github.com/yaltaphil"
          target="_blank"
          rel="noopener"
          class="stagger-item flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-gray-800 dark:text-white font-medium"
          style="--delay: 0.2s"
        >
          <img alt="github" class="w-6 h-6" src="/img/icons/github.svg" />
          github.com/yaltaphil
        </a>
      </div>

    </div>
  </section>
</template>
