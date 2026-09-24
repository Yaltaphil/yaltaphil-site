# QWEN.md

This file provides guidance to Qwen Code when working with code in this repository.

## Project Overview

**yaltaphil-site** is a personal portfolio website, a monorepo with two independent packages:

- **`yaltaphil-frontend/`** — Vue 3 + TypeScript single-page app, built by Vite, styled with Tailwind CSS
- **`yaltaphil-backend/`** — NestJS 10 + Mongoose 8 API with a small server-rendered debug page
- **Purpose**: portfolio/resume site for a frontend developer (projects, tech stack, certificates, contacts)

The two packages do **not** talk to each other: the frontend makes zero network requests (no
`fetch`, no `axios`, no `import.meta.env`) and renders entirely from typed data files. The backend
is a separate prototype service.

## Development Commands

### Frontend (`yaltaphil-frontend/`)

```bash
npm install
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # vue-tsc --noEmit && vite build → dist/
npm run preview          # serve the production build
npm run optimize:images  # regenerate card/thumb WebP variants, favicons, maskable icons, og-image
npm run optimize:certs   # convert source certificate scans (jpg/jpeg/png) into WebP
```

`sharp` is a devDependency used only by `scripts/` — it is never imported by app code. The only
runtime dependency is `vue`.

### Backend (`yaltaphil-backend/`)

```bash
npm install
npm run start:dev        # ts-node src/main.ts (PORT default 8080)
npm run build            # tsc -p tsconfig.json → dist/
npm start                # node dist/main
```

Requires `yaltaphil-backend/.env` with:
- `MONGO_URI=<connection string>` — **required**; `MongooseModule.forRoot(process.env.MONGO_URI!)`
  has no fallback, so the app dies on boot without it. The database name comes from this string.
- `PORT=8080` (optional, defaults to 8080)

## Architecture

### Frontend

Entry chain: `index.html` → `src/main.ts` → `src/App.vue`, which lays out the page in order:
`NavBar` → `main` (`HeroSection` → `TechSection` → `PortfolioSection` → `CertificatesSection` →
`ContactSection`) → `FooterSection`, plus `ScrollToTop` and a `SecretPage` overlay toggled by an
almost-invisible `·` in the footer.

**There is no router, on purpose.** Navigation is `#anchor` links to sections carrying `id`
(`about`, `stack`, `portfolio`, `certificates`, `contact`). Don't add `vue-router` for a new
full-screen view — use a `ref` + `v-if` overlay like `SecretPage.vue`.

Components (`src/components/`):

| File | Role |
|---|---|
| `NavBar.vue` | Sticky bar; tracks the active section via `IntersectionObserver`; mobile burger + disclosure panel (`aria-expanded`, Esc, click-outside, auto-close at the `md` breakpoint) |
| `SectionHeading.vue` | Shared eyebrow + `h2` + subtitle block with reveal-on-scroll; used by every section |
| `AppIcon.vue` | Geometry-only inline SVG glyphs (github, telegram, mail, external, chevron, arrow, sun/moon, menu/close, users, bolt) so colour follows `currentColor` |
| `HeroSection.vue` | Portrait, role badge, CTAs, scroll hint; `ken-burns` portrait animation (4 passes, not infinite) |
| `TechSection.vue` | Logos grouped by `CATEGORY_ORDER` with per-category accent colour |
| `PortfolioSection.vue` / `PortfolioItem.vue` | CSS grid `1 / sm:2 / lg:3` of project cards |
| `CertificatesSection.vue` | Thumb grid + lightbox (`role="dialog"`, Esc/←/→, focus restored to the opened tile) |
| `ContactSection.vue`, `FooterSection.vue` | Contact links and site footer |
| `DarkModeToggle.vue`, `ScrollToTop.vue`, `SecretPage.vue` | Theme switch, floating scroll-to-top, hidden full-screen view |

Composables (`src/composables/`):

- `useReveal(threshold)` — fades content in once when it enters the viewport, then disconnects.
  Immediately returns `visible` under `prefers-reduced-motion` or when `IntersectionObserver` is
  missing, so content can never be stranded at `opacity: 0`.
- `useScrollLock()` — reference-counted `overflow: hidden` on `<html>` for overlays; restores the
  previous value and unlocks on unmount.
