<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const certificates = [
  { webp: '/img/sertificates/1.webp',                    alt: 'Certificate 1' },
  { webp: '/img/sertificates/2.webp',                    alt: 'Certificate 2' },
  { webp: '/img/sertificates/3.webp',                    alt: 'Certificate 3' },
  { webp: '/img/sertificates/4.webp',                    alt: 'Certificate 4' },
  { webp: '/img/sertificates/Javascript-certificate.webp', alt: 'JavaScript Certificate' },
]

const selected = ref<string | null>(null)

const { el: heading, visible: headingVisible } = useIntersectionObserver(0.3)
const { el: grid, visible: gridVisible } = useIntersectionObserver(0.05)

function open(src: string) { selected.value = src }
function close() { selected.value = null }
</script>

<template>
  <section id="certificates" class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4">

      <div ref="heading" :class="['fade-in-up', { visible: headingVisible }]">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Certificates
        </h2>
      </div>

      <div
        ref="grid"
        :class="['grid grid-cols-2 md:grid-cols-5 gap-4', { 'section-visible': gridVisible }]"
      >
        <button
          v-for="(cert, i) in certificates"
          :key="i"
          @click="open(cert.webp)"
          class="stagger-item rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :style="{ '--delay': `${i * 0.1}s` }"
        >
          <img
            :src="cert.webp"
            :alt="cert.alt"
            loading="lazy"
            decoding="async"
            class="w-full h-40 object-cover object-top"
          />
        </button>
      </div>

    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="selected"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div class="relative max-w-3xl w-full">
          <button
            @click="close"
            class="absolute -top-10 right-0 text-white text-sm hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            ✕ Close
          </button>
          <img
            :src="selected"
            alt="Certificate"
            class="w-full rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
