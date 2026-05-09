<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      @click="scrollToTop"
      aria-label="Scroll to top"
      class="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all duration-200"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top-enter-active, .scroll-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-top-enter-from, .scroll-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
