/**
 * Stripe subscription endpoint — no SDK, direct REST via fetch (keeps the
 * serverless bundle tiny and avoids adding an npm dependency).
 *
 *   POST /api/stripe/subscription
 *        body: { plan: 'monthly'|'annual', email, name, userId }
 *        -> { success, subscriptionId, clientSecret }   (incomplete subscription;
 *           the card is confirmed inline on the page with the clientSecret)
 *
 *   GET  /api/stripe/subscription?subscription_id=sub_xxx
 *        -> { success, active, status }   and, when active, unlocks the Vault
 *           in Supabase (server-verified, so it works even before webhooks fire)
 *
 * NO free trial is ever created here.
 */

const STRIPE_API = 'https://api.stripe.com/v1';

const PRICES = {
  monthly: process.env.STRIPE_VAULT_MONTHLY_PRICE_ID,
  annual: process.env.STRIPE_VAULT_ANNUAL_PRICE_ID,
};

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://ppyhzowtahctxoiehzgq.supabase.co').replace(/\/$/, '');

/* ── tiny form encoder matching Stripe's bracket syntax (a[b][c]=v, arr[0]=v) ── */
function encodeForm(obj, prefix, out) {
  out = out || new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') encodeForm(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

async function stripePost(path, body) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encodeForm(body).toString(),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || 'Stripe request failed');
    err.details = data?.error;
    throw err;
  }
  return data;
}

async function stripeGet(path) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || 'Stripe request failed');
    err.details = data?.error;
    throw err;
  }
  return data;
}

async function findOrCreateCustomer(email, name, userId) {
  const found = await stripeGet(`/customers?email=${encodeURIComponent(email)}&limit=1`);
  if (found.data && found.data.length) return found.data[0].id;
  const created = await stripePost('/customers', {
    email,
    name,
    metadata: { user_id: userId, source: 'emberworld.co' },
  });
  return created.id;
}

async function unlockVault(userId, plan) {
  if (!userId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      sub_active: true,
      sub_plan: plan || null,
      sub_since: new Date().toISOString(),
    }),
  });
}

function requireConfig() {
  const missing = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!PRICES.monthly) missing.push('STRIPE_VAULT_MONTHLY_PRICE_ID');
  if (!PRICES.annual) missing.push('STRIPE_VAULT_ANNUAL_PRICE_ID');
  return missing;
}

async function createSubscription(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const plan = body.plan;
  const priceId = PRICES[plan];
  if (!priceId) return res.status(400).json({ success: false, error: 'Plan must be monthly or annual' });

  const email = String(body.email || '').trim();
  const name = String(body.name || '').trim();
  const userId = String(body.userId || '').trim();
  if (!email || !userId) return res.status(400).json({ success: false, error: 'email and userId are required' });

  try {
    const customer = await findOrCreateCustomer(email, name, userId);
    const sub = await stripePost('/subscriptions', {
      customer,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { user_id: userId, plan },
      // No trial_period_days — first payment is taken immediately.
    });
    const clientSecret = sub?.latest_invoice?.payment_intent?.client_secret;
    if (!clientSecret) {
      return res.status(502).json({ success: false, error: 'Stripe did not return a payment secret' });
    }
    return res.json({ success: true, subscriptionId: sub.id, clientSecret });
  } catch (error) {
    return res.status(502).json({ success: false, error: error.message, details: error.details || null });
  }
}

async function syncStatus(req, res) {
  const subId = req.query?.subscription_id || new URL(req.url, 'http://x').searchParams.get('subscription_id');
  if (!subId) return res.status(400).json({ success: false, error: 'subscription_id required' });

  try {
    const sub = await stripeGet(`/subscriptions/${encodeURIComponent(subId)}`);
    const active = sub.status === 'active' || sub.status === 'trialing';
    if (active) await unlockVault(sub.metadata?.user_id, sub.metadata?.plan);
    return res.json({ success: true, active, status: sub.status });
  } catch (error) {
    return res.status(502).json({ success: false, error: error.message });
  }
}

export default async function handler(req, res) {
  const missing = requireConfig();
  if (missing.length) {
    return res.status(503).json({ success: false, error: 'Stripe is not configured', missing });
  }
  if (req.method === 'POST') return createSubscription(req, res);
  if (req.method === 'GET') return syncStatus(req, res);
  res.setHeader('Allow', 'POST, GET');
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
