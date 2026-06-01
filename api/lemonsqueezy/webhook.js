/**
 * Lemon Squeezy webhook — the SINGLE source of truth for Vault membership.
 *
 * Lemon Squeezy (Merchant of Record) calls this after every billing event. We
 * verify the HMAC signature, then unlock/lock `profiles.sub_active` server-side
 * using the Supabase service-role key. Membership is therefore NEVER granted by
 * the browser — a user cannot fake a payment.
 *
 * Set in app.lemonsqueezy.com → Settings → Webhooks:
 *   URL: https://emberworld.co/api/lemonsqueezy/webhook
 *   Events: order_created, subscription_created, subscription_updated,
 *           subscription_cancelled, subscription_expired, subscription_resumed,
 *           subscription_payment_success, subscription_payment_failed
 *   Signing secret → LEMONSQUEEZY_WEBHOOK_SECRET (Vercel env).
 */
import crypto from 'node:crypto';
import {
  EMAIL_CATEGORIES,
  paymentConfirmationEmail,
  sendEmail,
  subscriptionUpdatedEmail,
  vaultWelcomeEmail,
} from '../_lib/email.js';

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

function timingSafeEqual(a, b) {
  const left = Buffer.from(a || '', 'hex');
  const right = Buffer.from(b || '', 'hex');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/**
 * Flip Vault membership for a Supabase user. Uses the service-role key, which
 * bypasses RLS *and* the protect_profile_columns trigger (server is trusted),
 * so this is the only place sub_active can change.
 */
async function setVault(userId, isActive, plan) {
  if (!userId) {
    console.warn('[lemonsqueezy webhook] no user_id in custom_data — cannot update membership');
    return;
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[lemonsqueezy webhook] SUPABASE_SERVICE_ROLE_KEY missing — cannot update membership');
    return;
  }
  const patch = isActive
    ? { sub_active: true, sub_plan: plan || null, sub_since: new Date().toISOString() }
    : { sub_active: false };

  const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });
  if (!r.ok) {
    console.error('[lemonsqueezy webhook] profile update failed', r.status, await r.text().catch(() => ''));
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(503).json({ success: false, error: 'Webhook secret is not configured' });
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-signature'];
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  if (!timingSafeEqual(digest, signature)) {
    return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid JSON body' });
  }

  const eventName = event.meta?.event_name || req.headers['x-event-name'];
  const custom = event.meta?.custom_data || {};
  const userId = custom.user_id || null;
  const email = custom.email || event.data?.attributes?.user_email || event.data?.attributes?.email;
  const name = custom.name || event.data?.attributes?.user_name || email;
  const plan = custom.plan;
  const status = event.data?.attributes?.status;
  const amount = event.data?.attributes?.total_formatted || event.data?.attributes?.subtotal_formatted;

  try {
    switch (eventName) {
      // First purchase / one-off order paid → unlock immediately + receipt email.
      case 'order_created': {
        await setVault(userId, true, plan);
        if (email) {
          const message = paymentConfirmationEmail({ name, plan, amount, orderId: event.data?.id });
          await sendEmail({
            to: email, subject: message.subject, html: message.html,
            tags: [{ name: 'category', value: EMAIL_CATEGORIES.BILLING }],
          }).catch(() => {});
        }
        break;
      }

      // Subscription started → unlock + welcome email.
      case 'subscription_created':
      case 'subscription_resumed':
      case 'subscription_payment_success': {
        await setVault(userId, true, plan);
        if (eventName === 'subscription_created' && email) {
          const message = vaultWelcomeEmail({ name, plan });
          await sendEmail({
            to: email, subject: message.subject, html: message.html,
            tags: [{ name: 'category', value: EMAIL_CATEGORIES.VAULT }],
          }).catch(() => {});
        }
        break;
      }

      // Status change → unlock while active/on_trial, lock once it's truly over.
      case 'subscription_updated': {
        if (status === 'active' || status === 'on_trial') await setVault(userId, true, plan);
        else if (status === 'expired' || status === 'unpaid') await setVault(userId, false);
        if (email) {
          const message = subscriptionUpdatedEmail({ name, status: status || 'updated' });
          await sendEmail({
            to: email, subject: message.subject, html: message.html,
            tags: [{ name: 'category', value: EMAIL_CATEGORIES.BILLING }],
          }).catch(() => {});
        }
        break;
      }

      // Subscription ended for good → lock the Vault.
      // NOTE: 'cancelled' means "won't renew" but access continues until the paid
      // period ends; 'expired' is when access actually stops. We lock on expiry.
      case 'subscription_expired': {
        await setVault(userId, false);
        if (email) {
          const message = subscriptionUpdatedEmail({ name, status: 'expired' });
          await sendEmail({
            to: email, subject: message.subject, html: message.html,
            tags: [{ name: 'category', value: EMAIL_CATEGORIES.BILLING }],
          }).catch(() => {});
        }
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_payment_failed': {
        // Keep access until period end; just notify. 'expired' will lock later.
        if (email) {
          const message = subscriptionUpdatedEmail({ name, status: status || eventName.replace('subscription_', '') });
          await sendEmail({
            to: email, subject: message.subject, html: message.html,
            tags: [{ name: 'category', value: EMAIL_CATEGORIES.BILLING }],
          }).catch(() => {});
        }
        break;
      }

      default:
        break;
    }

    if (eventName) {
      console.log('[lemonsqueezy webhook]', { eventName, userId, plan, status, objectId: event.data?.id });
    }
    return res.json({ received: true });
  } catch (error) {
    // Ack so Lemon Squeezy doesn't retry forever on a transient bug; log it.
    console.error('[lemonsqueezy webhook] handler error', error.message);
    return res.json({ received: true, warning: 'handler error' });
  }
}
