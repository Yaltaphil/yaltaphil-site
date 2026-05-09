<script setup lang="ts">
import DarkModeToggle from './DarkModeToggle.vue'

defineProps<{
  projectsCount: number
}>()
</script>

<template>
  <nav class="sticky top-0 z-50 bg-indigo-900/80 backdrop-blur-md border-b border-white/10 dark:bg-gray-950/90">
    <div class="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
      <a href="#" class="flex items-center gap-2">
        <img alt="logo" class="w-10 h-10" src="/img/Y-logo.png" />
        <span class="text-white font-bold text-lg tracking-tight">yaltaphil</span>
      </a>

      <div class="flex items-center gap-1">
        <a
          href="#about"
          class="px-3 py-1.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >About</a>
        <a
          href="#portfolio"
          class="px-3 py-1.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >
          Portfolio
          <span class="ml-1 text-xs text-indigo-300 font-mono">{{ projectsCount }}</span>
        </a>
        <a
          href="#certificates"
          class="px-3 py-1.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >Certificates</a>
        <a
          href="#contact"
          class="px-3 py-1.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >Contact</a>

        <DarkModeToggle class="ml-2" />
      </div>
    </div>
  </nav>
</template>
