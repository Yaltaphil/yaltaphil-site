<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import type IProject from '@/models/IProject'

const props = defineProps<{ item: IProject }>()

const featured = computed(() => props.item.featured === true)
const contain = computed(() => props.item.imageFit === 'contain')
// The lead card renders ~530px wide, where the 512px `card` variant would look soft.
const src = computed(() => (featured.value ? props.item.picture : props.item.card || props.item.picture))
</script>

<template>
  <a
    :href="item.link"
    target="_blank"
    rel="noopener"
    :class="[
      'group flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
      featured ? 'md:flex-row hover:-translate-y-1' : 'hover:-translate-y-1.5',
    ]"
  >
    <!-- Fixed aspect frame: the row never reflows while images decode. The lead card drops
         the ratio at `md` for an explicit height — with `h-full` on the <img> an indefinite
         parent height would fall back to the image's own ratio and inflate the column. -->
    <div
      :class="[
        'relative overflow-hidden bg-gray-100 dark:bg-gray-700',
        featured ? 'aspect-[16/10] md:aspect-auto md:h-[320px] md:w-[52%] md:flex-shrink-0' : 'aspect-[16/10]',
      ]"
    >
      <img
        :src="src"
        :alt="item.title"
        loading="lazy"
        decoding="async"
        :class="[
          'w-full h-full transition-transform duration-500 group-hover:scale-[1.04]',
          contain
            ? 'object-contain p-5 bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700'
            : 'object-cover object-center',
        ]"
      />

      <template v-if="!featured">
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
      </template>
    </div>

    <div :class="['flex flex-col gap-2', featured ? 'flex-1 p-6 md:p-8 md:justify-center' : 'flex-1 p-4']">
      <span
        v-if="featured"
        class="mb-1 inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
      >
        Featured project
      </span>

      <h3
        :class="[
          'font-bold leading-snug text-gray-900 dark:text-white',
          featured ? 'text-xl md:text-2xl' : 'text-base',
        ]"
      >
        {{ item.title }}
      </h3>

      <p
        :class="[
          'leading-relaxed text-gray-500 dark:text-gray-400',
          featured ? 'text-sm md:max-w-prose md:text-base' : 'flex-1 text-sm',
        ]"
      >
        {{ item.description }}
      </p>

      <div
        v-if="item.role"
        :class="[
          'flex items-center gap-1.5 font-medium text-violet-600 dark:text-violet-400',
          featured ? 'text-sm' : 'text-xs',
        ]"
      >
        <AppIcon name="users" :class="['flex-shrink-0', featured ? 'h-4 w-4' : 'h-3.5 w-3.5']" />
        {{ item.role }}
        <span v-if="featured && item.year" class="font-normal text-gray-400 dark:text-gray-500">
          · {{ item.year }}
        </span>
      </div>

      <div
        v-if="item.tags?.length"
        :class="[
          'flex flex-wrap gap-1 border-t border-gray-100 dark:border-gray-700',
          featured ? 'mt-1 pt-3 gap-1.5' : 'pt-1',
        ]"
      >
        <span
          v-for="tag in item.tags"
          :key="tag"
          :class="[
            'rounded-full bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
            featured ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs',
          ]"
        >
          {{ tag }}
        </span>
      </div>

      <span
        v-if="featured"
        class="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2.5 dark:text-brand-400"
      >
        Visit site
        <AppIcon name="external" class="h-4 w-4" />
      </span>
    </div>
  </a>
</template>
