<script setup lang="ts">
import SectionHeading from './SectionHeading.vue'
import { useReveal } from '@/composables/useReveal'
import { earlierRole, education, experience } from '@/assets/data/experience'

const { el: list, visible: listVisible } = useReveal(0.05)
</script>

<template>
  <section id="experience" class="py-20 md:py-24 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-content mx-auto px-4">

      <SectionHeading
        eyebrow="Career"
        title="Experience"
        subtitle="Five years of commercial frontend development with Vue and Nuxt — a deliberate switch from an earlier career in economics."
      />

      <div ref="list" :class="['relative', { 'section-visible': listVisible }]">
        <!-- Spine runs through the centre of every dot (14px dot at left-0 → centre 7px). -->
        <span
          class="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />

        <ol class="space-y-10">
          <li
            v-for="(job, i) in experience"
            :key="job.company"
            class="stagger-item relative pl-8"
            :style="{ '--delay': `${i * 0.12}s` }"
          >
            <span
              class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-500 ring-4 ring-gray-50 dark:ring-gray-950"
              aria-hidden="true"
            />

            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ job.company }}
              </h3>
              <p class="text-xs font-mono text-gray-500 dark:text-gray-400">
                {{ job.start }} — {{ job.end }} · {{ job.duration }}
              </p>
            </div>

            <p class="mt-0.5 text-sm font-medium text-brand-600 dark:text-brand-400">
              {{ job.role }}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ job.location }}
            </p>

            <ul v-if="job.bullets?.length" class="mt-3 ml-4 list-disc space-y-1.5 marker:text-brand-400">
              <li
                v-for="bullet in job.bullets"
                :key="bullet"
                class="text-sm leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {{ bullet }}
              </li>
            </ul>

            <div v-if="job.stack?.length" class="mt-3 flex flex-wrap gap-1.5">
              <span
                v-for="tech in job.stack"
                :key="tech"
                class="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium"
              >
                {{ tech }}
              </span>
            </div>
          </li>
        </ol>

        <div
          class="stagger-item mt-12 grid gap-8 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2"
          :style="{ '--delay': `${experience.length * 0.12}s` }"
        >
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Earlier career
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ earlierRole.field }} · {{ earlierRole.role }}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ earlierRole.location }} · {{ earlierRole.period }}
            </p>
          </div>

          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Education
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ education.school }}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ education.faculty }} — {{ education.degree }}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ education.location }} · {{ education.period }}
            </p>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
