<script setup lang="ts">
import { computed } from 'vue'
import SectionHeading from './SectionHeading.vue'
import { useReveal } from '@/composables/useReveal'
import { CATEGORY_ORDER, type ITechnology, type TechCategory } from '@/assets/data/technologies'

const props = defineProps<{ technologies: ITechnology[] }>()

const grouped = computed(() => {
  const map = new Map<TechCategory, ITechnology[]>()
  CATEGORY_ORDER.forEach(cat => map.set(cat, []))
  props.technologies.forEach(t => map.get(t.category)?.push(t))
  return CATEGORY_ORDER.map(cat => ({ cat, items: map.get(cat) ?? [] })).filter(g => g.items.length)
})

const { el: grid, visible: gridVisible } = useReveal(0.05)

const CATEGORY_COLOR: Record<TechCategory, string> = {
  'Frontend':   'text-brand-600 dark:text-brand-400',
  'Backend':    'text-emerald-600 dark:text-emerald-400',
  'Tools':      'text-amber-600 dark:text-amber-400',
  'Cloud & AI': 'text-rose-600 dark:text-rose-400',
}
</script>

<template>
  <section id="stack" class="py-20 md:py-24 bg-white dark:bg-gray-900">
    <div class="max-w-content mx-auto px-4">

      <SectionHeading
        eyebrow="Toolkit"
        title="Tech Stack"
        :subtitle="`${technologies.length} technologies across ${grouped.length} areas`"
      />

      <div ref="grid" :class="[{ 'section-visible': gridVisible }, 'space-y-12']">
        <div
          v-for="(group, gi) in grouped"
          :key="group.cat"
          class="stagger-item"
          :style="{ '--delay': `${gi * 0.1}s` }"
        >
          <p :class="['text-xs font-semibold uppercase tracking-widest mb-5', CATEGORY_COLOR[group.cat]]">
            {{ group.cat }}
          </p>
          <div class="flex flex-wrap gap-5 print:hidden">
            <div
              v-for="(tech, i) in group.items"
              :key="tech.title"
              class="stagger-item flex flex-col items-center gap-2 group"
              :style="{ '--delay': `${gi * 0.1 + i * 0.04}s` }"
            >
              <div class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center p-2.5 shadow-card group-hover:shadow-card-hover group-hover:scale-110 group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-all duration-200">
                <img
                  :src="tech.logo"
                  :alt="tech.title"
                  :width="48"
                  :height="48"
                  loading="lazy"
                  decoding="async"
                  :class="['w-full h-full object-contain', tech.monochrome && 'dark:invert']"
                />
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 font-medium text-center leading-tight max-w-[64px]">
                {{ tech.title }}
              </span>
            </div>
          </div>
          <!-- 18 logos cost about a page of paper; a CV wants the names, not the artwork. -->
          <p class="hidden print:block text-sm leading-relaxed text-gray-700">
            {{ group.items.map(t => t.title).join(' · ') }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>