- `useTheme()` — module-level shared `theme` ref. `<html class="dark">` is applied by an **inline
  script in `index.html` before first paint** (to avoid a light flash); this composable only
  reconciles and toggles. Keep both places in sync if the storage key ever changes.

Data (`src/assets/data/`) — content lives here, not in components:

- `projects.ts` (`IProject[]`), `technologies.ts` (`ITechnology[]` + `CATEGORY_ORDER`),
  `certificates.ts` (`ICertificate[]`), `navigation.ts` (`NAV_ITEMS` — the single source for both
  the desktop links and the observed section ids)

Models: `src/models/IProject.ts`.

### Styling conventions

- Tailwind utility classes in markup; `darkMode: 'class'`.
- **Colour is tokenized.** `theme.extend.colors.brand.{50..950}` + `accent` in
  `tailwind.config.js` drive the hero gradient, chips, focus rings and category accents. Re-skin
  there instead of scattering raw `indigo-*`/`purple-*` literals. Also defined: `maxWidth.content`
  (64rem container) and `shadow-card` / `shadow-card-hover`.
- `src/index.css` owns the animation system (`.fade-in-up`, `.stagger-item` + `.section-visible`,
  `.hero-animate`, `.ken-burns`, `.hero-min`) and the global `prefers-reduced-motion` collapse.
  Anchor offset is **one mechanism only**: `--nav-height` (4rem + the 1px border) consumed by
  `html { scroll-padding-top }`. Do not add `scroll-margin-top` on sections as well — the two
  stack and every jump lands ~128px early. Per-component `<style scoped>` is only for one-off
  transitions (lightbox, menu, scroll-to-top).
- **Every image sits in a fixed-ratio frame** (`aspect-[16/10]`, `aspect-[3/2]`, `w-14 h-14`), so
  layout cannot shift while images decode. Use `imageFit: 'contain'` on a project whose artwork
  can't be cropped (small logos, low-res GIF).
- Copy is **English-only**, matching `lang="en"`; the site intentionally has no i18n switch.
- Accessibility is a real requirement here: skip link in `App.vue`, `aria-current` on the active
  nav item, `aria-label`s on icon-only buttons, and any full-page overlay must be a dialog with
  `useScrollLock` + Escape + focus return.

### Generated assets — never hand-edit

`public/` mixes handwritten and generated files. Generated by `scripts/optimize-images.mjs`:

- `public/img/portfolio/*-card.webp` (≤512px) and `public/img/certificates/*-thumb.webp` (≤400px)
- `favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
- `og-image.jpg` (1200×630)

Both scripts are idempotent: outputs newer than their input are skipped, and
`optimize:certs` only converts `jpg/jpeg/png`, so re-running never compounds loss. The source
`Y-logo.png` is sparse line art (~4% opaque pixels), which collapses to noise at 32px — that is
why generated icons use a simplified vector "Y" monogram rather than the real logo.

### Backend

NestJS modular monolith under `yaltaphil-backend/src/`: `main.ts` (bootstrap, `enableCors()`,
urlencoded body parser), `app.module.ts` (`ConfigModule` + `MongooseModule`), and a single feature
module `users/` (`user.schema.ts`, `users.module.ts`, `users.controller.ts`, `users.service.ts`).

`UsersController` is mounted at the root path:

| Route | Purpose |
|---|---|
| `GET /` | Server-rendered HTML table of users with search / add / clear / delete buttons |
| `GET /add5` | Insert 5 random generated users |
| `GET /clear` | Delete all users |
| `GET /users?name=` | List all, or case-insensitive regex search by name (input is escaped) |
| `POST /users` | Create `{ name, role }` (201) |
| `GET /users/:id` · `PATCH /users/:id` · `DELETE /users/:id` | Single-user read / update / delete (204) |
| `POST /result` | Legacy HTML `<ol>` search results |

Data model: `User { name, role }`; collection `users` (Mongoose default pluralization). The whole
thing is still a development prototype — no auth, no validation layer, no tests.

## Key Files & Locations

```
yaltaphil-site/
├── QWEN.md
├── README.md
├── yaltaphil-frontend/
│   ├── index.html                    # meta/OG/JSON-LD/manifest + theme bootstrap + analytics
│   ├── package.json                  # dev/build/preview/optimize:images/optimize:certs
│   ├── vite.config.ts                # alias '@' → ./src, @vitejs/plugin-vue
│   ├── tailwind.config.js            # brand ramp, accent, max-w-content, card shadows
│   ├── tsconfig.json                 # strict: true, noEmit (vue-tsc does the checking)
│   ├── scripts/
│   │   ├── optimize-images.mjs       # card/thumb variants, icons, og-image
│   │   └── compress-certs.mjs        # scan → WebP
│   ├── public/
│   │   ├── img/{icons,portfolio,certificates}/
│   │   ├── favicon.svg · apple-touch-icon.png · icon-192.png · icon-512.png · og-image.jpg
│   │   └── manifest.webmanifest · sitemap.xml · robots.txt · 404.html
│   └── src/
│       ├── main.ts                   # createApp(App)
│       ├── App.vue                   # skip link + <main> + section order
│       ├── index.css                 # nav offset, reveal/stagger, reduced-motion
│       ├── components/               # 13 SFCs (see Architecture)
│       ├── composables/              # useReveal, useScrollLock, useTheme
│       ├── models/IProject.ts
│       └── assets/data/              # projects, technologies, certificates, navigation
└── yaltaphil-backend/
    ├── .env                          # not in repo; MONGO_URI required
    ├── tsconfig.json
    └── src/
        ├── main.ts · app.module.ts
        └── users/                    # schema, module, controller, service
