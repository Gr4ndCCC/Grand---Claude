import { EMAIL_CATEGORIES, emailShell, sendEmail, siteUrl } from '../_lib/email.js';
import { requireAuth } from '../_lib/auth.js';

function text(value = '') {
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

  const user = await requireAuth(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { name, email, eventTitle, eventDate, eventTime, eventLocation, eventId } = req.body || {};
  if (!email || !eventTitle) {
    return res.status(400).json({ success: false, error: 'Email and event title are required' });
  }
  if (user.email && user.email !== String(email).trim()) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  try {
    const result = await sendEmail({
      to: String(email).trim(),
      subject: `You joined ${String(eventTitle).slice(0, 100)}`,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.EVENTS }],
      html: emailShell({
        title: 'You are on the list.',
        preheader: `RSVP confirmed for ${text(String(eventTitle).slice(0, 100))}`,
        body: `
          <p style="margin:0 0 18px">Hey ${text((String(name || 'there')).split(' ')[0].slice(0, 50))},</p>
          <p style="margin:0 0 18px">Your RSVP for <strong style="color:#ffffff">${text(String(eventTitle).slice(0, 100))}</strong> is confirmed.</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Date:</strong> ${text(String(eventDate || '').slice(0, 30))}</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Time:</strong> ${text(String(eventTime || '').slice(0, 20))}</p>
          <p style="margin:0"><strong style="color:#ffffff">Location:</strong> ${text(String(eventLocation || '').slice(0, 200))}</p>
        `,
        cta: { label: 'View event', href: `${siteUrl()}/#/events/${encodeURIComponent(String(eventId || '').slice(0, 50))}` },
      }),
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.error('[email event-rsvp]', error.message);
    return res.status(502).json({ success: false, error: 'RSVP email could not be sent' });
  }
}
