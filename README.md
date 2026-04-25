# Ember

Backyard BBQ, quietly coordinated. Two apps:

- **`/` (root)** — marketing site (Vite + React). Deploys to Vercel.
- **`backend/`** — REST API + Socket.io chat (Express + Supabase + Stripe).
  Deploys to Railway / Render.

---

## Frontend

### Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS, custom token system (`src/styles/tokens.css`)
- React Router — `/` landing, `/design-system` library
- Newsreader (display + body), JetBrains Mono (system voice)
- `lucide-react` for icons, `clsx` for class composition
- No runtime maps lib, no 3D, no animation lib — inline SVG + CSS

### Setup

```bash
npm install            # install deps
npm run dev            # http://localhost:5173
npm run build          # type-check + production bundle
npm run preview        # serve the build
```

If your environment hits peer-dep noise, use `npm install --legacy-peer-deps`.

### Routes

- `/` — landing, 9 sections, sticky activity bar, ~2400px tall
- `/design-system` — 11 numbered sections covering every primitive

### Deploy (Vercel)

```bash
npx vercel              # first preview
npx vercel --prod       # promote to production
```

`vercel.json` handles SPA rewrites, security headers (HSTS, CSP-lite,
nosniff, frame, referrer, permissions), and asset caching. After the
first preview, set these env vars in Vercel → Settings → Environment
Variables, then redeploy:

| Var               | What                                                       |
|-------------------|------------------------------------------------------------|
| `VITE_SITE_URL`   | Your final origin, e.g. `https://ember.app`                |
| `VITE_GA_ID`      | Google Analytics 4 measurement ID, e.g. `G-XXXXXXXXXX`     |
| `VITE_API_URL`    | Backend base URL, only when wiring to the API              |

`VITE_SITE_URL` flows into the canonical link, the Open Graph URL +
image, and the JSON-LD WebSite payload. With it unset, those fall
back to `/`, which is fine for the very first preview but should be
replaced before production.

### Deploy (GitHub Pages)

```bash
DEPLOY_TARGET=gh-pages npm run build
# publish dist/ to a gh-pages branch
```

`DEPLOY_TARGET=gh-pages` sets Vite's `base` to `/Grand---Claude/`.

### Brand discipline

- Newsreader serif everywhere. No Inter, no Geist, no system-ui.
- Italic serif used sparingly. Mono uppercase = system voice.
- Two chromatic colors only: `--ember` (#b85332), `--maroon` (#550000).
- Surfaces default to paper (#f6f1ea), not black.
- No emoji UI, no spinning globe, no fintech gradients, no purple.

---

## Backend

REST API for events, users, posts, vault, partners, and Stripe
subscriptions. Socket.io powers per-event chat.

### Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in Supabase + Stripe keys
npm run dev            # nodemon, http://localhost:3000
```

### Database

Open the [Supabase SQL Editor](https://supabase.com/dashboard) and run
`backend/supabase/schema.sql` in one go. It enables PostGIS, creates all
tables, and applies row-level security policies.

### Deploy (Railway / Render)

Both platforms autodetect Node:

1. Connect this repo, set the **root directory** to `backend/`.
2. Set env vars from `backend/.env.example` (production values).
3. **Critical**: set `CORS_ORIGIN` to your real frontend URL —
   never leave it as `*` in production.
4. Set `NODE_ENV=production` so the boot sanity-checks run.
5. Start command: `node src/app.js` (already in `Procfile`).

For local Stripe webhook testing:

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
# copy the printed whsec_… into STRIPE_WEBHOOK_SECRET
```

### Security posture

- **helmet** sets standard hardening headers
- **CORS** is allow-list based (`CORS_ORIGIN`, comma-separated) with
  credentials support — never wildcard with credentials
- **express-rate-limit** — 200 req / 15 min globally, 20 req / 15 min
  on `/api/auth/*`
- **express-validator** — body / param validators on every mutating
  endpoint
- Stripe **webhook signature** is verified before any side effect
- Stripe webhook handler runs on a raw body parser; all other routes
  use a 2 MB JSON cap
- Supabase **service role key** stays server-side — only `supabaseAdmin`
  has it, never returned in any response
- Vault routes pass through `requireAuth` then `requireVaultMember`
- Boot fails fast in production if `SUPABASE_URL` is missing
- **Row-Level Security** is enabled on every table in `schema.sql`
- `app.set('trust proxy', 1)` in production so rate limits work behind
  Railway / Render's TLS termination
- Error handler hides stack traces in production

### `.env` discipline

`.env` is in `.gitignore`. Only `.env.example` is committed. If you
ever leak a key: rotate it in Stripe / Supabase first, then patch.

---

## Project layout

```
.
├── src/                       # frontend
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── lib/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/supabase.js
│   │   ├── middleware/auth.js
│   │   ├── routes/{auth,users,events,posts,partners,vault,stripe}.js
│   │   └── controllers/
│   ├── supabase/schema.sql
│   ├── .env.example
│   ├── package.json
│   └── Procfile
├── public/
├── index.html
├── package.json
├── vercel.json
└── tailwind.config.js
```

## See also

- [`IMPLEMENTATION_NOTES.md`](./IMPLEMENTATION_NOTES.md) — places the
  handoff was ambiguous and what was decided instead.
