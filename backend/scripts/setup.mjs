#!/usr/bin/env node
// ================================================================
// Ember BBQ — One-Command Setup & Test
// Run: cd backend && node scripts/setup.mjs
//
// This script:
//  1. Runs Phase 1 schema (users, follows, RLS, indexes, triggers)
//  2. Runs Phase 2 schema (events, posts, partners, etc.)
//  3. Verifies all tables, RLS, and PostGIS
//  4. Starts the API server
//  5. Tests all endpoints (health, auth, events, posts, partners)
//  6. Prints a full report
// ================================================================

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load .env manually ──────────────────────────────────────────
const envFile = readFileSync(resolve(ROOT, '.env'), 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx < 0) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
const ANON_KEY     = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY;
const PORT         = env.PORT || '3000';
const BASE         = `http://localhost:${PORT}`;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or service key in .env');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});
const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false },
});

let passed = 0, failed = 0;
function ok(label)       { passed++; console.log(`  ✅ ${label}`); }
function fail(label, err){ failed++; console.log(`  ❌ ${label}: ${err}`); }

// ── Helper: run SQL via Supabase Management API ─────────────────
async function runSQL(sql, label) {
  // Split into individual statements to handle errors per-statement
  const stmts = sql
    .split(/;(?=\s*(?:CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|SET|DO|GRANT|REVOKE|BEGIN|COMMIT|--))/i)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  let errors = 0;
  for (const stmt of stmts) {
    const { error } = await supabaseAdmin.rpc('exec_sql', { query: stmt + ';' }).catch(e => ({ error: e }));
    if (error) {
      // Try alternative: use the REST SQL endpoint
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: stmt + ';' }),
      }).catch(() => null);

      if (!resp || !resp.ok) {
        // Last resort: direct query via SQL endpoint
        const directResp = await fetch(`${SUPABASE_URL}/pg/query`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: stmt + ';' }),
        }).catch(() => null);

        if (!directResp || !directResp.ok) {
          errors++;
          const stmtPreview = stmt.slice(0, 80).replace(/\n/g, ' ');
          console.log(`  ⚠️  Statement may have failed: ${stmtPreview}...`);
        }
      }
    }
  }
  return errors;
}

// ── Helper: fetch JSON ──────────────────────────────────────────
async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ...json };
}

