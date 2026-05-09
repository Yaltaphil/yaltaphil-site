<script setup lang="ts">
import type IProject from '@/models/IProject'

defineProps<{ item: IProject }>()
</script>

<template>
  <a
    :href="item.link"
    target="_blank"
    rel="noopener"
    class="group w-64 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
  >
    <!-- Image + overlay -->
    <div class="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        :src="item.picture"
        :alt="item.title"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/50 transition-all duration-300 flex items-center justify-center">
        <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5">
          Visit site
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>
    </div>

    <div class="flex flex-col flex-1 p-4 gap-2">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-sm font-bold text-gray-800 dark:text-white leading-snug">
          {{ item.title }}
        </h3>
        <span v-if="item.year" class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 font-mono">
          {{ item.year }}
        </span>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">
        {{ item.description }}
      </p>

      <div v-if="item.role" class="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-medium">
        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ item.role }}
      </div>

      <div v-if="item.tags?.length" class="flex flex-wrap gap-1 pt-1">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-medium"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </a>
</template>
