<script setup lang="ts">
import { computed } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { CATEGORY_ORDER, type ITechnology, type TechCategory } from '@/assets/data/technologies'

const props = defineProps<{ technologies: ITechnology[] }>()

const grouped = computed(() => {
  const map = new Map<TechCategory, ITechnology[]>()
  CATEGORY_ORDER.forEach(cat => map.set(cat, []))
  props.technologies.forEach(t => map.get(t.category)?.push(t))
  return CATEGORY_ORDER.map(cat => ({ cat, items: map.get(cat) ?? [] })).filter(g => g.items.length)
})

const { el: heading, visible: headingVisible } = useIntersectionObserver(0.3)
const { el: grid,    visible: gridVisible    } = useIntersectionObserver(0.05)

const CATEGORY_COLOR: Record<TechCategory, string> = {
  'Frontend':   'text-indigo-600 dark:text-indigo-400',
  'Backend':    'text-emerald-600 dark:text-emerald-400',
  'Tools':      'text-amber-600 dark:text-amber-400',
  'Cloud & AI': 'text-rose-600 dark:text-rose-400',
}
</script>

<template>
  <section class="py-24 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-4">

      <div ref="heading" :class="['fade-in-up', { visible: headingVisible }]">
        <h2 class="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
          Tech Stack
        </h2>
        <p class="text-center text-gray-400 dark:text-gray-500 mb-14 text-sm">
          {{ technologies.length }} technologies across {{ grouped.length }} areas
        </p>
      </div>

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
          <div class="flex flex-wrap gap-5">
            <div
              v-for="(tech, i) in group.items"
              :key="tech.title"
              class="stagger-item flex flex-col items-center gap-2 group"
              :style="{ '--delay': `${gi * 0.1 + i * 0.04}s` }"
            >
              <div class="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2.5 shadow-sm group-hover:shadow-md group-hover:scale-110 group-hover:border-indigo-200 dark:group-hover:border-indigo-700 transition-all duration-200">
                <img :src="tech.logo" :alt="tech.title" class="w-full h-full object-contain" />
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 font-medium text-center leading-tight max-w-[60px]">
                {{ tech.title }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
