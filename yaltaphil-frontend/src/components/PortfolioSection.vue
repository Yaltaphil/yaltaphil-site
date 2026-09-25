<script setup lang="ts">
import { computed } from 'vue'
import PortfolioItem from './PortfolioItem.vue'
import SectionHeading from './SectionHeading.vue'
import { useReveal } from '@/composables/useReveal'
import type IProject from '@/models/IProject'

const props = defineProps<{
  projects: IProject[]
}>()

const { el: grid, visible: gridVisible } = useReveal(0.05)

const featured = computed(() => props.projects.filter(p => p.featured))
const rest = computed(() => props.projects.filter(p => !p.featured))

// Paper has no clicks, so the printed list carries the URL the card would have opened.
const bareUrl = (link: string) => link.replace(/^https?:\/\//, '').replace(/\/$/, '')
</script>

<template>
  <section id="portfolio" class="py-20 md:py-24 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-content mx-auto px-4">

      <SectionHeading
        eyebrow="Selected work"
        title="Portfolio"
        subtitle="Products and prototypes I built or contributed to — from streaming platforms to landing pages."
      />

      <div ref="grid" :class="['space-y-6 print:hidden', { 'section-visible': gridVisible }]">
        <PortfolioItem
          v-for="(item, i) in featured"
          :key="item.link"
          :item="item"
          class="stagger-item"
          :style="{ '--delay': `${i * 0.08}s` }"
        />

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(item, i) in rest"
            :key="item.link"
            class="stagger-item"
            :style="{ '--delay': `${(featured.length + i) * 0.08}s` }"
          >
            <PortfolioItem :item="item" class="h-full" />
          </div>
        </div>
      </div>

      <!-- Seven screenshots cost about a page and a half of paper, and none of them is a link. -->
      <ul class="hidden print:block print:space-y-2.5">
        <li v-for="p in projects" :key="p.link" class="text-xs leading-relaxed">
          <span class="font-semibold text-gray-900">{{ p.title }}</span>
          <span class="text-gray-700" v-if="p.role || p.year">
            — {{ [p.role, p.year].filter(Boolean).join(', ') }}
          </span>
          <span class="text-gray-700" v-if="p.tags?.length"> · {{ p.tags.join(', ') }}</span>
          <br />
          <span class="text-gray-600">{{ p.description }}</span>
          <br />
          <span class="text-gray-600">{{ bareUrl(p.link) }}</span>
        </li>
      </ul>

    </div>
  </section>
</template>
