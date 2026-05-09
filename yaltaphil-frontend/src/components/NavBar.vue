<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DarkModeToggle from './DarkModeToggle.vue'

defineProps<{ projectsCount: number }>()

const activeSection = ref('about')

const SECTIONS = ['about', 'portfolio', 'certificates', 'contact']

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0, rootMargin: '-45% 0px -55% 0px' }
  )
  SECTIONS.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer!.observe(el)
  })
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <nav class="sticky top-0 z-50 bg-indigo-900/80 backdrop-blur-md border-b border-white/10 dark:bg-gray-950/90">
    <div class="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">

      <a href="#" class="flex items-center gap-2 flex-shrink-0">
        <img alt="logo" class="w-9 h-9" src="/img/Y-logo.png" />
        <span class="text-white font-bold text-base tracking-tight">yaltaphil</span>
      </a>

      <div class="flex items-center gap-0.5">
        <a
          v-for="{ id, label } in [
            { id: 'about',        label: 'About' },
            { id: 'portfolio',    label: 'Portfolio' },
            { id: 'certificates', label: 'Certificates' },
            { id: 'contact',      label: 'Contact' },
          ]"
          :key="id"
          :href="`#${id}`"
          :class="[
            'relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
            activeSection === id
              ? 'text-white bg-white/15'
              : 'text-white/65 hover:text-white hover:bg-white/10',
          ]"
        >
          {{ label }}
          <span v-if="id === 'portfolio'" class="ml-1 text-xs font-mono opacity-60">{{ projectsCount }}</span>
        </a>

        <DarkModeToggle class="ml-2" />
      </div>

    </div>
  </nav>
</template>
