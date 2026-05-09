import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(threshold = 0.15) {
  const el = ref<HTMLElement | null>(null)
  const visible = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
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
