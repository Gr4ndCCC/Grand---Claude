const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export const EMAIL_CATEGORIES = {
  ACCOUNT: 'account',
  VAULT: 'vault',
  BILLING: 'billing',
  NEWSLETTER: 'newsletter',
  SUPPORT: 'support',
};

export function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://emberworld.co';
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function emailShell({ title, preheader, body, cta }) {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader || title);
  const ctaHtml = cta
    ? `<p style="margin:30px 0 8px"><a href="${escapeHtml(cta.href)}" style="display:inline-block;background:#800000;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 22px;font-weight:700">${escapeHtml(cta.label)}</a></p>`
    : '';

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${safeTitle}</title>
</head>
<body style="margin:0;background:#0a0a0a;color:#f5efe6;font-family:Arial,Helvetica,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent">${safePreheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a">
    <tr>
      <td align="center" style="padding:32px 18px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#111111;border:1px solid #262626;border-radius:16px;overflow:hidden">
          <tr>
            <td style="padding:34px 34px 18px">
              <p style="margin:0 0 10px;color:#9b1c1c;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">Ember</p>
              <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:34px;line-height:1.08;font-weight:400">${safeTitle}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 34px 34px;color:#d7d0c7;font-size:16px;line-height:1.7">
              ${body}
              ${ctaHtml}
              <p style="margin:34px 0 0;color:#706a62;font-size:13px;line-height:1.6">You are receiving this because you used Ember at <a href="${siteUrl()}" style="color:#bca47d">${siteUrl()}</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendEmail({ to, subject, html, replyTo, tags = [] }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not configured');
    return { skipped: true };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Ember <hello@emberworld.co>',
      to,
      subject,
      html,
      reply_to: replyTo || process.env.EMAIL_REPLY_TO || 'support@emberworld.co',
      tags,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Resend email failed');
  }
  return data;
}

export function welcomeEmail({ name }) {
  const firstName = escapeHtml((name || 'there').split(' ')[0]);
  return {
    subject: 'Welcome to Ember',
    html: emailShell({
      title: 'Welcome to Ember.',
      preheader: 'Your Ember account is ready.',
      body: `
        <p style="margin:0 0 18px">Hey ${firstName},</p>
        <p style="margin:0 0 18px">Your Ember account is live. You can now discover events, join the Vault, and start building your place in the brotherhood.</p>
        <p style="margin:0">The fire is lit. Start with the Vault or browse upcoming gatherings.</p>
      `,
      cta: { label: 'Open Ember', href: siteUrl() },
    }),
  };
}

export function vaultWelcomeEmail({ name, plan }) {
  const firstName = escapeHtml((name || 'there').split(' ')[0]);
  const planLabel = plan === 'monthly' ? 'Monthly' : plan === 'annual' ? 'Annual' : 'Vault';
  return {
    subject: `Your Ember Vault ${planLabel} membership is active`,
    html: emailShell({
      title: 'You are in the Vault.',
      preheader: 'Your Ember Vault membership is active.',
      body: `
        <p style="margin:0 0 18px">Hey ${firstName},</p>
        <p style="margin:0 0 18px">Your ${escapeHtml(planLabel)} membership is active. The Vault is now open: recipes, masterclasses, partner deals, Council access, and Summit updates.</p>
        <p style="margin:0">Keep this email for your records. Your receipt and billing details are handled securely by Lemon Squeezy.</p>
      `,
      cta: { label: 'Open the Vault', href: `${siteUrl()}/#/vault` },
    }),
  };
}

export function subscriptionUpdatedEmail({ name, status }) {
  return {
    subject: 'Your Ember Vault membership was updated',
    html: emailShell({
      title: 'Membership updated.',
      preheader: 'Your Ember Vault membership status changed.',
      body: `
        <p style="margin:0 0 18px">Hey ${escapeHtml((name || 'there').split(' ')[0])},</p>
        <p style="margin:0">Your Vault membership status is now <strong style="color:#ffffff">${escapeHtml(status || 'updated')}</strong>.</p>
      `,
      cta: { label: 'View account', href: `${siteUrl()}/#/account` },
    }),
  };
}

export function contactReceivedEmail({ name, topic }) {
  return {
    subject: 'We received your Ember message',
    html: emailShell({
      title: 'Message received.',
      preheader: 'We will reply to your Ember message soon.',
      body: `
        <p style="margin:0 0 18px">Hey ${escapeHtml((name || 'there').split(' ')[0])},</p>
        <p style="margin:0 0 18px">We received your message about <strong style="color:#ffffff">${escapeHtml(topic || 'General')}</strong>.</p>
        <p style="margin:0">A person on the Ember side will reply as soon as possible.</p>
      `,
    }),
  };
}

export function newsletterWelcomeEmail({ email }) {
  return {
    subject: 'You are on the Ember list',
    html: emailShell({
      title: 'You are on the list.',
      preheader: 'Ember updates, Vault drops, and event signals.',
      body: `
        <p style="margin:0 0 18px">You are subscribed as <strong style="color:#ffffff">${escapeHtml(email)}</strong>.</p>
        <p style="margin:0">We will send the good stuff only: Vault drops, event signals, partner notes, and Ember updates worth opening.</p>
      `,
      cta: { label: 'Visit Ember', href: siteUrl() },
    }),
  };
}
