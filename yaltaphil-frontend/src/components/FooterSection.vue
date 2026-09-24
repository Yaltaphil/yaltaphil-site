<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { NAV_ITEMS } from '@/assets/data/navigation'

const emit = defineEmits<{ 'open-secret': [] }>()

const year = new Date().getFullYear()

const socials = [
  { icon: 'github',   label: 'GitHub',   href: 'https://github.com/yaltaphil' },
  { icon: 'telegram', label: 'Telegram', href: 'https://t.me/Yaltaphil' },
  { icon: 'mail',     label: 'Email',    href: 'mailto:yaltaphil@gmail.com' },
] as const
</script>

<template>
  <footer class="bg-gray-950 text-gray-400 border-t border-gray-800">
    <div class="max-w-content mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        <!-- Brand -->
        <div class="text-center md:text-left">
          <a href="#about" class="flex items-center gap-2 justify-center md:justify-start mb-2">
            <img alt="yaltaphil logo" class="w-7 h-7" src="/img/Y-logo.png" width="128" height="128" />
            <span class="text-white font-bold text-base">yaltaphil</span>
          </a>
          <p class="text-sm text-gray-500">Frontend developer · Vue / Nuxt</p>
        </div>

        <!-- Nav links -->
        <nav aria-label="Sections" class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            v-for="item in NAV_ITEMS"
            :key="item.id"
            :href="`#${item.id}`"
            class="text-sm hover:text-white transition-colors duration-150"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Socials -->
        <div class="flex items-center gap-3">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            :aria-label="s.label"
            target="_blank"
            rel="noopener"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
          >
            <AppIcon :name="s.icon" class="w-4 h-4" />
          </a>
        </div>

      </div>

      <div class="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
        &copy; {{ year }} Philip Ryazankin. Built with Vue&nbsp;3&nbsp;+&nbsp;Vite&nbsp;+&nbsp;Tailwind.
        <button
          @click="emit('open-secret')"
          class="inline-block ml-1 opacity-10 hover:opacity-40 transition-opacity duration-200 cursor-pointer"
          aria-label="?"
        >·</button>
      </div>
    </div>
  </footer>
</template>
