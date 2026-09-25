import { onMounted, onUnmounted } from 'vue'
import { projects } from '@/assets/data/projects'

const SITE = 'https://yaltaphil.ru'

const graph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/#profilepage`,
      url: `${SITE}/`,
      name: 'Philip Ryazankin — Frontend Developer (Vue / Nuxt)',
      mainEntity: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/#work`,
      name: 'Selected work',
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: p.title,
          description: p.description,
          url: p.link,
          creator: { '@id': `${SITE}/#person` },
          ...(p.year ? { dateCreated: String(p.year) } : {}),
          ...(p.tags?.length ? { keywords: p.tags.join(', ') } : {}),
        },
      })),
    },
  ],
})

// Vue strips <script> out of client component templates, so structured data has to be
// attached imperatively. It is generated from projects.ts rather than duplicated in
// index.html, where a hand-written copy would silently drift from the real list.
export function useJsonLd() {
  let el: HTMLScriptElement | null = null

  onMounted(() => {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify(graph())
    document.head.appendChild(el)
  })

  onUnmounted(() => {
    el?.remove()
    el = null
  })
}
