<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import TechSection from './components/TechSection.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import CertificatesSection from './components/CertificatesSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import SecretPage from './components/SecretPage.vue'
import { technologies } from './assets/data/technologies'
import { projects } from './assets/data/projects'

const showSecret = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-brand-700 focus:shadow-lg focus:font-semibold"
    >
      Skip to content
    </a>
    <NavBar :projects-count="projects.length" />
    <main id="main" tabindex="-1">
      <HeroSection />
      <TechSection :technologies="technologies" />
      <PortfolioSection :projects="projects" />
      <CertificatesSection />
      <ContactSection />
    </main>
    <FooterSection @open-secret="showSecret = true" />
    <ScrollToTop />
  </div>
  <SecretPage v-if="showSecret" @back="showSecret = false" />
</template>
