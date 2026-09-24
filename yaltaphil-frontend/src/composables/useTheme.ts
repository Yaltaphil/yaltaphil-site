import { ref } from 'vue'

export type Theme = 'light' | 'dark'

// Mirrors the inline bootstrap in index.html: stored choice wins, otherwise OS.
const readTheme = (): Theme => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Module scope keeps every consumer on one reactive source. index.html already put the
// right class on <html> before first paint, so this only reconciles and updates it.
const theme = ref<Theme>('light')
let initialised = false

export function useTheme() {
  if (!initialised) {
    theme.value = readTheme()
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    initialised = true
  }

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }

  return { theme, toggle }
}
