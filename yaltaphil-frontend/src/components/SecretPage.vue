<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useScrollLock } from '@/composables/useScrollLock'

const emit = defineEmits<{ back: [] }>()

const back = ref<HTMLElement | null>(null)
const { lock, unlock } = useScrollLock()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('back')
}

onMounted(() => {
  lock()
  window.addEventListener('keydown', onKeydown)
  void nextTick(() => back.value?.focus())
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>


<template>
  <div
    class="fixed inset-0 z-[60] bg-black flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    aria-label="Hidden page"
  >
    <button
      ref="back"
      @click="emit('back')"
      class="absolute top-6 left-6 text-white/20 hover:text-white/60 focus:text-white/60 transition-colors duration-200 text-2xl leading-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      aria-label="Go back"
    >
      ←
    </button>
    <img
      src="/img/yaltaphil.jpg"
      alt=""
      width="538"
      height="807"
      class="max-w-full max-h-full object-contain"
    />
  </div>
</template>
