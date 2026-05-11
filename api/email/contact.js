import { EMAIL_CATEGORIES, contactReceivedEmail, emailShell, sendEmail, siteUrl } from '../_lib/email.js';

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

  const { name, email, topic, message } = req.body || {};
  if (!name || !email || !message || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  try {
    const ack = contactReceivedEmail({ name, topic });
    await sendEmail({
      to: email,
      subject: ack.subject,
      html: ack.html,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.SUPPORT }],
    });

    await sendEmail({
      to: process.env.EMAIL_ADMIN_TO || 'support@emberworld.co',
      subject: `New Ember contact: ${topic || 'General'}`,
      replyTo: email,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.SUPPORT }],
      html: emailShell({
        title: 'New contact message.',
        preheader: `Message from ${name}`,
        body: `
          <p style="margin:0 0 12px"><strong style="color:#ffffff">Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 12px"><strong style="color:#ffffff">Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 12px"><strong style="color:#ffffff">Topic:</strong> ${escapeHtml(topic || 'General')}</p>
          <p style="margin:20px 0 0;white-space:pre-wrap">${escapeHtml(message)}</p>
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
