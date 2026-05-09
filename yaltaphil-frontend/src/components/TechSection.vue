<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

interface ITechnology {
  title: string
  logo: string
}

defineProps<{
  technologies: ITechnology[]
}>()

const { el: heading, visible: headingVisible } = useIntersectionObserver(0.3)
const { el: grid, visible: gridVisible } = useIntersectionObserver(0.05)
</script>

<template>
  <section class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4">

      <div ref="heading" :class="['fade-in-up', { visible: headingVisible }]">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Tech Stack
        </h2>
        <p class="text-center text-gray-500 dark:text-gray-400 mb-12 text-sm">
          {{ technologies.length }} technologies
        </p>
      </div>

      <div
        ref="grid"
        :class="['flex flex-wrap justify-center gap-8', { 'section-visible': gridVisible }]"
      >
        <div
          v-for="(tech, i) in technologies"
          :key="i"
          class="flex flex-col items-center gap-2 group stagger-item"
          :style="{ '--delay': `${i * 0.05}s` }"
        >
          <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-3 group-hover:shadow-lg group-hover:scale-110 transition-transform duration-200">
            <img :src="tech.logo" :alt="tech.title" class="w-full h-full object-contain" />
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">{{ tech.title }}</span>
        </div>
      </div>

    </div>
  </section>
</template>
