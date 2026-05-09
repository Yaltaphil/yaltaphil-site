<script setup lang="ts">
import type IProject from '@/models/IProject'

defineProps<{
  item: IProject
}>()
</script>

<template>
  <a
    :href="item.link"
    target="_blank"
    rel="noopener"
    class="w-64 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
  >
    <img
      :src="item.picture"
      :alt="item.title"
      class="w-full h-40 object-cover object-center"
    />

    <div class="flex flex-col flex-1 p-4 gap-2">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-base font-bold text-gray-800 dark:text-white leading-tight">
          {{ item.title }}
        </h3>
        <span v-if="item.year" class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">
          {{ item.year }}
        </span>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 flex-1">
        {{ item.description }}
      </p>

      <div v-if="item.tags?.length" class="flex flex-wrap gap-1 mt-1">
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
