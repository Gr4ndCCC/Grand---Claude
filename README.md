# Ember

Backyard BBQ, quietly coordinated. RSVP, claim a dish, show up.

## Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS, custom token system (`src/styles/tokens.css`)
- React Router — `/` landing, `/design-system` library
- Newsreader (display + body), JetBrains Mono (system voice)
- `lucide-react` for icons, `clsx` for class composition
- No runtime maps lib, no 3D, no animation lib — inline SVG + CSS

## Setup

```bash
npm install            # install deps
npm run dev            # http://localhost:5173
npm run build          # type-check + production bundle
npm run preview        # serve the build
```

If your environment hits peer-dep noise, use `npm install --legacy-peer-deps`.

## Routes

- `/` — landing, 9 sections, sticky activity bar, ~2400px tall
- `/design-system` — 11 numbered sections covering every primitive

## Deploy

### Vercel

```bash
npx vercel               # follow prompts; vercel.json handles SPA rewrites
```

### GitHub Pages

```bash
DEPLOY_TARGET=gh-pages npm run build
# then publish dist/ to a gh-pages branch
```

The `DEPLOY_TARGET=gh-pages` env var sets Vite's `base` to
`/Grand---Claude/`. For any other host, leave it unset.

## Project layout

```
src/
  components/
    ui/                # atoms: Button, Input, Modal, Toast, …
    EventCard.tsx      # product
    MenuItem.tsx
    RSVPPill.tsx
    EmberScore.tsx
    LiveCounter.tsx
    SatelliteMap.tsx
    StickyBar.tsx
    Nav.tsx
    CharNoise.tsx
  pages/
    Landing.tsx
    DesignSystem.tsx
  styles/
    tokens.css         # CSS variables — colors, type, easing, shadows
    ember.css          # base styles + signature motion
  lib/
    cn.ts              # clsx wrapper
  App.tsx
  main.tsx
```

## Brand discipline

- Newsreader serif everywhere. No Inter, no Geist, no system-ui.
- Italic serif = emotional accent. Mono uppercase = system voice.
- Two chromatic colors only: `--ember` (#b85332), `--maroon` (#550000).
- Surfaces default to paper (#f6f1ea), not black.
- No emoji UI, no spinning globe, no fintech gradients, no purple.

## See also

- [`IMPLEMENTATION_NOTES.md`](./IMPLEMENTATION_NOTES.md) — every place
  the handoff was ambiguous (or in this case, not delivered) and what I
  decided instead.
