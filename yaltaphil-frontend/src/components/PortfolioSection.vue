<script setup lang="ts">
import PortfolioItem from './PortfolioItem.vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import type IProject from '@/models/IProject'

defineProps<{
  projects: IProject[]
}>()

const { el: heading, visible: headingVisible } = useIntersectionObserver(0.3)
const { el: grid, visible: gridVisible } = useIntersectionObserver(0.05)
</script>

<template>
  <section id="portfolio" class="py-20 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-4">

      <div ref="heading" :class="['fade-in-up', { visible: headingVisible }]">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Portfolio
        </h2>
      </div>

      <div
        ref="grid"
        :class="['flex flex-wrap justify-center gap-8', { 'section-visible': gridVisible }]"
      >
        <div
          v-for="(item, i) in projects"
          :key="i"
          class="stagger-item"
          :style="{ '--delay': `${i * 0.1}s` }"
        >
          <PortfolioItem :item="item" />
        </div>
      </div>

    </div>
  </section>
</template>
