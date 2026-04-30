import crypto from 'node:crypto';

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

  if ([
    'order_created',
    'subscription_created',
    'subscription_updated',
    'subscription_cancelled',
    'subscription_expired',
    'subscription_resumed',
  ].includes(eventName)) {
    console.log('[lemonsqueezy webhook]', {
      eventName,
      email: custom.email || event.data?.attributes?.user_email,
      plan: custom.plan,
      objectId: event.data?.id,
      status: event.data?.attributes?.status,
    });
  }

  return res.json({ received: true });
}
