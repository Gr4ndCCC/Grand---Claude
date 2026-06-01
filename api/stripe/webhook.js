/**
 * Stripe webhook — keeps Vault membership in sync with the subscription
 * lifecycle (activation, renewal, cancellation). Source of truth for billing.
 *
 * Set this URL in Stripe → Developers → Webhooks:
 *   https://emberworld.co/api/stripe/webhook
 * Listen for: customer.subscription.created / updated / deleted, invoice.paid
 * Then copy the signing secret into STRIPE_WEBHOOK_SECRET.
 */
import crypto from 'node:crypto';
import { EMAIL_CATEGORIES, sendEmail, vaultWelcomeEmail } from '../_lib/email.js';

const STRIPE_API = 'https://api.stripe.com/v1';
const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://ppyhzowtahctxoiehzgq.supabase.co').replace(/\/$/, '');

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** Verify the `stripe-signature` header (t=…,v1=…) without the Stripe SDK. */
function verifyStripeSignature(rawBody, header, secret) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map(p => p.split('=').map(s => s.trim())),
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody.toString('utf8')}`)
    .digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function setVault(userId, isActive, plan) {
  if (!userId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const patch = isActive
    ? { sub_active: true, sub_plan: plan || null, sub_since: new Date().toISOString() }
    : { sub_active: false };
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });
}

async function getSubscription(id) {
  const res = await fetch(`${STRIPE_API}/subscriptions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  return res.ok ? res.json() : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ success: false, error: 'Webhook secret is not configured' });

  const rawBody = await readRawBody(req);
  if (!verifyStripeSignature(rawBody, req.headers['stripe-signature'], secret)) {
    return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid JSON body' });
  }

  try {
    const obj = event.data?.object || {};
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const active = obj.status === 'active' || obj.status === 'trialing';
        await setVault(obj.metadata?.user_id, active, obj.metadata?.plan);
        break;
      }
      case 'customer.subscription.deleted': {
        await setVault(obj.metadata?.user_id, false);
        break;
      }
      case 'invoice.paid': {
        // Renewal (or first payment) — make sure the Vault is unlocked.
        const subId = obj.subscription;
        if (subId) {
          const sub = await getSubscription(subId);
          const meta = sub?.metadata || {};
          if (meta.user_id) {
            await setVault(meta.user_id, true, meta.plan);
            const email = obj.customer_email || sub?.customer_email;
            if (email && event.data?.previous_attributes === undefined) {
              const welcome = vaultWelcomeEmail({ name: obj.customer_name || email, plan: meta.plan });
              await sendEmail({
                to: email,
                subject: welcome.subject,
                html: welcome.html,
                tags: [{ name: 'category', value: EMAIL_CATEGORIES?.BILLING || 'billing' }],
              }).catch(() => {});
            }
          }
        }
        break;
      }
      default:
        break;
    }
    return res.json({ received: true });
  } catch (error) {
    // Ack so Stripe doesn't retry forever on a bug we'll fix; log for debugging.
    console.error('[stripe webhook]', error.message);
    return res.json({ received: true, warning: 'handler error' });
  }
}
