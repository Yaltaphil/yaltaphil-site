# QWEN.md

This file provides guidance to Qwen Code when working with code in this repository.

## Project Overview

**yaltaphil-site** is a personal portfolio website, a monorepo with two independent packages:

- **`yaltaphil-frontend/`** — Vue 3 + TypeScript single-page app, built by Vite, styled with Tailwind CSS
- **`yaltaphil-backend/`** — NestJS 12 + Mongoose 9 API with a small server-rendered debug page
- **Purpose**: portfolio/resume site for a frontend developer (projects, tech stack, certificates, contacts)

The two packages are mostly independent: the portfolio itself makes **zero** network requests and
renders entirely from typed data files. The one exception is the `/chat` view, which talks to the
backend's `messages` resource through a relative `/api` prefix that Vite proxies — see
[Chat view](#chat-view-chat). Outside that view there is no `fetch`, no `WebSocket` and no
`import.meta.env` in `src/`.

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
npm run start:dev        # ts-node src/main.ts — plain run, no watch: restart by hand after edits
npm run build            # tsc -p tsconfig.json → dist/
npm start                # node dist/main
```

TypeScript is pinned to the 5.x line on purpose: `ts-node@10` cannot load TypeScript 7 (the native
port), and `start:dev` dies in `readConfig` with `Cannot read properties of undefined (reading
'fileExists')` before `main.ts` runs. `npm run build` compiles this codebase under TS 7 without
errors and still emits `design:paramtypes`, so the constraint is the dev runner, not the compiler.

Requires `yaltaphil-backend/.env`, which is read from `process.cwd()` — run the scripts from
`yaltaphil-backend/`, not from the repo root:
- `MONGO_URI=<connection string>` — **required**, and it must start with `mongodb://` or
  `mongodb+srv://`. `MongooseModule.forRoot(process.env.MONGO_URI!)` has no fallback. The database
  name comes from this string.
- `PORT=<number>` — optional, defaults to 8080; must be a whole number in 1–65535 and be free.

`main.ts` validates both **before** `NestFactory.create`, so a missing or malformed `MONGO_URI`, a
bad `PORT` or an occupied port prints `[warning] …` on stderr and leaves exit code 1 without
connecting to MongoDB or mapping a single route. The URI value is deliberately never echoed — it
carries credentials.

## Architecture

### Frontend

Entry chain: `index.html` → `src/main.ts` → `src/App.vue`, which lays out the page in order:
`NavBar` → `main` (`HeroSection` → `TechSection` → `PortfolioSection` → `CertificatesSection` →
`ContactSection`) → `FooterSection`, plus `ScrollToTop` and a `SecretPage` overlay toggled by an
almost-invisible `·` in the footer.

**There is no router, on purpose.** Navigation is `#anchor` links to sections carrying `id`
(`about`, `stack`, `portfolio`, `certificates`, `contact`). Don't add `vue-router` for a new
full-screen view — use a `ref` + `v-if` overlay like `SecretPage.vue`. The one exception is
`/chat`, a genuine second URL that must be its own document because the whole portfolio is a
single scroll: `App.vue` tests `location.pathname` once at boot and renders `ChatPage.vue`
*instead of* the portfolio, so entering and leaving are plain document loads and there is no
client-side route state to keep in sync.

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
| `ChatPage.vue` | The `/chat` document: display-name gate, transcript, composer, connection pill. Reuses the `SecretPage` conventions (`h-[100dvh]`, brand tokens, focus on mount) but is a page, not a dialog — no `useScrollLock`, no Escape-to-close |

Composables (`src/composables/`):

- `useReveal(threshold)` — fades content in once when it enters the viewport, then disconnects.
  Immediately returns `visible` under `prefers-reduced-motion` or when `IntersectionObserver` is
  missing, so content can never be stranded at `opacity: 0`.
- `useScrollLock()` — reference-counted `overflow: hidden` on `<html>` for overlays; restores the
  previous value and unlocks on unmount.
- `useTheme()` — module-level shared `theme` ref. `<html class="dark">` is applied by an **inline
  script in `index.html` before first paint** (to avoid a light flash); this composable only
  reconciles and toggles. Keep both places in sync if the storage key ever changes.
- `useChat()` — the chat's whole runtime: REST history, the socket, and the reconnect ladder
  (1s doubling to 15s, reset on a successful open). Owns `messages` / `status` / `author`, where
  the display name persists in `localStorage` under `chat-author`. Sends go over REST and arrive
  back as a broadcast, which is why every open tab converges without the client owning any
  protocol. `put()` **upserts** rather than appends — our own POST lands before its echo does. On
  a *re*connect the list is re-read, because frames emitted while we were away are gone for good.

Network (`src/api/`) — one module, and the only place allowed to know the backend's wire format:

- `chat.ts` — REST and socket URLs are **relative** (`/api/messages`, `/api/ws`) so the browser
  stays same-origin and no host or port is hardcoded in app code; Vite supplies the proxy (see
  [Chat view](#chat-view-chat)). It absorbs the two asymmetries of the protocol: documents arrive
  as `_id` (the UI only ever sees `id`) and `message:deleted` arrives as a bare `id`, so
  `message:new` / `message:updated` / `message:deleted` collapse into
  `{ event: 'message' | 'removed' }`. Anything unrecognised — including the `ready` handshake
  frame — is dropped by `parseFrame` rather than thrown at the UI. A `fetch` rejection (nothing
  listening at all) is turned into `Server unreachable`, because Chrome's raw
  `TypeError: Failed to fetch` is not something a visitor can act on.
- **The socket never answers a client.** There is no `@SubscribeMessage` in the gateway, and
  `WsAdapter` silently discards any inbound frame — measured: three sends, zero replies, no ack
  and no error. Writes therefore go over REST only, and a client cannot ask for a re-sync, so
  `useChat` re-reads `GET /messages` itself after a reconnect.
- **`message:deleted` echoes the URL segment verbatim, not the canonical `_id`.** Mongoose casts
  `6ABA…` and `6aba…` to the same document, so a delete issued with uppercase hex broadcasts that
  uppercase string back while the stored id is lowercase. `parseFrame` lowercases it — without
  that the row is stranded in every open tab until the next reconnect (verified both ways in a
  live browser).

Data (`src/assets/data/`) — content lives here, not in components:

- `projects.ts` (`IProject[]`), `technologies.ts` (`ITechnology[]` + `CATEGORY_ORDER`),
  `certificates.ts` (`ICertificate[]`), `navigation.ts` (`NAV_ITEMS` — the single source for both
  the desktop links and the observed section ids)

Models: `src/models/IProject.ts`, `src/models/IChatMessage.ts`.

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

### Chat view (`/chat`)

The only networked surface in the repo, and the only link between the two packages. It is a
demo of realtime delivery: type a name, post a message, and every other open tab receives it
over the socket with no polling and no reload.

Running it locally needs the backend up first (`yaltaphil-backend`, `npm run start:dev`), then
`npm run dev` and **http://localhost:5173/chat**. Both `server.proxy` and `preview.proxy` in
`vite.config.ts` forward the single `/api` prefix to `BACKEND` and strip it again, so dev and
`npm run preview` behave identically. `BACKEND` is `http://localhost:3000`, which is the local
`.env`'s `PORT` — `main.ts` itself defaults to `8080`, so if either side changes, the constant in
`vite.config.ts` has to change with it. Verified: `rewrite` **is** applied to the `ws://` upgrade
as well as to plain requests, so one rule covers REST and socket.

Things that are load-bearing and not obvious from the code:

- **Client-side validation is the only validation.** `messages/dto/create-message.dto.ts` is a
  bare class — no `class-validator` import, no decorators — and no global `ValidationPipe` is
  registered, so it constrains nothing at runtime. A blank or missing `text` therefore reaches
  Mongoose's `required` and answers **500** (`{"statusCode":500,"message":"Internal server
  error"}`), not a 400. `useChat` trims and rejects empty input before asking, which is why the
  composer disables Send on whitespace. `author` has no rule anywhere either — measured: a
  one-character name and even `''` both return 201 — and a malformed `:id` fails on Mongoose's
  cast path with another 500 rather than a 400.
- **No auth, and writes are open.** `enableCors()` is `Access-Control-Allow-Origin: *` with no
  allowlist, and `DELETE /messages/:id` is unauthenticated. The view is therefore deliberately
  **unlinked** — reachable by URL only, like `SecretPage` — and `public/robots.txt` carries
  `Disallow: /chat`. Do not advertise it in the nav or the sitemap while the backend stays a
  prototype.
- **Two tabs of the same browser share one identity**, because the display name lives in
  `localStorage`. To test multi-user delivery, use a second browser profile or an incognito
  window; "«name» · change" in the header re-opens the gate with the name prefilled.
- `isMine` compares author **strings**, so two people who pick the same name see each other's
  messages as their own. There is no session id to compare against.
- `ChatPage.vue` derives a `rows` list instead of formatting in the template:
  `Intl.DateTimeFormat#format` throws `RangeError` on an unparseable date, and one bad
  `createdAt` from the wire would otherwise take the whole transcript down.

### Backend

NestJS modular monolith under `yaltaphil-backend/src/`: `main.ts` (startup config checks, bootstrap,
`enableCors()`, urlencoded body parser, `WsAdapter`), `app.module.ts` (`ConfigModule` +
`MongooseModule`), and two feature modules — `users/` (`user.schema.ts`, `users.module.ts`,
`users.controller.ts`, `users.service.ts`) and `messages/` (`message.schema.ts`,
`messages.module.ts`, `messages.controller.ts`, `messages.service.ts`, `messages.gateway.ts`,
`dto/`).

The chat gateway shares the HTTP port rather than opening its own: `WsAdapter` is handed
`app.getUnderlyingHttpServer()` and dispatches upgrades by path, so the socket lives on
`ws://localhost:<PORT>/ws`. It does not support namespaces or rooms — `@nestjs/platform-socket.io`
is the adapter to reach for if messages ever get split into subscribable rooms.

The order inside `app.module.ts`'s `imports` array is load-bearing, not cosmetic:
`ConfigModule.forRoot()` is what pushes `.env` into `process.env`, and it only does that before
`MongooseModule.forRoot(process.env.MONGO_URI!)` reads it because the two are evaluated left to
right in the same array literal. Reorder them and `MONGO_URI` is `undefined` at startup.

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

`MessagesController` is mounted at `/messages`; every mutation is broadcast to all connected socket
clients as a JSON frame `{ event, data }` — the wire format of `@nestjs/platform-ws`, readable by a
plain browser `WebSocket` with no client library. Events: `ready` on connect, then `message:new`,
`message:updated`, `message:deleted` (payload is `{ id }`).

| Route | Purpose |
|---|---|
| `POST /messages` | Create `{ text, author? }` (201) |
| `GET /messages` | All messages sorted by `createdAt` ascending — no pagination, no filter |
| `GET /messages/:id` · `PATCH /messages/:id` · `DELETE /messages/:id` | Single-message read / update / delete (204), 404 when the id is unknown |

`src/api/chat.ts` in the frontend is this resource's first real consumer. Two consequences of the
contract above: `GET /messages` has no pagination, so the chat re-reads the **whole** collection
on first load and on every reconnect — fine for a demo, linear cost otherwise; and `PATCH` with an
empty body reaches Mongoose's `_id`-cast path and answers 500, which the chat never exercises
because it has no edit UI.

Data model: `User { name, role }` and `Message { text, author }` (with `timestamps: true`);
collections `users` and `messages` (Mongoose default pluralization). Updates go through
`findByIdAndUpdate(…, { returnDocument: 'after' })` — Mongoose 9 deprecated the `{ new: true }`
spelling that `users.service.ts` still uses. The whole thing is still a development prototype — no
auth, no tests, and no request validation: the config checks in `main.ts` are the only validation
in the package.

## Key Files & Locations

```
yaltaphil-site/
├── QWEN.md
├── README.md
├── yaltaphil-frontend/
│   ├── index.html                    # meta/OG/JSON-LD/manifest + theme bootstrap + analytics
│   ├── package.json                  # dev/build/preview/optimize:images/optimize:certs
│   ├── vite.config.ts                # alias '@' → ./src, @vitejs/plugin-vue, /api proxy (server+preview)
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
│       ├── App.vue                   # skip link + <main> + section order; branches to ChatPage on /chat
│       ├── index.css                 # nav offset, reveal/stagger, reduced-motion
│       ├── api/chat.ts               # the only backend-aware module: REST + frame normalisation
│       ├── components/               # 14 SFCs (see Architecture)
│       ├── composables/              # useReveal, useScrollLock, useTheme, useChat, useJsonLd, usePrintCv
│       ├── models/                   # IProject.ts, IChatMessage.ts
│       └── assets/data/              # projects, technologies, certificates, navigation, experience
└── yaltaphil-backend/
    ├── .env                          # not in repo; MONGO_URI required, PORT optional
    ├── tsconfig.json
    └── src/
        ├── main.ts · app.module.ts
        ├── users/                    # schema, module, controller, service
        └── messages/                 # schema, module, controller, service, gateway, dto/
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
- **Add a second URL (not an overlay)** → follow `/chat`: a `location.pathname` test in `App.vue`
  that swaps the whole tree, plus the host rewrite rules below. Still no `vue-router` — that would
  be the first runtime dependency besides `vue`.
- **Talk to the backend** → only through `src/api/chat.ts`; keep components free of paths, of
  `_id`, and of raw `WebSocket` lifecycles (`useChat` owns those).
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
- **`/chat` needs two host rules, and they interact with the 404 rule above.** A blanket
  `try_files … /404.html` fallback makes `/chat` return the 404 page, because the file does not
  exist on disk — `dist/` contains only `index.html` for every route. Scope the fallback:
  ```nginx
  location = /chat { try_files /index.html =404; }   # the SPA branch, by exact path
  location / { try_files $uri $uri/ /404.html; }     # keep the branded 404 for everything else
  ```
  and proxy the API on the same origin, mirroring `vite.config.ts` (this is what keeps the
  relative `/api/...` URLs working in production):
  ```nginx
  location /api/ {
    proxy_pass http://127.0.0.1:3000/;   # trailing slash strips /api, like `rewrite` does
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
  ```
  Without the `Upgrade`/`Connection` headers REST still works and the chat silently degrades to
  "Offline" — verify the socket, not just the page. `/api` is also how the backend avoids
  `Access-Control-Allow-Origin: *` ever mattering.
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
- **The user usually has the backend already running on its `.env` port**, so a second
  `npm run start:dev` refuses at the port probe with `[warning] Port 3000 is already in use` and
  exit code 1. Check the port answers (`GET /messages`) before trying to start it, and never stop
  a process you did not launch.
- Chat probes write into the **shared demo database** and the socket broadcasts to every other
  connected client — including the user's own open tab. Tag probe authors, delete the rows
  afterwards, and say how many were removed.
- Two tabs in one browser profile are one user, not two: the display name is `localStorage`. A
  headless probe needs a separate `browser.newContext()` per identity to exercise delivery.
- `index.html` loads GTM (`GTM-T25TGDH`) and Yandex Metrika (`87089373`, webvisor on) with no
  consent gate; leave them unless the user asks, and don't drop them by accident when editing the
  `<head>`.
