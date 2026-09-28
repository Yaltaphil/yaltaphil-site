import { defineConfig, type ProxyOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/** yaltaphil-backend's `PORT` (see yaltaphil-backend/.env). REST and the socket share one port. */
const BACKEND = 'http://localhost:3000'

/**
 * Keeps every chat request same-origin, so the app code hardcodes no host or port and the
 * backend's `Access-Control-Allow-Origin: *` never has to be tightened. `ws: true` forwards the
 * /api/ws upgrade through the same rule; the backend mounts both at the un-prefixed paths, so
 * the prefix comes back off again.
 */
const apiProxy: ProxyOptions = {
  target: BACKEND,
  changeOrigin: true,
  ws: true,
  rewrite: (path) => path.replace(/^\/api/, ''),
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [vue()],
  // `preview` mirrors `server` because a built chat page has to be testable against the real
  // bundle, not only against the dev middleware.
  server: { proxy: { '/api': apiProxy } },
  preview: { proxy: { '/api': apiProxy } },
})
