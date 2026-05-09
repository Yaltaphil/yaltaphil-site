<script setup lang="ts">
// No props needed — static content
</script>

<template>
  <section
    id="about"
    class="min-h-screen flex items-center bg-gradient-to-br from-indigo-700 via-indigo-500 to-purple-600 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900"
  >
    <div class="max-w-5xl mx-auto px-4 py-20 w-full">
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
          <p class="text-indigo-200 text-lg font-medium mb-2 dark:text-indigo-400 hero-animate" style="--delay: 0.25s">
            Hello, I'm
          </p>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight hero-animate" style="--delay: 0.35s">
            Phil Ryazankin
          </h1>
          <p class="text-xl text-white/80 mb-8 max-w-lg dark:text-white/70 hero-animate" style="--delay: 0.5s">
            Frontend developer focused on Vue &amp; Nuxt. I enjoy building fast, clean, and interactive web experiences.
          </p>

          <div class="flex flex-wrap gap-3 justify-center md:justify-start hero-animate" style="--delay: 0.65s">
            <a
              href="#portfolio"
              class="px-6 py-3 bg-white text-indigo-700 font-bold rounded-lg shadow hover:bg-indigo-50 transition-colors"
            >
              View my work
            </a>
            <a
              href="https://github.com/yaltaphil"
              target="_blank"
              rel="noopener"
              class="px-6 py-3 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <img alt="" class="w-5 h-5 invert" src="/img/icons/github.svg" />
              GitHub
            </a>
          </div>
        </div>

      </div>
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
