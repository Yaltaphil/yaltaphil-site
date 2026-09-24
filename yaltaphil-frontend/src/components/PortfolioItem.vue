<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type IProject from '@/models/IProject'

const props = defineProps<{ item: IProject }>()

const contain = () => props.item.imageFit === 'contain'
</script>

<template>
  <a
    :href="item.link"
    target="_blank"
    rel="noopener"
    class="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
  >
    <!-- Fixed aspect frame: the row never reflows while images decode. -->
    <div class="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        :src="item.card || item.picture"
        :alt="item.title"
        loading="lazy"
        decoding="async"
        :class="[
          'w-full h-full transition-transform duration-500 group-hover:scale-[1.04]',
          contain()
            ? 'object-contain p-5 bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700'
            : 'object-cover object-center',
        ]"
      />
      <!-- Scrim keeps the hover chip readable on bright screenshots. -->
      <div class="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-brand-950/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span
        v-if="item.year"
        class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-brand-950/60 backdrop-blur-sm text-white/90 text-xs font-mono"
      >
        {{ item.year }}
      </span>

      <div class="absolute inset-x-0 bottom-2.5 flex justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <span class="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-3.5 py-1.5">
          Visit site
          <AppIcon name="external" class="w-3.5 h-3.5" />
        </span>
      </div>
    </div>

    <div class="flex flex-col flex-1 p-4 gap-2">
      <h3 class="text-base font-bold text-gray-900 dark:text-white leading-snug">
        {{ item.title }}
      </h3>

      <p class="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">
        {{ item.description }}
      </p>

      <div v-if="item.role" class="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-medium">
        <AppIcon name="users" class="w-3.5 h-3.5 flex-shrink-0" />
        {{ item.role }}
      </div>

      <div v-if="item.tags?.length" class="flex flex-wrap gap-1 pt-1 border-t border-gray-100 dark:border-gray-700">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 font-medium"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </a>
</template>
