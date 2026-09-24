# yaltaphil-frontend

Single-page portfolio of Philip Ryazankin (frontend developer, Vue / Nuxt).
Vue 3 `<script setup>` + TypeScript + Vite + Tailwind CSS. No router, no UI kit,
no state library — the page is one screen of anchor-linked sections, so `id` + `#hash`
is all the navigation it needs.

## Commands

```bash
npm install
npm run dev              # Vite dev server
npm run build            # vue-tsc --noEmit && vite build  → dist/
npm run preview          # serve the production build locally
npm run optimize:images  # regenerate card/thumb variants, favicons, icons, og-image
npm run optimize:certs   # batch-convert source certificate scans to WebP
```

Both optimization scripts are idempotent: existing outputs newer than their input are
skipped, and `optimize:certs` only converts `.jpg/.jpeg/.png`, so re-running never
compounds loss.

## Layout

```
src/
├── App.vue                  # skip link + <main> + section order
├── index.css                # nav offset, reveal/stagger animations, reduced-motion
├── components/
│   ├── NavBar.vue           # sticky bar, active-section tracking, mobile disclosure
│   ├── SectionHeading.vue   # shared eyebrow / h2 / subtitle block
│   ├── AppIcon.vue          # geometry-only inline SVG glyphs
│   ├── HeroSection.vue  TechSection.vue  PortfolioSection.vue
│   ├── CertificatesSection.vue  ContactSection.vue  FooterSection.vue
│   ├── PortfolioItem.vue ScrollToTop.vue DarkModeToggle.vue SecretPage.vue
├── composables/
│   ├── useReveal.ts         # fade in once, then stop observing
│   ├── useScrollLock.ts     # reference-counted background freeze for overlays
│   └── useTheme.ts          # dark mode state (class is applied in index.html first)
├── models/IProject.ts
└── assets/data/             # projects.ts, technologies.ts, certificates.ts, navigation.ts
```

## Conventions worth knowing

- **Content lives in `src/assets/data/`.** Adding a project or a certificate means editing
  a data file, not a component. `navigation.ts` is the single source for both the desktop
  links and the `IntersectionObserver` section list.
- **Colour is tokenized.** `theme.extend.colors.brand` in `tailwind.config.js` drives the
  hero gradient, chips, focus rings and accents — re-skin the site there, don't hunt for
  `indigo-*` literals.
- **Every image sits in a fixed-ratio frame** (`aspect-[16/10]`, `aspect-[3/2]`,
  `w-14 h-14`), so the layout can't shift while images decode. Use `imageFit: 'contain'`
  on a project whose artwork can't be cropped (small logos, `240×180` GIF).
- **Overlays are dialogs.** Anything that covers the page (`SecretPage`, certificate
  lightbox) uses `useScrollLock`, `role="dialog"`, `aria-modal`, Escape to close and
  restores focus to its trigger.
- **`prefers-reduced-motion` is a first-class case**: CSS collapses animations to `0.01ms`
  while forcing the reveal states visible, and `useReveal` short-circuits to visible so
  content is never stranded at `opacity: 0`.
- **Theme is set before first paint** by the inline script in `index.html`; `useTheme.ts`
  only reconciles it afterwards. Keep both in sync when changing the storage key.

## Static assets in `public/`

`favicon.svg` / `favicon-32x32.png` / `apple-touch-icon.png` / `icon-192.png` /
`icon-512.png` / `og-image.jpg` / `manifest.webmanifest` / `sitemap.xml` / `404.html` are
**generated or host-specific — never edit them by hand.** The logo PNG is sparse line art
(~4% opaque pixels), so it collapses to noise at 32px; the generated icons use a simplified
vector "Y" monogram instead. Rebuild them with `npm run optimize:images`.

## Deployment

Assumed to be served from the **root of `https://yaltaphil.ru/`** (absolute `/img/...`
paths, absolute `canonical`/`og:image`/`sitemap` URLs, root-relative `start_url` in the
manifest). If it ever moves under a subpath, set `base` in `vite.config.ts` and re-prefix
those URLs. Serve `404.html` for unknown paths so stray deep links get a branded page
instead of a bare web-server error.
