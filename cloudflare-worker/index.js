/**
 * Ember Email Worker
 *
 * Routes:
 *   POST /          → Lemon Squeezy webhook (subscription_created, order_created)
 *   POST /email/welcome       → Welcome email on account creation
 *   POST /email/event-rsvp    → RSVP confirmation email
 *   POST /email/event-host    → Host confirmation email
 *   POST /email/newsletter    → Newsletter subscription confirmation
 *
 * Environment variables (Cloudflare Workers dashboard):
 *   RESEND_API_KEY     – Resend API key
 *   LS_WEBHOOK_SECRET  – Lemon Squeezy webhook secret
 *   STORE_EMAIL        – emberworldwide@gmail.com
 *   FROM_EMAIL         – hello@emberworld.co
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://emberworld.co',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Lemon Squeezy webhook
    if (path === '/' || path === '/webhook') {
      return handleLSWebhook(request, env);
    }

    // Email API endpoints (called from the frontend)
    if (path === '/email/welcome')    return handleWelcome(request, env);
    if (path === '/email/event-rsvp') return handleEventRsvp(request, env);
    if (path === '/email/event-host') return handleEventHost(request, env);
    if (path === '/email/newsletter') return handleNewsletter(request, env);

    return new Response('Not Found', { status: 404 });
  },
};

/* ── Lemon Squeezy webhook ─────────────────────────────────── */

const LS_EVENTS = new Set(['subscription_created', 'order_created']);

async function handleLSWebhook(request, env) {
  const rawBody = await request.text();

  if (env.LS_WEBHOOK_SECRET) {
    const sig = request.headers.get('x-signature');
    const valid = await verifySignature(rawBody, sig, env.LS_WEBHOOK_SECRET);
    if (!valid) return new Response('Unauthorized', { status: 401 });
  }

  let payload;
  try { payload = JSON.parse(rawBody); } catch { return new Response('Bad JSON', { status: 400 }); }

  const eventName = payload?.meta?.event_name;
  if (!LS_EVENTS.has(eventName)) return new Response('Ignored', { status: 200 });

  const data = payload?.data?.attributes ?? {};
  const customerName  = data.user_name  ?? data.customer_name  ?? 'Brother';
  const customerEmail = data.user_email ?? data.customer_email ?? '';
  const planName      = getPlanName(payload);
  const total         = formatTotal(data);

  await Promise.all([
    customerEmail && sendEmail(env, {
      from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
      to:      customerEmail,
      subject: `Welcome to the Vault, ${customerName.split(' ')[0]}.`,
      html:    vaultCustomerEmailHtml(customerName, planName, total),
    }),
    env.STORE_EMAIL && sendEmail(env, {
      from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
      to:      env.STORE_EMAIL,
      subject: `New Vault member: ${customerName} (${planName})`,
      html:    ownerEmailHtml(customerName, customerEmail, planName, total),
    }),
  ]);

  return new Response('OK', { status: 200 });
}

/* ── Email endpoints ───────────────────────────────────────── */

async function handleWelcome(request, env) {
  const body = await parseBody(request);
  if (!body) return jsonResponse({ error: 'Bad JSON' }, 400);

  const { name, email } = body;
  if (!isValidEmail(email)) return jsonResponse({ error: 'Invalid email' }, 400);

  await sendEmail(env, {
    from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
    to:      email,
    subject: `Welcome to Ember, ${firstName(name)}.`,
    html:    welcomeEmailHtml(name || email),
  });

  return jsonResponse({ ok: true });
}

async function handleEventRsvp(request, env) {
  const body = await parseBody(request);
  if (!body) return jsonResponse({ error: 'Bad JSON' }, 400);

  const { name, email, eventTitle, eventDate, eventTime, eventLocation, eventId } = body;
  if (!isValidEmail(email)) return jsonResponse({ error: 'Invalid email' }, 400);

  await sendEmail(env, {
    from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
    to:      email,
    subject: `You're going to "${eventTitle}"`,
    html:    eventRsvpEmailHtml(name || email, eventTitle, eventDate, eventTime, eventLocation, eventId),
  });

  return jsonResponse({ ok: true });
}

