<script setup lang="ts">
const year = new Date().getFullYear()

const links = [
  { label: 'About',        href: '#about' },
  { label: 'Portfolio',    href: '#portfolio' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact',      href: '#contact' },
]

const socials = [
  { label: 'GitHub',   href: 'https://github.com/yaltaphil',   icon: '/img/icons/github.svg' },
  { label: 'Telegram', href: 'https://t.me/Yaltaphil',         icon: '/img/icons/telegram.svg' },
  { label: 'Email',    href: 'mailto:yaltaphil@gmail.com',     icon: '/img/icons/email.svg' },
]
</script>

<template>
  <footer class="bg-gray-950 text-gray-400 border-t border-gray-800">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        <!-- Brand -->
        <div class="text-center md:text-left">
          <a href="#" class="flex items-center gap-2 justify-center md:justify-start mb-2">
            <img alt="logo" class="w-7 h-7" src="/img/Y-logo.png" />
            <span class="text-white font-bold text-base">yaltaphil</span>
          </a>
          <p class="text-sm text-gray-500">Frontend developer · Vue / Nuxt</p>
        </div>

        <!-- Nav links -->
        <nav class="flex gap-6">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="text-sm hover:text-white transition-colors duration-150"
          >
            {{ link.label }}
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
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-150"
          >
            <img :src="s.icon" :alt="s.label" class="w-4 h-4 invert opacity-70" />
          </a>
        </div>

      </div>

      <div class="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
        &copy; {{ year }} Philip Ryazankin. Built with Vue&nbsp;3&nbsp;+&nbsp;Vite&nbsp;+&nbsp;Tailwind.
      </div>
    </div>
  </footer>
</template>
