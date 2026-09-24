<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
</script>

<template>
  <button
    @click="toggle"
    type="button"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="theme === 'dark'"
    class="w-9 h-9 flex items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
  >
    <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" class="w-5 h-5" />
  </button>
</template>
