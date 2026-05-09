# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**yaltaphil-site** is a personal portfolio website built as a monorepo with separate frontend and backend packages.

- **Frontend**: Vue 3 single-page application with Tailwind CSS, styled with Vite
- **Backend**: Express.js server with MongoDB integration
- **Purpose**: Portfolio/resume site showcasing projects and skills

## Development Commands

### Frontend (yaltaphil-frontend/)
```bash
cd yaltaphil-frontend
npm install          # Install dependencies
npm run dev          # Start dev server (Vite, usually http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Backend (yaltaphil-backend/)
```bash
cd yaltaphil-backend
npm install          # Install dependencies
node index.js        # Start the server (PORT defaults to 8080, set via .env)
```

Setup requires a `.env` file in yaltaphil-backend with:
- `PORT=8080` (or desired port)
- `MONGO_URI=<mongodb-connection-string>`

## Architecture

### Frontend Structure
The frontend is a single Vue 3 component-based app with these main sections:

- **App.vue**: Main component (yaltaphil-frontend/src/App.vue)
  - Navigation with logo, about, portfolio, and contact links
  - "About me" section with bio and GitHub link
  - Technologies/skills grid (from technologies.js)
  - Portfolio grid of projects (from projects.js, rendered via PortfolioItem component)
  - Contact info (email, Telegram)
  - Simple counter display (updates every second via onMounted/onUnmounted)

- **PortfolioItem.vue**: Reusable component for portfolio cards
  - Accepts `item` prop of type `IProject`
  - Displays project image, title, description, and link
  - Links to external projects in new tabs

- **Data Files** (src/assets/data/)
  - `projects.js`: Array of project objects (IProject type)
  - `technologies.js`: Array of technology objects

- **Models** (src/models/)
  - `IProject.ts`: TypeScript interface for project data

- **Styling**
  - Uses Tailwind CSS (tailwindcss, autoprefixer, postcss)
  - Global styles in `src/index.css`
  - Vue component scoped styles where needed
  - Custom animation for about section image (pan-image effect)

- **Build Setup**
  - Vite config uses path alias: `/@/` resolves to `src/`
  - Vue 3 SFC (Single File Component) plugin enabled
  - Output includes Google Tag Manager (GTM-T25TGDH) and Yandex Metrika tracking

### Backend Structure
The backend is a minimal Express server (yaltaphil-backend/index.js) with:

- **Routes** (currently active):
  - `GET /`: Basic HTML page with user search form
  - `GET /add500`: Adds 500 test users to MongoDB
  - `POST /result`: Searches users by name and displays results

- **Middleware**:
  - CORS enabled
  - JSON and URL-encoded body parsing

- **Database**:
  - MongoDB client connects on startup
  - Database: `site-db`
  - Collection: `users`
  - Note: Current implementation is basic/development-only; production routes may differ

## Key Files & Locations

```
yaltaphil-site/
├── README.md
├── CLAUDE.md
├── yaltaphil-frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── tsconfig.json (recently added)
│   └── src/
│       ├── main.js (Vue app entry)
│       ├── App.vue (main component)
│       ├── index.css (global styles)
│       ├── components/
│       │   └── PortfolioItem.vue
│       ├── models/
│       │   └── IProject.ts
│       ├── assets/
│       │   ├── data/
│       │   │   ├── projects.js
│       │   │   └── technologies.js
│       │   └── ... (images)
│       └── public/ (static files, img/, favicon)
└── yaltaphil-backend/
    ├── package.json
    ├── index.js (server entry)
    └── .env (not in repo; create locally)
```

## Frontend Tech Stack Details

- **Vue 3** with `<script setup>` syntax and TypeScript
- **Vite** for dev server and bundling
- **Tailwind CSS** for utility-first styling (with responsive modifiers like `md:`, `sm:`)
- **PostCSS + Autoprefixer** for CSS vendor prefixing
- Responsive design with flexbox and Tailwind breakpoints
- Analytics: Google Tag Manager and Yandex Metrika (scripts in index.html)

## Backend Tech Stack Details

- **Express.js** for HTTP server and routing
- **MongoDB** driver (mongodb v4.2+) for database
- **CORS** middleware enabled
- **dotenv** for environment variables
- Minimal routing; mostly development/prototype code

## Development Notes

1. **Frontend**:
   - Uses TypeScript (tsconfig.json present) but not strict mode everywhere yet
   - Vue 3 Composition API with `<script setup>`
   - All styling via Tailwind CSS (inline utility classes)
   - No component library; all custom components
   - Data is static (loaded from .js files, not from API)

2. **Backend**:
   - Currently does NOT serve the frontend; separate dev servers
   - Simple proof-of-concept MongoDB integration
   - Production deployment would need proper routing, API structure, and possibly serving static frontend files

3. **Git History**:
   - Recent commits focus on Vue 3 setup, analytics integration, UI refinements
   - Regular feature branches (feature/*, no destructive history rewriting)

## Common Tasks

- **Update portfolio projects**: Edit `yaltaphil-frontend/src/assets/data/projects.js`
- **Update tech stack**: Edit `yaltaphil-frontend/src/assets/data/technologies.js`
- **Modify design/layout**: Edit App.vue or PortfolioItem.vue (Tailwind classes)
- **Test frontend changes**: Run `npm run dev` in yaltaphil-frontend, open in browser
- **Build frontend for deployment**: `npm run build` generates dist/ folder

## Deployment Notes

- Frontend can be deployed as static files (output from `npm run build`)
- Backend requires Node.js and MongoDB connection
- No current CI/CD pipeline visible; manual deployment setup
