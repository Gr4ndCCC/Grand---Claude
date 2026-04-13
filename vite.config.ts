import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use /Grand---Claude/ base path when deploying to GitHub Pages,
// otherwise root for local dev and other hosts.
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages'

export default defineConfig({
  plugins: [react()],
  base: isGhPages ? '/Grand---Claude/' : '/',
})