```

## Common Tasks

- **Add/edit a project** → `src/assets/data/projects.ts`. Reference the full image as `picture`
  and the generated small variant as `card` (`/img/portfolio/<name>-card.webp`); run
  `npm run optimize:images` after adding a source image. Set `imageFit: 'contain'` for logos or
  low-resolution art.
- **Add a certificate** → `src/assets/data/certificates.ts`, then `npm run optimize:certs` (if you
  dropped a new scan in) and `npm run optimize:images` (for the thumb).
- **Change a section's look** → its component; for anything colour-related, prefer the `brand`
  tokens.
- **Add a heading to a new section** → reuse `SectionHeading.vue` rather than writing another
  `h2` with hand-tuned classes.
- **Add an overlay/full-screen view** → `ref` + `v-if` component using `useScrollLock` and the
  `SecretPage.vue` dialog pattern; no new dependency.
- **Verify changes** → `npm run build` (type-checks and builds) plus a real browser pass; see the
  gotchas below before trusting either alone.

## Deployment Notes

- The frontend deploys as static files from `dist/`; nothing in the repo configures hosting and
  there is no CI/CD pipeline.
- **Everything assumes the site is served from the root of `https://yaltaphil.ru/`.** `canonical`,
  `og:url`, `og:image`, `twitter:image`, `sitemap.xml`, `robots.txt`, the manifest `id`/`start_url`
  and all absolute `/img/...` paths hardcode that origin. Moving to a subpath (e.g. GitHub Pages)
  means setting `base` in `vite.config.ts` **and** re-prefixing every one of those URLs — flag it
  rather than patching a single spot.
- To make the branded `public/404.html` actually serve, the host needs a rule for unknown paths
  (e.g. `try_files $uri $uri/ /404.html;` in nginx).
- The backend needs Node.js and a reachable MongoDB; it does not serve the frontend.

## Working Notes For Agents

- History is linear on `main` with **no merge commits** — work is committed directly there using
  Conventional Commits scoped by package (`feat(frontend): …`, `style(backend): …`, `docs: …`).
  Match that format. Do not commit unless asked — the tree may hold unrelated uncommitted work
  from the user.
- `CLAUDE.md` at the repo root is a separate guidance file for another tool and can drift from this
  one; when you change an architectural fact here, check whether it needs the same edit.
- To verify UI behaviour headlessly, serve `dist/` (`npm run preview`) and block the analytics
  hosts (Yandex Metrika, GTM) before waiting on the page: `waitUntil: 'networkidle'` against them
  will hang the run until timeout.
- `index.html` loads GTM (`GTM-T25TGDH`) and Yandex Metrika (`87089373`, webvisor on) with no
  consent gate; leave them unless the user asks, and don't drop them by accident when editing the
  `<head>`.
