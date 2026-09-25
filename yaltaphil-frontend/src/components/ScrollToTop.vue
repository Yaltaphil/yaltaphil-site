<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'

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
      class="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-500 hover:-translate-y-0.5 transition-all duration-200 print:hidden"
    >
      <AppIcon name="arrow-up" class="w-4 h-4" />
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
