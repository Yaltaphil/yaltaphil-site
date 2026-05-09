<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import TechSection from './components/TechSection.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import CertificatesSection from './components/CertificatesSection.vue'
import ContactSection from './components/ContactSection.vue'
import { technologies } from './assets/data/technologies'
import { projects } from './assets/data/projects'
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <NavBar :projects-count="projects.length" />
    <HeroSection />
    <TechSection :technologies="technologies" />
    <PortfolioSection :projects="projects" />
    <CertificatesSection />
    <ContactSection />
    <footer class="py-4 text-center text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-950">
      &copy; {{ new Date().getFullYear() }} yaltaphil
    </footer>
  </div>
</template>
