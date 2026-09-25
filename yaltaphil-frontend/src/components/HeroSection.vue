<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { usePrintCv } from '@/composables/usePrintCv'

const { printCv } = usePrintCv()
</script>

<template>
  <section
    id="about"
    class="relative hero-min flex items-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent dark:from-gray-900 dark:via-brand-950 dark:to-gray-900 print:hidden"
  >
    <!-- Декоративные orbs -->
    <div class="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-500/25 blur-3xl" />
    <div class="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-brand-400/20 blur-3xl" />

    <div class="relative z-10 max-w-content mx-auto px-4 py-24 w-full">
      <div class="flex flex-col md:flex-row items-center gap-12">

        <!-- Photo -->
        <div class="flex-shrink-0 hero-animate" style="--delay: 0.1s">
          <div class="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
            <img
              alt="Portrait of Philip Ryazankin"
              class="w-full h-full object-cover object-[center_18%] ken-burns"
              src="/img/yaltaphil.jpg"
              width="538"
              height="807"
              fetchpriority="high"
            />
          </div>
        </div>

        <!-- Text -->
        <div class="text-center md:text-left">

          <!-- Role badge -->
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 font-medium mb-5 hero-animate" style="--delay: 0.15s">
            <AppIcon name="bolt" class="w-4 h-4 text-amber-300" />
            Frontend Developer
          </div>

          <p class="text-brand-200 text-lg font-medium mb-1 hero-animate" style="--delay: 0.28s">
            Hello, I'm
          </p>
          <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight hero-animate" style="--delay: 0.38s">
            Philip Ryazankin
          </h1>
          <p class="text-lg text-white/90 mb-8 max-w-md dark:text-white/80 hero-animate" style="--delay: 0.52s">
            Frontend developer focused on Vue&nbsp;&amp;&nbsp;Nuxt, with five years of commercial experience. Looking for a team with a strong engineering process.
          </p>

          <div class="flex flex-wrap gap-3 justify-center md:justify-start hero-animate" style="--delay: 0.66s">
            <a
              href="#portfolio"
              class="px-6 py-3 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:shadow-white/25 hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              View my work
            </a>
            <a
              href="https://github.com/yaltaphil"
              target="_blank"
              rel="noopener"
              class="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <AppIcon name="github" class="w-5 h-5" />
              GitHub
            </a>
            <button
              type="button"
              @click="printCv"
              class="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <AppIcon name="download" class="w-5 h-5" />
              Save as PDF
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Scroll hint -->
    <a
      href="#portfolio"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/90 hover:text-white text-xs transition-colors hero-animate"
      style="--delay: 1s"
      aria-label="Scroll to portfolio"
    >
      <span>scroll</span>
      <AppIcon name="chevron-down" class="w-4 h-4 animate-bounce" />
    </a>

  </section>
</template>
