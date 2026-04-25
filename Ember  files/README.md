# 🔥 Ember Backend API

Global social BBQ app backend — Node.js + Express + Supabase + Stripe + Socket.io

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | Supabase (PostgreSQL + PostGIS) |
| Auth | Supabase Auth (JWT) |
| Real-time | Socket.io + Supabase Realtime |
| Subscriptions | Stripe |
| Geospatial | PostGIS ST_DWithin |

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd ember-backend
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Legacy tab → Project URL |
| `SUPABASE_ANON_KEY` | Settings → API → Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → Secret key (click eye to reveal) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Run `stripe listen` (see below) |
| `STRIPE_VAULT_MONTHLY_PRICE_ID` | Stripe → Products → create Vault Monthly → copy price ID |
| `STRIPE_VAULT_ANNUAL_PRICE_ID` | Stripe → Products → create Vault Annual → copy price ID |

### 3. Run database schema

1. Open [Supabase SQL Editor](https://supabase.com/dashboard)
2. Click **New query**
3. Paste the entire contents of `supabase/schema.sql`
4. Click **Run** — should complete with no errors

### 4. Start the server

```bash
npm run dev       # development with auto-restart
npm start         # production
```

### 5. Test health check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "status": "Ember API is running",
  "version": "1.0.0"
}
```

### 6. Test registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ember.app","password":"Ember2025!","username":"testbrother","full_name":"Test Brother"}'
```

---

## Stripe webhook (local dev)

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login, returns JWT |
| POST | /api/auth/logout | ✓ | Logout |
| GET | /api/auth/me | ✓ | Get current user profile |
| POST | /api/auth/refresh | — | Refresh JWT |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/users/search?q= | — | Search users |
| GET | /api/users/:username | — | Get profile by username |
| PUT | /api/users/me | ✓ | Update own profile |
| POST | /api/users/:username/follow | ✓ | Follow a user |
| DELETE | /api/users/:username/follow | ✓ | Unfollow a user |
| GET | /api/users/:username/followers | — | List followers |
| GET | /api/users/:username/following | — | List following |

### Events
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/events?lat=&lng=&radius= | — | List events (PostGIS nearby) |
| POST | /api/events | ✓ | Create event |
| GET | /api/events/:id | — | Get event with participants |
| PUT | /api/events/:id | ✓ host | Update event |
| DELETE | /api/events/:id | ✓ host | Delete event |
| POST | /api/events/:id/join | ✓ | Join event |
| DELETE | /api/events/:id/join | ✓ | Leave event |
| GET | /api/events/:id/participants | — | List participants |
| POST | /api/events/:id/contributions | ✓ | Add contribution |
| DELETE | /api/events/:id/contributions/:cid | ✓ | Remove contribution |
| GET | /api/events/:id/contributions | — | List contributions |

### Feed
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/posts?limit=&offset= | optional | Get feed |
| POST | /api/posts | ✓ | Create post |
| POST | /api/posts/:id/like | ✓ | Like post |
| DELETE | /api/posts/:id/like | ✓ | Unlike post |
| DELETE | /api/posts/:id | ✓ | Delete own post |

### Vault (requires Vault membership)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/vault/recipes | ✓ vault | Get recipes |
| POST | /api/vault/recipes | ✓ vault | Submit recipe |
| GET | /api/vault/council | ✓ vault | Get council votes |
| POST | /api/vault/council/:id/vote | ✓ vault | Cast vote |
| GET | /api/vault/brotherhood | ✓ vault | Get brotherhood members |

### Partners
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/partners/apply | — | Submit partner application |

### Stripe
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/stripe/create-checkout | ✓ | Create Stripe checkout session |
| GET | /api/stripe/subscription | ✓ | Get subscription status |
| POST | /api/stripe/webhook | — | Stripe webhook (raw body) |

---

## Real-time (Socket.io)

Connect at `ws://localhost:3000`

**Events to emit:**
- `join_event` — `{ event_id, user }` — join an event room
- `send_message` — `{ event_id, message }` — send message to event room
- `typing` — `{ event_id, username }` — typing indicator

**Events to listen for:**
- `new_message` — new message in room
- `online_users` — array of users currently in the room
- `user_typing` — someone is typing

---

## Deployment

Railway or Render — connect repo, set env vars, deploy. Both support Node.js natively.

```bash
# Set NODE_ENV for production
NODE_ENV=production npm start
```
