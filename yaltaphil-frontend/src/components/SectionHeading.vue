<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

defineProps<{ eyebrow?: string; title: string; subtitle?: string }>()

const { el, visible } = useReveal(0.3)
</script>

<template>
  <div ref="el" :class="['fade-in-up mb-12 text-center md:mb-16', { visible }]">
    <p
      v-if="eyebrow"
      class="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400"
    >
      {{ eyebrow }}
    </p>
    <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mx-auto mt-3 max-w-xl text-sm text-gray-500 md:text-base dark:text-gray-400">
      {{ subtitle }}
    </p>
  </div>
</template>