async function handleEventHost(request, env) {
  const body = await parseBody(request);
  if (!body) return jsonResponse({ error: 'Bad JSON' }, 400);

  const { name, email, eventTitle, eventDate, eventTime, eventLocation, eventId, maxGuests } = body;
  if (!isValidEmail(email)) return jsonResponse({ error: 'Invalid email' }, 400);

  await Promise.all([
    sendEmail(env, {
      from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
      to:      email,
      subject: `Your fire is live — "${eventTitle}"`,
      html:    eventHostEmailHtml(name || email, eventTitle, eventDate, eventTime, eventLocation, eventId, maxGuests),
    }),
    env.STORE_EMAIL && sendEmail(env, {
      from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
      to:      env.STORE_EMAIL,
      subject: `New event created: ${eventTitle} by ${name}`,
      html:    ownerEventHtml(name, email, eventTitle, eventDate, eventLocation),
    }),
  ]);

  return jsonResponse({ ok: true });
}

async function handleNewsletter(request, env) {
  const body = await parseBody(request);
  if (!body) return jsonResponse({ error: 'Bad JSON' }, 400);

  const { email, name } = body;
  if (!isValidEmail(email)) return jsonResponse({ error: 'Invalid email' }, 400);

  await Promise.all([
    sendEmail(env, {
      from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
      to:      email,
      subject: "You're in the Ember fire circle.",
      html:    newsletterWelcomeHtml(name || email),
    }),
    env.STORE_EMAIL && sendEmail(env, {
      from:    env.FROM_EMAIL ?? 'Ember <hello@emberworld.co>',
      to:      env.STORE_EMAIL,
      subject: `Newsletter signup: ${email}`,
      html:    `<p style="font-family:Georgia,serif;color:#fff;background:#0a0a0a;padding:24px;">New newsletter subscriber: <strong style="color:#E4CFAB">${email}</strong></p>`,
    }),
  ]);

  return jsonResponse({ ok: true });
}

/* ── Helpers ───────────────────────────────────────────────── */

