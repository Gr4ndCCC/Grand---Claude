import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Ember platform.
 *
 * The URL and publishable key are safe to ship in the browser — they are
 * designed for public clients, and Row-Level Security on every table is what
 * actually protects user data. Env vars override the defaults so the same
 * build can point at a different project if needed.
 */
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://ppyhzowtahctxoiehzgq.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_8WQ_98FiNPwycjYw-Gi5bA_FQ5H4Xsk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
