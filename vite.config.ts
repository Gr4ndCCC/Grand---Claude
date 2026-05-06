import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Site is served from emberworld.co (custom apex domain on GitHub Pages),
// so absolute root paths are correct. BrowserRouter requires this.

// Replace __SITE_URL__ placeholders in index.html so canonical/OG tags
// point at the real origin. Falls back to '' so the build never crashes
// when the var is unset.
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
  const siteUrl = env.VITE_SITE_URL || 'https://emberworld.co'
  return {
    plugins: [react(), htmlEnvSubstitute(siteUrl)],
    base: '/',
  }
})
