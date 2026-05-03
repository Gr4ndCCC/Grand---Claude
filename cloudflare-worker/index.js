/**
 * Ember · Lemon Squeezy webhook → Resend email
 *
 * Deploy to Cloudflare Workers, then paste the worker URL into
 * Lemon Squeezy → Settings → Webhooks → URL.
 *
 * Environment variables to set in Cloudflare Workers dashboard:
 *   RESEND_API_KEY          – your Resend API key
 *   LS_WEBHOOK_SECRET       – from Lemon Squeezy → Settings → Webhooks
 *   STORE_EMAIL             – emberworldwide@gmail.com (recipient for your notifications)
 *   FROM_EMAIL              – sender address verified in Resend, e.g. hello@emberworld.co
 */

const EVENTS_TO_HANDLE = new Set([
  'subscription_created',
  'order_created',
]);

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return cors();
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const rawBody = await request.text();

    // Verify Lemon Squeezy signature
    if (env.LS_WEBHOOK_SECRET) {
      const sig = request.headers.get('x-signature');
      const valid = await verifySignature(rawBody, sig, env.LS_WEBHOOK_SECRET);
      if (!valid) return new Response('Unauthorized', { status: 401 });
    }

    let payload;
    try { payload = JSON.parse(rawBody); } catch { return new Response('Bad JSON', { status: 400 }); }

    const eventName = payload?.meta?.event_name;
    if (!EVENTS_TO_HANDLE.has(eventName)) return new Response('Ignored', { status: 200 });

    const data = payload?.data?.attributes ?? {};
    const customerName  = data.user_name  ?? data.customer_name  ?? 'Brother';
    const customerEmail = data.user_email ?? data.customer_email ?? '';
    const planName      = getPlanName(payload);
    const total         = formatTotal(data);

    await Promise.all([
      // 1. Send confirmation to the customer
      customerEmail && sendEmail(env, {
        from:    env.FROM_EMAIL ?? `Ember <hello@emberworld.co>`,
        to:      customerEmail,
        subject: `Welcome to the Vault, ${customerName.split(' ')[0]}.`,
        html:    customerEmailHtml(customerName, planName, total),
      }),
      // 2. Notify the store owner
      env.STORE_EMAIL && sendEmail(env, {
        from:    env.FROM_EMAIL ?? `Ember <hello@emberworld.co>`,
        to:      env.STORE_EMAIL,
        subject: `New Vault member: ${customerName} (${planName})`,
        html:    ownerEmailHtml(customerName, customerEmail, planName, total),
      }),
    ]);

    return new Response('OK', { status: 200 });
  },
};

/* ── helpers ────────────────────────────────────────────────── */

async function verifySignature(body, signature, secret) {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === signature;
}

async function sendEmail(env, { from, to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error', res.status, err);
  }
}

function getPlanName(payload) {
  const variantName = payload?.data?.attributes?.variant_name
    ?? payload?.data?.relationships?.variant?.data?.id
    ?? '';
  if (/annual|year/i.test(variantName)) return 'Vault Annual (€99/year)';
  if (/month/i.test(variantName)) return 'Vault Monthly (€15/month)';
  return 'Vault Membership';
}

function formatTotal(attrs) {
  const cents = attrs.total ?? attrs.subtotal ?? 0;
  return `€${(cents / 100).toFixed(2)}`;
}

function cors() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

/* ── email templates ────────────────────────────────────────── */

function customerEmailHtml(name, plan, total) {
  const first = name.split(' ')[0];
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to the Vault</title></head>
<body style="margin:0;padding:0;background:#090504;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#090504;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="padding:0 0 32px;text-align:center;">
    <span style="font-family:Georgia,serif;font-size:28px;color:#E4CFAB;letter-spacing:-0.5px;">Ember</span>
  </td></tr>
  <tr><td style="background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:48px 40px;">
    <p style="color:#800000;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;margin:0 0 8px;">Vault Membership</p>
    <h1 style="color:#fff;font-family:Georgia,serif;font-size:36px;font-weight:400;line-height:1.1;margin:0 0 24px;">
      Welcome, ${first}.<br>
      <span style="color:#E4CFAB;font-style:italic;">The Vault is yours.</span>
    </h1>
    <p style="color:#A0A0A0;font-size:16px;line-height:1.7;margin:0 0 32px;">
      Your membership is confirmed. You now have full access to exclusive recipes,
      live masterclasses, the Brotherhood Network, partner discounts,
      Council voting rights, and Annual Summit access.
    </p>
    <table cellpadding="0" cellspacing="0" style="background:rgba(128,0,0,0.10);border:1px solid rgba(128,0,0,0.25);border-radius:10px;padding:20px;width:100%;margin-bottom:32px;">
      <tr>
        <td style="color:#A0A0A0;font-size:13px;">Plan</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${plan}</td>
      </tr>
      <tr><td colspan="2" style="padding:4px 0;"></td></tr>
      <tr>
        <td style="color:#A0A0A0;font-size:13px;">Amount charged</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${total}</td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;">
      <tr><td align="center">
        <a href="https://emberworld.co/#/account"
          style="display:inline-block;background:#800000;color:#fff;text-decoration:none;border-radius:10px;padding:16px 40px;font-family:Georgia,serif;font-size:15px;font-weight:700;">
          Enter the Vault →
        </a>
      </td></tr>
    </table>
    <p style="color:#5A5A5A;font-size:13px;line-height:1.6;margin:0;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
      You can manage your subscription at any time through your account.
      Questions? Reply to this email or reach us at emberworldwide@gmail.com.
    </p>
  </td></tr>
  <tr><td style="padding:24px 0;text-align:center;">
    <p style="color:#333;font-size:11px;font-family:'Courier New',monospace;margin:0;">
      © ${new Date().getFullYear()} Ember · The world grills.
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function ownerEmailHtml(name, email, plan, total) {
  return `<!DOCTYPE html><html><body style="background:#0a0a0a;padding:40px;font-family:Georgia,serif;color:#fff;">
<h2 style="color:#E4CFAB;">New Vault Member</h2>
<table style="border-collapse:collapse;width:100%;max-width:480px;">
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Name</td><td style="color:#fff;font-size:14px;">${name}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Email</td><td style="color:#fff;font-size:14px;">${email}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Plan</td><td style="color:#fff;font-size:14px;">${plan}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Charged</td><td style="color:#fff;font-size:14px;">${total}</td></tr>
</table>
</body></html>`;
}
