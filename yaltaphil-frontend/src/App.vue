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
  <SecretPage v-if="showSecret" @back="showSecret = false" />
  <div v-else class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
    <NavBar :projects-count="projects.length" />
    <HeroSection />
    <TechSection :technologies="technologies" />
    <PortfolioSection :projects="projects" />
    <CertificatesSection />
    <ContactSection />
    <FooterSection @open-secret="showSecret = true" />
    <ScrollToTop />
  </div>
</template>
