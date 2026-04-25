'use strict';
const Stripe = require('stripe');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const PRICES = {
  monthly: process.env.STRIPE_VAULT_MONTHLY_PRICE_ID,
  annual:  process.env.STRIPE_VAULT_ANNUAL_PRICE_ID,
};

const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  : null;

function ensureStripe(res) {
  if (!stripe) {
    res.status(503).json({ success: false, error: 'Stripe is not configured on the server' });
    return false;
  }
  return true;
}

const createCheckoutValidators = [
  body('plan').isIn(['monthly', 'annual']),
  body('success_url').isURL({ require_protocol: true }),
  body('cancel_url').isURL({ require_protocol: true }),
];

async function createCheckout(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
  }
  if (!ensureStripe(res)) return;

  const { plan, success_url, cancel_url } = req.body;
  const priceId = PRICES[plan];
  if (!priceId) {
    return res.status(503).json({ success: false, error: `Stripe price for ${plan} not configured` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: req.user.email,
      client_reference_id: req.user.id,
      metadata: { user_id: req.user.id, plan },
      success_url,
      cancel_url,
      allow_promotion_codes: true,
    });
    return res.json({ success: true, url: session.url, session_id: session.id });
  } catch (err) {
    console.error('[stripe createCheckout]', err.message);
    return res.status(502).json({ success: false, error: 'Failed to create checkout session' });
  }
}

async function getSubscription(req, res) {
  if (!ensureStripe(res)) return;

  try {
    const list = await stripe.subscriptions.search({
      query: `metadata['user_id']:'${req.user.id}'`,
      limit: 1,
    });
    const sub = list.data[0] || null;
    return res.json({
      success: true,
      subscription: sub ? {
        id: sub.id,
        status: sub.status,
        current_period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end,
        plan: sub.metadata?.plan || null,
      } : null,
    });
  } catch (err) {
    console.error('[stripe getSubscription]', err.message);
    return res.status(502).json({ success: false, error: 'Failed to fetch subscription' });
  }
}

async function setVaultMembership(userId, isMember) {
  if (!userId) return;
  const { error } = await supabaseAdmin
    .from('users')
    .update({ vault_member: isMember })
    .eq('id', userId);
  if (error) console.error('[stripe setVaultMembership]', error.message);
}

async function webhook(req, res) {
  if (!stripe || !webhookSecret) {
    return res.status(503).json({ success: false, error: 'Stripe webhook is not configured' });
  }

  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.user_id;
        await setVaultMembership(userId, true);
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const active = ['active', 'trialing'].includes(sub.status);
        await setVaultMembership(sub.metadata?.user_id, active);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await setVaultMembership(sub.metadata?.user_id, false);
        break;
      }
      default:
        break;
    }
    return res.json({ received: true });
  } catch (err) {
    console.error('[stripe webhook] handler failed:', err.message);
    // ack so Stripe doesn't retry indefinitely on internal bugs we'll fix
    return res.json({ received: true, warning: 'handler failed' });
  }
}

module.exports = {
  createCheckoutValidators,
  createCheckout,
  getSubscription,
  webhook,
};
