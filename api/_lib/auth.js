const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://ppyhzowtahctxoiehzgq.supabase.co').replace(/\/$/, '');
// anon key is already public in the browser bundle; safe to hardcode as fallback.
const ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_8WQ_98FiNPwycjYw-Gi5bA_FQ5H4Xsk';

/**
 * Verifies a Supabase Bearer token against /auth/v1/user.
 * Returns the Supabase user object on success, null on failure.
 * Use for endpoints that must only be reachable by signed-in users.
 */
export async function requireAuth(req) {
  const auth = (req.headers['authorization'] || '').trim();
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  if (!token) return null;
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const data = await r.json().catch(() => null);
    return data?.id ? data : null;
  } catch {
    return null;
  }
}
