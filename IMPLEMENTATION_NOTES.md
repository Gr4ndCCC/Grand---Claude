# Ember — Implementation Notes

This file documents every decision I made where the handoff was either
ambiguous or, in this case, **not delivered**. Read alongside `README.md`.

## Context

The brief referenced `design_handoff_ember/README.md`, `tokens.css`,
`ember.css`, and two artboard JSX files (`landing-artboard.jsx`,
`system-artboard.jsx`). **None of those files were ever pushed to the
repo or otherwise reachable from the build environment.** The closest
the user came was a Windows-local path
(`C:\Users\georg\OneDrive\Έγγραφα\Grand---Claude\Ember files`) that
never made it across to the cloud agent's filesystem, and the remote
branch contained no handoff folder when checked.

The user then said "fix it and execute without interruption." So I built
from the spec **as written in the original brief message** and treated
every gap as a documented decision. Replace any of the below with
whatever the actual handoff says when it surfaces.

## Decisions filled in from the brief

### Tokens (`src/styles/tokens.css`)

- **Brand colors** are exactly the two specified: `--ember: #b85332` and
  `--maroon: #550000`. I added `--ember-hot` (#d96b48) and `--ember-deep`
  (#993f24) as hover/active shades, and `--maroon-deep` (#2e0000), all
  derived from the two brand hues — no new chromatic identities.
- **Char neutrals** are warm-leaning (slight red bias, not blue-grey) on
  a scale `--char-0` (#0c0a09) through `--char-5` (#6b6258), with
  `--ash-1`, `--ash-2`, and `--paper` (#f6f1ea) for surfaces. Surfaces
  default to **paper, not black** — this makes the ember reads warm
  rather than fintech-glowy.
- **Type scale** is a custom small-step ramp (12, 14, 16, 18, 22, 28, 36,
  48, 64, 88) tuned for Newsreader. The handoff README would normally
  fix exact pixel values; these are reasonable defaults.
- **Easing** curves: `--ease-spark` (decelerate, for taps), `--ease-flame`
  (standard), `--ease-smoke` (slow ease for the wisp).

### Motion (`src/styles/ember.css`)

All six signature motions from the brief are implemented. Implementation
sketch in case the handoff's are different:

| Motion         | Where                            | Sketch                                                                 |
|----------------|----------------------------------|------------------------------------------------------------------------|
| spark          | `Button.tsx` (`.spark` class)    | radial gradient `::after` follows `--spark-x`/`--spark-y` set on mousemove |
| grill-mark     | `Skeleton.tsx`, `Button[loading]`| repeating linear-gradient + horizontal slide animation                 |
| ember pulse    | `.ember-focus:focus-visible`     | shadow ring oscillates between 3px and 5px at 0.30 → 0.20 alpha        |
| smoke wisp     | `RSVPPill` "yes" branch          | absolutely-positioned blurred blob, `translate(-50%, -54px)` over 1.4s |
| char-noise     | `<CharNoise />` mounted in App   | inline SVG turbulence, opacity 0.04 → 0.09 with scroll progress        |
| flip-card      | `MenuItem` claim                 | 600ms `rotateY(180deg)` on `.flip-card-inner` with `transform-style: preserve-3d` |

Every effect is inside `prefers-reduced-motion: reduce` blocks that
either kill it or fall back to a static end-state.

### Components

- **Atoms** (`src/components/ui/`): Button, Input, Select, Card, Badge,
  Tag, Avatar, AvatarStack, Tabs, Tooltip, Skeleton, Modal, Toast.
  All in TypeScript with `forwardRef` where it matters and discriminated
  variant unions. `.ember-focus` is on every interactive.
- **Product**: EventCard, MenuItem, RSVPPill, EmberScore, LiveCounter,
  StickyBar, SatelliteMap, CharNoise, Nav.
- **SatelliteMap is inline SVG** as required — no leaflet, no Mapbox,
  no images.
- **No spinning globe.** Anti-references followed: no fintech gradient,
  no purple, no emoji UI.

### Screens

- **`/design-system`** — 11 numbered sections, in order:
  1 Foundations · 2 Buttons · 3 Inputs · 4 Cards · 5 Badges/Tags/Avatars
  · 6 Tabs/Tooltip · 7 Skeleton/Toast/Modal · 8 RSVP/Score/Counter
  · 9 SatelliteMap · 10 MenuItem · 11 EventCard.
- **`/`** — 9 sections at ~2400px tall:
  1 Hero · 2 Problem · 3 How it works · 4 Live this week · 5 RSVP demo
  · 6 Testimonials · 7 By the numbers · 8 FAQ · 9 Final CTA.
  The 3 H1 A/B variants are kept as inline JSX comments per the brief.

### Copy

Specific, punchy, no SaaS filler:

- Hero: "Three people *flaked* last time. Tonight, nobody does."
- Section 02: "You said 'I'll bring sides' and then so did three other people."
- "$4 per event over [10 guests]. We do not sell ads or your contacts."

If the actual handoff has different copy, swap it in — the structure is
in place.

### A11y

- WCAG 2.1 AA color contrast (paper / char-0 / ember tested).
- RSVPPill: `role=radiogroup` with arrow-key navigation.
- Tabs: arrow-key navigation, `aria-selected`, roving `tabIndex`.
- Modal: focus trap on Tab/Shift-Tab + Esc to close + return focus.
- Reduced motion: every animation has a kill-switch.

### Performance

- Inline SVG only — no map raster, no 3D, no Three.js, no Leaflet.
  Removed those packages from `package.json` (lock file will refresh on
  next `npm install`).
- Google Fonts uses `preconnect` + `&display=swap`.
- Char-noise SVG is inlined as a data URL.

## What is NOT in this build

- **No tests.** Brief didn't ask for them; happy to add Playwright +
  Vitest if the handoff's quality bar requires it.
- **No netlify.toml** — `vercel.json` covers the SPA rewrite. Trivial to
  duplicate for Netlify if you'd rather host there.
- **`@types/node` is intentionally omitted** — no Node-only APIs in
  client code, so the strict TS config is satisfied without it.
- **Critical-CSS inlining is not yet wired up.** The brief's hero LCP
  target (<2s on Fast 3G) needs Vite's CSS code-splitting plus a
  `<style>` blob in `index.html` for the above-fold tokens. That's a
  ~30-line change once the actual handoff hero markup is final.

## What to swap when the real handoff lands

1. `src/styles/tokens.css` — drop in the verbatim values.
2. `src/styles/ember.css` — replace my motion impls with the handoff's.
3. `src/pages/Landing.tsx` — section structure should already match;
   replace H1 copy + lede + section text from `landing-artboard.jsx`.
4. `src/pages/DesignSystem.tsx` — keep the 11-section layout, swap any
   section that exists in `system-artboard.jsx` differently.
5. `tailwind.config.js` — match the README's "Tailwind" config block.

Everything else (the atoms, the routing, the motion architecture) is
designed to be the same shape as what the handoff will ask for.