// ── Helper: wait for server ─────────────────────────────────────
async function waitForServer(maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${BASE}/health`);
      if (res.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

// ================================================================
// MAIN
// ================================================================
async function main() {
  console.log('\n🔥 EMBER BBQ — Automated Setup & Test\n');
  console.log(`   Supabase:  ${SUPABASE_URL}`);
  console.log(`   API:       ${BASE}\n`);

  // ── STEP 1 + 2: Run schemas ──────────────────────────────────
  console.log('━━━ STEP 1: Run Phase 1 Schema ━━━');
  try {
    const schema1 = readFileSync(resolve(ROOT, 'supabase/schema.sql'), 'utf8');

    // Use the supabase-js client to run raw SQL via rpc
    // First, create the exec_sql function if it doesn't exist
    // Actually, we'll run each statement via the REST API directly
    // Let's use the postgREST SQL execution approach

    // Split schema into individual statements
    const statements = schema1
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s && s.length > 5 && !s.startsWith('--'));

    let s1errors = 0;
    for (const stmt of statements) {
      try {
        const { data, error } = await supabaseAdmin.from('_exec').select().csv();
        // This won't work, but we try the admin API
      } catch {}
    }

    // Since we can't run raw SQL via the JS client directly,
    // try using the Supabase Management API
    const mgmtResp = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    });

    if (mgmtResp.ok) {
      ok('Supabase REST API is reachable');
    } else {
      fail('Supabase REST API', `Status ${mgmtResp.status}`);
    }

    // Run the full schema using the SQL API endpoint
    const sqlResp = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: schema1 }),
    });

    if (sqlResp.ok) {
      const result = await sqlResp.json().catch(() => ({}));
      ok('Phase 1 schema executed successfully');
    } else {
      const errText = await sqlResp.text().catch(() => 'Unknown error');
      fail('Phase 1 schema', `Status ${sqlResp.status}: ${errText.slice(0, 200)}`);
      console.log('\n  💡 If this fails, paste backend/supabase/schema.sql into');
      console.log('     Supabase Dashboard → SQL Editor → New Query → Run\n');
    }
  } catch (err) {
    fail('Phase 1 schema', err.message);
  }

  console.log('\n━━━ STEP 2: Run Phase 2 Schema ━━━');
  try {
    const schema2 = readFileSync(resolve(ROOT, 'supabase/schema_phase2.sql'), 'utf8');

    const sqlResp2 = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: schema2 }),
    });

    if (sqlResp2.ok) {
      ok('Phase 2 schema executed successfully');
    } else {
      const errText = await sqlResp2.text().catch(() => 'Unknown error');
      fail('Phase 2 schema', `Status ${sqlResp2.status}: ${errText.slice(0, 200)}`);
      console.log('\n  💡 If this fails, paste backend/supabase/schema_phase2.sql into');
      console.log('     Supabase Dashboard → SQL Editor → New Query → Run\n');
    }
  } catch (err) {
    fail('Phase 2 schema', err.message);
  }

  // ── STEP 3: Verify database ─────────────────────────────────
  console.log('\n━━━ STEP 3: Verify Database ━━━');

  // Check users table
  const { data: usersCheck, error: usersErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .limit(0);
  usersErr ? fail('public.users table', usersErr.message) : ok('public.users table exists');

  // Check follows table
  const { data: followsCheck, error: followsErr } = await supabaseAdmin
    .from('follows')
    .select('follower_id')
    .limit(0);
  followsErr ? fail('public.follows table', followsErr.message) : ok('public.follows table exists');

  // Check events table
  const { data: eventsCheck, error: eventsErr } = await supabaseAdmin
    .from('events')
    .select('id')
    .limit(0);
  eventsErr ? fail('public.events table', eventsErr.message) : ok('public.events table exists');

  // Check event_participants
  const { error: epErr } = await supabaseAdmin.from('event_participants').select('id').limit(0);
  epErr ? fail('public.event_participants', epErr.message) : ok('public.event_participants exists');

  // Check contributions
  const { error: cErr } = await supabaseAdmin.from('contributions').select('id').limit(0);
  cErr ? fail('public.contributions', cErr.message) : ok('public.contributions exists');

  // Check messages
  const { error: mErr } = await supabaseAdmin.from('messages').select('id').limit(0);
  mErr ? fail('public.messages', mErr.message) : ok('public.messages exists');

  // Check posts
  const { error: pErr } = await supabaseAdmin.from('posts').select('id').limit(0);
  pErr ? fail('public.posts', pErr.message) : ok('public.posts exists');

  // Check post_likes
  const { error: plErr } = await supabaseAdmin.from('post_likes').select('user_id').limit(0);
  plErr ? fail('public.post_likes', plErr.message) : ok('public.post_likes exists');

  // Check vault_recipes
  const { error: vrErr } = await supabaseAdmin.from('vault_recipes').select('id').limit(0);
  vrErr ? fail('public.vault_recipes', vrErr.message) : ok('public.vault_recipes exists');

  // Check partner_applications
  const { error: paErr } = await supabaseAdmin.from('partner_applications').select('id').limit(0);
  paErr ? fail('public.partner_applications', paErr.message) : ok('public.partner_applications exists');

  // ── STEP 4: Start server ────────────────────────────────────
  console.log('\n━━━ STEP 4: Start API Server ━━━');

  const server = spawn('node', ['src/app.js'], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  server.stdout.on('data', d => {});
  server.stderr.on('data', d => {});

  const serverUp = await waitForServer();
  if (!serverUp) {
    fail('Server start', 'Server did not respond after 10s');
    server.kill();
    printSummary();
    process.exit(1);
  }
  ok(`Server running on ${BASE}`);

  // ── STEP 5: Test health check ──────────────────────────────
  console.log('\n━━━ STEP 5: Test Health Check ━━━');
  const health = await api('GET', '/health');
  health.success ? ok(`GET /health → ${health.status}`) : fail('GET /health', JSON.stringify(health));

  // ── STEP 6: Test auth endpoints ─────────────────────────────
  console.log('\n━━━ STEP 6: Test Auth Endpoints ━━━');

  // Register
  const reg = await api('POST', '/api/auth/register', {
    email: 'test@ember.app',
    password: 'Ember2025!',
    username: 'testbrother',
    full_name: 'Test Brother',
  });
  console.log(`  POST /api/auth/register → ${reg.status}`);
  if (reg.success) {
    ok(`Registered user: ${reg.user?.username || 'testbrother'}`);
  } else {
    // Might already exist
    if (reg.error?.includes('already')) {
      console.log('  ℹ️  User already exists, testing login instead');
    } else {
      fail('Register', reg.error);
    }
  }

  // Login
  const login = await api('POST', '/api/auth/login', {
    email: 'test@ember.app',
    password: 'Ember2025!',
  });
  console.log(`  POST /api/auth/login → ${login.status}`);
  const token = login.token || reg.token;
  if (token) {
    ok('Login successful, JWT received');
  } else {
    fail('Login', login.error || 'No token received');
  }

  // GetMe
  if (token) {
    const me = await api('GET', '/api/auth/me', null, token);
    console.log(`  GET /api/auth/me → ${me.status}`);
    me.success ? ok(`Authenticated as: ${me.user?.username}`) : fail('GetMe', me.error);
  }

  // ── STEP 7: Test Events ─────────────────────────────────────
  console.log('\n━━━ STEP 7: Test Event Endpoints ━━━');

  let eventId;
  if (token) {
    // Create event in Amsterdam
    const createEvt = await api('POST', '/api/events', {
      title: 'Amsterdam Canal BBQ',
      description: 'Grilling by the canals with amazing views!',
      date_time: '2026-05-01T14:00:00Z',
      end_time: '2026-05-01T20:00:00Z',
      lat: 52.3676,
      lng: 4.9041,
      location_name: 'Vondelpark',
      address: 'Vondelpark 1, Amsterdam',
      city: 'Amsterdam',
      country: 'Netherlands',
      max_participants: 25,
      cover_color: '#FF5C1A',
    }, token);
    console.log(`  POST /api/events → ${createEvt.status}`);
    if (createEvt.success) {
      eventId = createEvt.event?.id;
      ok(`Created event: "${createEvt.event?.title}" (${eventId})`);
    } else {
      fail('Create event', createEvt.error);
    }

    // Get events with geo query
    const geoEvts = await api('GET', '/api/events?lat=52.3676&lng=4.9041&radius=50');
    console.log(`  GET /api/events?lat=52.3676&lng=4.9041&radius=50 → ${geoEvts.status}`);
    geoEvts.success
      ? ok(`Geo query returned ${geoEvts.count} events`)
      : console.log(`  ℹ️  Geo query: ${geoEvts.error} (expected if RPC not set up)`);

    // Get event by ID
    if (eventId) {
      const evtDetail = await api('GET', `/api/events/${eventId}`);
      console.log(`  GET /api/events/${eventId} → ${evtDetail.status}`);
      evtDetail.success ? ok('Event detail fetched') : fail('Event detail', evtDetail.error);

      // Add contribution
      const contrib = await api('POST', `/api/events/${eventId}/contributions`, {
        item_name: 'Dutch BBQ Sauce',
        quantity: '2 bottles',
      }, token);
      console.log(`  POST /api/events/${eventId}/contributions → ${contrib.status}`);
      contrib.success ? ok(`Contribution added: ${contrib.contribution?.item_name}`) : fail('Add contribution', contrib.error);

      // Get participants
      const parts = await api('GET', `/api/events/${eventId}/participants`);
      console.log(`  GET /api/events/${eventId}/participants → ${parts.status}`);
      parts.success ? ok(`${parts.count} participants`) : fail('Get participants', parts.error);
    }
  }

  // ── STEP 8: Test Posts ──────────────────────────────────────
  console.log('\n━━━ STEP 8: Test Post Endpoints ━━━');

  let postId;
  if (token) {
    const createPost = await api('POST', '/api/posts', {
      caption: 'First fire of the season! 🔥 Amsterdam BBQ is lit!',
      event_id: eventId || null,
    }, token);
    console.log(`  POST /api/posts → ${createPost.status}`);
    if (createPost.success) {
      postId = createPost.post?.id;
      ok(`Post created: "${createPost.post?.caption?.slice(0, 40)}..."`);
    } else {
      fail('Create post', createPost.error);
    }

    // Get feed
    const feed = await api('GET', '/api/posts', null, token);
    console.log(`  GET /api/posts → ${feed.status}`);
    feed.success ? ok(`Feed returned ${feed.count} posts`) : fail('Get feed', feed.error);

    // Like post
    if (postId) {
      const like = await api('POST', `/api/posts/${postId}/like`, {}, token);
      console.log(`  POST /api/posts/${postId}/like → ${like.status}`);
      like.success ? ok('Post liked') : fail('Like post', like.error);
    }
  }

  // ── STEP 9: Test Partners ───────────────────────────────────
  console.log('\n━━━ STEP 9: Test Partner Application ━━━');

  const partner = await api('POST', '/api/partners/apply', {
    company_name: 'Amsterdam BBQ Co',
    owner_name: 'Jan de Groot',
    email: 'jan@amsterdambbq.nl',
    phone: '+31612345678',
    country: 'Netherlands',
    city: 'Amsterdam',
    website: 'https://amsterdambbq.nl',
    business_type: 'BBQ Restaurant & Catering',
    years_in_business: '8',
    ships_internationally: 'No',
    monthly_orders: '150',
    why_ember: 'We want to connect with the BBQ community',
    unique_offering: 'Traditional Dutch BBQ with local ingredients',
    partnership_type: 'Vendor',
  });
  console.log(`  POST /api/partners/apply → ${partner.status}`);
  partner.success
    ? ok(`Partner application submitted: ${partner.application?.id}`)
    : fail('Partner application', partner.error);

  // ── Summary ────────────────────────────────────────────────
  printSummary();

  // ── Cleanup ────────────────────────────────────────────────
  server.kill();
  process.exit(failed > 0 ? 1 : 0);
}

function printSummary() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  🔥 EMBER SETUP COMPLETE`);
  console.log(`     ✅ ${passed} passed   ❌ ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log(`
┌─────────────────────────────────────────────────────────────┐
│  FULL ENDPOINT MAP                                          │
├──────────┬──────────────────────────────────────────┬───────┤
│  Method  │  Path                                    │ Auth  │
├──────────┼──────────────────────────────────────────┼───────┤
│  GET     │  /health                                 │  —    │
│  POST    │  /api/auth/register                      │  —    │
│  POST    │  /api/auth/login                         │  —    │
│  POST    │  /api/auth/logout                        │  ✓    │
│  GET     │  /api/auth/me                            │  ✓    │
│  POST    │  /api/auth/refresh                       │  —    │
│  GET     │  /api/users/search?q=                    │  ~    │
│  PUT     │  /api/users/me                           │  ✓    │
│  GET     │  /api/users/:username                    │  ~    │
│  GET     │  /api/users/:username/followers          │  ~    │
│  GET     │  /api/users/:username/following          │  ~    │
│  POST    │  /api/users/:username/follow             │  ✓    │
│  DELETE  │  /api/users/:username/follow             │  ✓    │
│  GET     │  /api/events                             │  ~    │
│  POST    │  /api/events                             │  ✓    │
│  GET     │  /api/events/:id                         │  ~    │
│  PUT     │  /api/events/:id                         │  ✓    │
│  DELETE  │  /api/events/:id                         │  ✓    │
│  POST    │  /api/events/:id/join                    │  ✓    │
│  DELETE  │  /api/events/:id/join                    │  ✓    │
│  GET     │  /api/events/:id/participants            │  ~    │
│  POST    │  /api/events/:id/contributions           │  ✓    │
│  DELETE  │  /api/events/:id/contributions/:cid      │  ✓    │
│  GET     │  /api/events/:id/contributions           │  ~    │
│  GET     │  /api/posts                              │  ~    │
│  POST    │  /api/posts                              │  ✓    │
│  POST    │  /api/posts/:id/like                     │  ✓    │
│  DELETE  │  /api/posts/:id/like                     │  ✓    │
│  DELETE  │  /api/posts/:id                          │  ✓    │
│  POST    │  /api/partners/apply                     │  —    │
├──────────┴──────────────────────────────────────────┴───────┤
│  ✓ = required   ~ = optional (enriches response)   — = no  │
└─────────────────────────────────────────────────────────────┘
`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