async function parseBody(request) {
  try { return await request.json(); } catch { return null; }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function firstName(name) {
  return (name || '').split(' ')[0] || 'Brother';
}

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

/* ── Email templates ───────────────────────────────────────── */

const BASE_STYLES = `
  body { margin:0;padding:0;background:#090504;font-family:Georgia,serif; }
  table { border-collapse:collapse; }
`;

function wrapper(content) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${BASE_STYLES}</style></head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#090504;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="padding:0 0 28px;text-align:center;">
    <span style="font-family:Georgia,serif;font-size:28px;color:#E4CFAB;letter-spacing:-0.5px;">Ember</span>
  </td></tr>
  <tr><td style="background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:48px 40px;">
    ${content}
  </td></tr>
  <tr><td style="padding:24px 0;text-align:center;">
    <p style="color:#333;font-size:11px;font-family:'Courier New',monospace;margin:0;">
      © ${new Date().getFullYear()} Ember · The world grills. ·
      <a href="https://emberworld.co" style="color:#555;text-decoration:none;">emberworld.co</a>
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function cta(href, label) {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;">
  <tr><td align="center">
    <a href="${href}" style="display:inline-block;background:#800000;color:#fff;text-decoration:none;border-radius:10px;padding:16px 40px;font-family:Georgia,serif;font-size:15px;font-weight:700;">${label}</a>
  </td></tr>
</table>`;
}

function footer_note(msg) {
  return `<p style="color:#5A5A5A;font-size:13px;line-height:1.6;margin:0;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">${msg}</p>`;
}

/* Welcome email */
function welcomeEmailHtml(name) {
  const first = firstName(name);
  return wrapper(`
    <p style="color:#800000;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;margin:0 0 8px;">Brotherhood</p>
    <h1 style="color:#fff;font-family:Georgia,serif;font-size:36px;font-weight:400;line-height:1.1;margin:0 0 24px;">
      Welcome, ${first}.<br>
      <span style="color:#E4CFAB;font-style:italic;">The fire is lit.</span>
    </h1>
    <p style="color:#A0A0A0;font-size:16px;line-height:1.7;margin:0 0 28px;">
      You're now part of the global BBQ brotherhood. Pitmasters in 40+ countries. Real fires. Real people.
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;">
      <tr>
        <td style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid #800000;">
          <p style="color:#E4CFAB;font-size:13px;font-weight:700;margin:0 0 2px;">Find your fire</p>
          <p style="color:#A0A0A0;font-size:13px;margin:0;">Browse BBQ events happening near you or anywhere on the map.</p>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid #800000;">
          <p style="color:#E4CFAB;font-size:13px;font-weight:700;margin:0 0 2px;">Host a gathering</p>
          <p style="color:#A0A0A0;font-size:13px;margin:0;">Set a date, pick a theme, publish your event. Your crew finds you.</p>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid #800000;">
          <p style="color:#E4CFAB;font-size:13px;font-weight:700;margin:0 0 2px;">Join the Vault</p>
          <p style="color:#A0A0A0;font-size:13px;margin:0;">Exclusive recipes, live masterclasses, and the inner circle. From €15/mo.</p>
        </td>
      </tr>
    </table>
    ${cta('https://emberworld.co/events', 'Find an event near you →')}
    ${footer_note('Questions? Reply to this email or reach us at <a href="mailto:emberworldwide@gmail.com" style="color:var(--beige,#E4CFAB);text-decoration:none;">emberworldwide@gmail.com</a>')}
  `);
}

/* Event RSVP email */
function eventRsvpEmailHtml(name, eventTitle, eventDate, eventTime, eventLocation, eventId) {
  const first = firstName(name);
  const eventUrl = `https://emberworld.co/events/${eventId}`;
  return wrapper(`
    <p style="color:#800000;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;margin:0 0 8px;">Event RSVP</p>
    <h1 style="color:#fff;font-family:Georgia,serif;font-size:34px;font-weight:400;line-height:1.1;margin:0 0 24px;">
      You're going, ${first}.<br>
      <span style="color:#E4CFAB;font-style:italic;">The pit awaits.</span>
    </h1>
    <p style="color:#A0A0A0;font-size:16px;line-height:1.7;margin:0 0 28px;">
      You're confirmed for <strong style="color:#fff;">${eventTitle}</strong>. Here are your details:
    </p>
    <table cellpadding="0" cellspacing="0" style="background:rgba(128,0,0,0.10);border:1px solid rgba(128,0,0,0.25);border-radius:10px;padding:20px;width:100%;margin-bottom:32px;">
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Event</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${eventTitle}</td>
      </tr>
      <tr><td colspan="2" style="padding:4px 0;border-top:1px solid rgba(255,255,255,0.05);"></td></tr>
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Date &amp; Time</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${eventDate}${eventTime ? ' · ' + eventTime : ''}</td>
      </tr>
      <tr><td colspan="2" style="padding:4px 0;border-top:1px solid rgba(255,255,255,0.05);"></td></tr>
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Location</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${eventLocation}</td>
      </tr>
    </table>
    <p style="color:#A0A0A0;font-size:14px;line-height:1.7;margin:0 0 28px;">
      Don't forget to add what you're bringing. Check the event page to see what's already covered so nothing doubles up.
    </p>
    ${cta(eventUrl, 'View event & add contribution →')}
    ${footer_note("Can't make it? Head to the event page and remove yourself from the attendee list. Questions? Reply to this email.")}
  `);
}

/* Event host email */
function eventHostEmailHtml(name, eventTitle, eventDate, eventTime, eventLocation, eventId, maxGuests) {
  const first = firstName(name);
  const eventUrl = `https://emberworld.co/events/${eventId}`;
  return wrapper(`
    <p style="color:#800000;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;margin:0 0 8px;">Your event is live</p>
    <h1 style="color:#fff;font-family:Georgia,serif;font-size:34px;font-weight:400;line-height:1.1;margin:0 0 24px;">
      Your fire is lit, ${first}.<br>
      <span style="color:#E4CFAB;font-style:italic;">The brotherhood is watching.</span>
    </h1>
    <p style="color:#A0A0A0;font-size:16px;line-height:1.7;margin:0 0 28px;">
      <strong style="color:#fff;">${eventTitle}</strong> is now live on Ember. Share the link and your crew will find it.
    </p>
    <table cellpadding="0" cellspacing="0" style="background:rgba(128,0,0,0.10);border:1px solid rgba(128,0,0,0.25);border-radius:10px;padding:20px;width:100%;margin-bottom:32px;">
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Event</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${eventTitle}</td>
      </tr>
      <tr><td colspan="2" style="padding:4px 0;border-top:1px solid rgba(255,255,255,0.05);"></td></tr>
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Date &amp; Time</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${eventDate}${eventTime ? ' · ' + eventTime : ''}</td>
      </tr>
      <tr><td colspan="2" style="padding:4px 0;border-top:1px solid rgba(255,255,255,0.05);"></td></tr>
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Location</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${eventLocation}</td>
      </tr>
      <tr><td colspan="2" style="padding:4px 0;border-top:1px solid rgba(255,255,255,0.05);"></td></tr>
      <tr>
        <td style="color:#A0A0A0;font-size:13px;padding:4px 0;">Max guests</td>
        <td style="color:#fff;font-size:13px;text-align:right;">${maxGuests}</td>
      </tr>
    </table>
    <p style="color:#A0A0A0;font-size:14px;line-height:1.7;margin:0 0 28px;">
      Attendees will be notified as they RSVP. Keep an eye on the event chat — your guests may have questions.
    </p>
    ${cta(eventUrl, 'Manage your event →')}
    ${footer_note('Light the coals 30–45 min early. Questions? Reply to this email.')}
  `);
}

/* Newsletter welcome email */
function newsletterWelcomeHtml(name) {
  const first = firstName(name);
  return wrapper(`
    <p style="color:#800000;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;margin:0 0 8px;">Ember Newsletter</p>
    <h1 style="color:#fff;font-family:Georgia,serif;font-size:36px;font-weight:400;line-height:1.1;margin:0 0 24px;">
      You're in, ${first}.<br>
      <span style="color:#E4CFAB;font-style:italic;">Stay close to the fire.</span>
    </h1>
    <p style="color:#A0A0A0;font-size:16px;line-height:1.7;margin:0 0 28px;">
      The Ember fire circle is where the real stories live. Expect:
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;">
      <tr>
        <td style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid #800000;">
          <p style="color:#E4CFAB;font-size:13px;font-weight:700;margin:0 0 2px;">BBQ stories from the brotherhood</p>
          <p style="color:#A0A0A0;font-size:13px;margin:0;">Dispatches from pitmasters across 40+ countries.</p>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid #800000;">
          <p style="color:#E4CFAB;font-size:13px;font-weight:700;margin:0 0 2px;">Recipes &amp; technique drops</p>
          <p style="color:#A0A0A0;font-size:13px;margin:0;">Fire-tested ideas, no filler, no fluff.</p>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid #800000;">
          <p style="color:#E4CFAB;font-size:13px;font-weight:700;margin:0 0 2px;">Events &amp; member drops</p>
          <p style="color:#A0A0A0;font-size:13px;margin:0;">First to know about new Ember gatherings and Vault openings.</p>
        </td>
      </tr>
    </table>
    ${cta('https://emberworld.co/events', 'See what\'s burning →')}
    ${footer_note('You can unsubscribe any time by replying "unsubscribe" to this email. No spam. Ever.')}
  `);
}

/* Vault purchase email (Lemon Squeezy webhook) */
function vaultCustomerEmailHtml(name, plan, total) {
  const first = firstName(name);
  return wrapper(`
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
    ${cta('https://emberworld.co/account', 'Enter the Vault →')}
    ${footer_note('You can manage your subscription at any time through your account. Questions? Reply to this email or reach us at emberworldwide@gmail.com.')}
  `);
}

/* Owner notification emails */
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

function ownerEventHtml(name, email, title, date, location) {
  return `<!DOCTYPE html><html><body style="background:#0a0a0a;padding:40px;font-family:Georgia,serif;color:#fff;">
<h2 style="color:#E4CFAB;">New Event Created</h2>
<table style="border-collapse:collapse;width:100%;max-width:480px;">
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Host</td><td style="color:#fff;font-size:14px;">${name}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Email</td><td style="color:#fff;font-size:14px;">${email}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Event</td><td style="color:#fff;font-size:14px;">${title}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Date</td><td style="color:#fff;font-size:14px;">${date}</td></tr>
  <tr><td style="padding:8px 0;color:#A0A0A0;font-size:14px;">Location</td><td style="color:#fff;font-size:14px;">${location}</td></tr>
</table>
</body></html>`;
}
