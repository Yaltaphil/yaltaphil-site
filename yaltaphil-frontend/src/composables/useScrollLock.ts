import { onUnmounted, ref } from 'vue'

let depth = 0
let previousOverflow = ''

/** Freezes background scrolling while an overlay is open. Reference-counted so
 *  nested overlays (lightbox opened from the menu) restore to the right state. */
export function useScrollLock() {
  const locked = ref(false)

  const lock = () => {
    if (!locked.value) {
      if (depth === 0) {
        previousOverflow = document.documentElement.style.overflow
        document.documentElement.style.overflow = 'hidden'
      }
      depth++
      locked.value = true
    }
  }

  const unlock = () => {
    if (!locked.value) return
    depth = Math.max(0, depth - 1)
    if (depth === 0) document.documentElement.style.overflow = previousOverflow
    locked.value = false
  }

  onUnmounted(unlock)

  return { locked, lock, unlock }
}
