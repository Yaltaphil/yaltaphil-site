import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_COLOR: Record<Theme, string> = { light: '#4338ca', dark: '#312e81' }

// Mirrors the inline bootstrap in index.html: stored choice wins, otherwise OS.
const readTheme = (): Theme => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// index.html's two theme-color metas are media-query based, so they follow the OS and ignore
// an explicit toggle. A media-less meta appended after them wins the cascade and tracks it.
const syncThemeColor = (value: Theme) => {
  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.content = THEME_COLOR[value]
}

const apply = (value: Theme) => {
  document.documentElement.classList.toggle('dark', value === 'dark')
  syncThemeColor(value)
}

// Module scope keeps every consumer on one reactive source. index.html already put the
// right class on <html> before first paint, so this only reconciles and updates it.
const theme = ref<Theme>('light')
let initialised = false

export function useTheme() {
  if (!initialised) {
    theme.value = readTheme()
    apply(theme.value)
    initialised = true
  }

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    apply(theme.value)
  }

  return { theme, toggle }
}
