<script setup lang="ts">
// Static content — no props
</script>

<template>
  <section
    id="about"
    class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-500 to-purple-600 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900"
  >
    <!-- Декоративные orbs -->
    <div class="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-500/25 blur-3xl" />
    <div class="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />

    <div class="relative z-10 max-w-5xl mx-auto px-4 py-24 w-full">
      <div class="flex flex-col md:flex-row items-center gap-12">

        <!-- Photo -->
        <div class="flex-shrink-0 hero-animate" style="--delay: 0.1s">
          <div class="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
            <img
              alt="My photo"
              class="w-full h-full object-cover pan-image-top-right"
              src="/img/yaltaphil.jpg"
            />
          </div>
        </div>

        <!-- Text -->
        <div class="text-center md:text-left">

          <!-- Status badge -->
          <div class="inline-flex items-center gap-2 bg-green-400/15 border border-green-400/30 rounded-full px-4 py-1.5 text-sm text-green-300 font-medium mb-5 hero-animate" style="--delay: 0.15s">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for work
          </div>

          <p class="text-indigo-200 text-lg font-medium mb-1 dark:text-indigo-400 hero-animate" style="--delay: 0.28s">
            Hello, I'm
          </p>
          <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight hero-animate" style="--delay: 0.38s">
            Phil Ryazankin
          </h1>
          <p class="text-lg text-white/75 mb-8 max-w-md dark:text-white/65 hero-animate" style="--delay: 0.52s">
            Frontend developer focused on Vue&nbsp;&amp;&nbsp;Nuxt. I enjoy building fast, clean, and interactive web experiences.
          </p>

          <div class="flex flex-wrap gap-3 justify-center md:justify-start hero-animate" style="--delay: 0.66s">
            <a
              href="#portfolio"
              class="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-white/25 hover:bg-indigo-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              View my work
            </a>
            <a
              href="https://github.com/yaltaphil"
              target="_blank"
              rel="noopener"
              class="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <img alt="" class="w-5 h-5 invert" src="/img/icons/github.svg" />
              GitHub
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Scroll hint -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs hero-animate" style="--delay: 1s">
      <span>scroll</span>
      <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
.pan-image-top-right {
  animation: pan-image 36s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
@keyframes pan-image {
  0%   { transform: scale(1)    translate(0, 0);        transform-origin: 84% 16%; }
  50%  { transform: scale(1.25) translate(20px, -15px); transform-origin: right top; }
  100% { transform: scale(1)    translate(0, 0);        transform-origin: 84% 16%; }
}
</style>
