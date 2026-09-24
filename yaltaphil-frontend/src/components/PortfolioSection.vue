<script setup lang="ts">
import PortfolioItem from './PortfolioItem.vue'
import SectionHeading from './SectionHeading.vue'
import { useReveal } from '@/composables/useReveal'
import type IProject from '@/models/IProject'

defineProps<{
  projects: IProject[]
}>()

const { el: grid, visible: gridVisible } = useReveal(0.05)
</script>

<template>
  <section id="portfolio" class="py-20 md:py-24 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-content mx-auto px-4">

      <SectionHeading
        eyebrow="Selected work"
        title="Portfolio"
        subtitle="Products and prototypes I built or contributed to — from streaming platforms to landing pages."
      />

      <div
        ref="grid"
        :class="['grid gap-6 sm:grid-cols-2 lg:grid-cols-3', { 'section-visible': gridVisible }]"
      >
        <div
          v-for="(item, i) in projects"
          :key="item.link"
          class="stagger-item"
          :style="{ '--delay': `${i * 0.08}s` }"
        >
          <PortfolioItem :item="item" class="h-full" />
        </div>
      </div>

    </div>
  </section>
</template>
