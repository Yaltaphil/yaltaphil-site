import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Reveal-on-scroll: flips to visible the first time the element enters the viewport,
 * then stops observing. Content is never left stuck at opacity:0 — see the two
 * bail-outs below.
 */
export function useReveal(threshold = 0.15) {
  const el = ref<HTMLElement | null>(null)
  const visible = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      visible.value = true
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer?.disconnect()
        }
      },
      { threshold }
    )

    if (el.value) observer.observe(el.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { el, visible }
}
