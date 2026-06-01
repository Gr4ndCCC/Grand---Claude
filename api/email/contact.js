import { EMAIL_CATEGORIES, contactReceivedEmail, emailShell, sendEmail, siteUrl } from '../_lib/email.js';
import { checkRate, getIp } from '../_lib/ratelimit.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!checkRate(getIp(req), { maxHits: 5, windowMs: 60_000 })) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait a minute.' });
  }

  const { name, email, topic, message } = req.body || {};
  if (
    !name || !email || !message ||
    !/^[^@]+@[^@]+\.[^@]+$/.test(String(email)) ||
    String(name).trim().length > 100 ||
    String(message).trim().length > 5000
  ) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  const safeName    = String(name).trim().slice(0, 100);
  const safeEmail   = String(email).trim().slice(0, 254);
  const safeTopic   = String(topic || 'General').trim().slice(0, 100);
  const safeMessage = String(message).trim().slice(0, 5000);

  try {
    const ack = contactReceivedEmail({ name: safeName, topic: safeTopic });
    await sendEmail({
      to: safeEmail,
      subject: ack.subject,
      html: ack.html,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.SUPPORT }],
    });

    await sendEmail({
      to: process.env.EMAIL_ADMIN_TO || 'support@emberworld.co',
      subject: `New Ember contact: ${safeTopic}`,
      replyTo: safeEmail,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.SUPPORT }],
      html: emailShell({
        title: 'New contact message.',
        preheader: `Message from ${safeName}`,
        body: `
          <p style="margin:0 0 12px"><strong style="color:#ffffff">Name:</strong> ${escapeHtml(safeName)}</p>
          <p style="margin:0 0 12px"><strong style="color:#ffffff">Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p style="margin:0 0 12px"><strong style="color:#ffffff">Topic:</strong> ${escapeHtml(safeTopic)}</p>
          <p style="margin:20px 0 0;white-space:pre-wrap">${escapeHtml(safeMessage)}</p>
        `,
        cta: { label: 'Open Ember', href: siteUrl() },
      }),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('[email contact]', error.message);
    return res.status(502).json({ success: false, error: 'Contact email could not be sent' });
  }
}
