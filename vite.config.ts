import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Use /Grand---Claude/ base path when deploying to GitHub Pages,
// otherwise root for local dev and other hosts.
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages'

// Replace __SITE_URL__ placeholders in index.html so canonical/OG tags
// point at the real origin (set in Vercel env vars). Falls back to '' so
// the build never crashes when the var is unset.
function htmlEnvSubstitute(siteUrl: string): Plugin {
  return {
    name: 'html-env-substitute',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || ''
  return {
    plugins: [react(), htmlEnvSubstitute(siteUrl)],
    base: isGhPages ? './' : '/',
  }
})
