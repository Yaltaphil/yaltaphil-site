<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { NAV_ITEMS } from '@/assets/data/navigation'
import AppIcon from './AppIcon.vue'
import DarkModeToggle from './DarkModeToggle.vue'

defineProps<{ projectsCount: number }>()

const activeSection = ref('about')
const open = ref(false)
const nav = ref<HTMLElement | null>(null)
const burger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const close = (restoreFocus = false) => {
  if (!open.value) return
  open.value = false
  if (restoreFocus) void nextTick(() => burger.value?.focus())
}

const toggle = () => {
  open.value = !open.value
  if (open.value) void nextTick(() => panel.value?.focus())
}

const onPointerDown = (e: PointerEvent) => {
  if (open.value && nav.value && !nav.value.contains(e.target as Node)) close()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close(true)
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0, rootMargin: '-45% 0px -55% 0px' }
  )
  NAV_ITEMS.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer!.observe(el)
  })

  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)

  // Growing past the mobile breakpoint must not strand an open panel.
  const desktop = window.matchMedia('(min-width: 768px)')
  const onBreakpoint = (e: MediaQueryListEvent) => { if (e.matches) close() }
  desktop.addEventListener('change', onBreakpoint)
})

onUnmounted(() => {
  observer?.disconnect()
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- `relative` + an out-of-flow panel: an in-flow dropdown would shift every section
       while open, so an anchor tapped in it would land at a stale scroll position. -->
  <nav ref="nav" class="sticky top-0 z-50 relative bg-brand-900/80 backdrop-blur-md border-b border-white/10 dark:bg-gray-950/90">
    <div class="max-w-content mx-auto px-4 flex items-center justify-between h-16">

      <a href="#about" class="flex items-center gap-2 flex-shrink-0">
        <img alt="yaltaphil logo" class="w-9 h-9" src="/img/Y-logo.png" width="128" height="128" />
        <span class="text-white font-bold text-base tracking-tight">yaltaphil</span>
      </a>

      <!-- Desktop -->
      <div class="hidden md:flex items-center gap-1">
        <a
          v-for="item in NAV_ITEMS"
          :key="item.id"
          :href="`#${item.id}`"
          :aria-current="activeSection === item.id ? 'true' : undefined"
          :class="[
            'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
            activeSection === item.id ? 'text-white' : 'text-white/65 hover:text-white',
          ]"
        >
          {{ item.label }}
          <span v-if="item.id === 'portfolio'" class="ml-1 text-xs font-mono opacity-60">{{ projectsCount }}</span>
          <span
            v-if="activeSection === item.id"
            class="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full bg-brand-400"
          />
        </a>

        <DarkModeToggle class="ml-2" />
      </div>

      <!-- Mobile -->
      <div class="flex md:hidden items-center gap-1">
        <DarkModeToggle />
        <button
          ref="burger"
          type="button"
          @click="toggle"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          class="w-9 h-9 flex items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <AppIcon :name="open ? 'close' : 'menu'" class="w-5 h-5" />
        </button>
      </div>

    </div>

    <Transition name="menu">
      <div
        v-show="open"
        id="mobile-menu"
        ref="panel"
        tabindex="-1"
        aria-label="Site sections"
        class="md:hidden absolute inset-x-0 top-full border-t border-white/10 bg-brand-900/95 backdrop-blur-md shadow-xl shadow-black/25 outline-none"
      >
        <div class="max-w-content mx-auto px-2 py-2">
          <a
            v-for="item in NAV_ITEMS"
            :key="item.id"
            :href="`#${item.id}`"
            @click="close()"
            :aria-current="activeSection === item.id ? 'true' : undefined"
            :class="[
              'flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors',
              activeSection === item.id ? 'text-white bg-white/15' : 'text-white/70 hover:text-white hover:bg-white/10',
            ]"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.id === 'portfolio'" class="text-sm font-mono opacity-60">{{ projectsCount }}</span>
          </a>
        </div>
      </div>
    </Transition>

  </nav>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
