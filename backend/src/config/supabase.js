'use strict';
const { createClient } = require('@supabase/supabase-js');

// ──────────────────────────────────────────────────────────────────
// Supabase now ships two different key name conventions.
// Old names:  SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
// New names:  SUPABASE_PUBLISHABLE_KEY / SUPABASE_SECRET_KEY
// We support both, old names take priority (backwards-compatible).
// ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;

const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL) {
  console.error('[supabase] ❌  SUPABASE_URL is not set');
}
if (!ANON_KEY) {
  console.error('[supabase] ❌  Neither SUPABASE_ANON_KEY nor SUPABASE_PUBLISHABLE_KEY is set');
}
if (!SERVICE_KEY) {
  console.error('[supabase] ❌  Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_SECRET_KEY is set');
}

/**
 * Public client — uses the anon key.
 * Subject to Row Level Security policies.
 * Use this for all user-context operations.
 */
const supabase = createClient(SUPABASE_URL || 'http://localhost', ANON_KEY || 'anon', {
  auth: { persistSession: false },
});

/**
 * Admin client — uses the service role key.
 * Bypasses RLS. Use only in server-side code that needs elevated access
 * (e.g. creating user profiles after auth.signUp).
 * NEVER expose this key to the client.
 */
const supabaseAdmin = createClient(SUPABASE_URL || 'http://localhost', SERVICE_KEY || 'service', {
  auth: { persistSession: false },
});

/**
 * Build an authenticated Supabase client for a specific user JWT.
 * Used in controllers to make queries that run under the user's identity.
 */
function getAuthenticatedClient(jwt) {
  return createClient(SUPABASE_URL || 'http://localhost', ANON_KEY || 'anon', {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}

module.exports = { supabase, supabaseAdmin, getAuthenticatedClient };
