<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{ back: [] }>()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('back')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black flex items-center justify-center">
    <button
      @click="emit('back')"
      class="absolute top-6 left-6 text-white/20 hover:text-white/60 transition-colors duration-200 text-2xl cursor-pointer"
      aria-label="Go back"
    >
      ←
    </button>
    <img
      src="/img/yaltaphil.jpg"
      alt=""
      class="max-w-full max-h-full object-contain"
    />
  </div>
</template>
