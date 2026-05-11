import crypto from 'node:crypto';
import {
  EMAIL_CATEGORIES,
  sendEmail,
  subscriptionUpdatedEmail,
  vaultWelcomeEmail,
} from '../_lib/email.js';

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
  const email = custom.email || event.data?.attributes?.user_email || event.data?.attributes?.email;
  const name = custom.name || event.data?.attributes?.user_name || email;
  const plan = custom.plan;

  if (eventName === 'order_created' || eventName === 'subscription_created') {
    if (email) {
      const message = vaultWelcomeEmail({ name, plan });
      await sendEmail({
        to: email,
        subject: message.subject,
        html: message.html,
        tags: [{ name: 'category', value: EMAIL_CATEGORIES.VAULT }],
      });
    }
  } else if ([
    'subscription_updated',
    'subscription_cancelled',
    'subscription_expired',
    'subscription_resumed',
  ].includes(eventName) && email) {
    const status = event.data?.attributes?.status || eventName.replace('subscription_', '');
    const message = subscriptionUpdatedEmail({ name, status });
    await sendEmail({
      to: email,
      subject: message.subject,
      html: message.html,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.BILLING }],
    });
  }

  if (eventName) {
    console.log('[lemonsqueezy webhook]', {
      eventName,
      email,
      plan,
      objectId: event.data?.id,
      status: event.data?.attributes?.status,
    });
  }

  return res.json({ received: true });
}
