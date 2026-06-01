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

  const { name, email, eventTitle, eventDate, eventTime, eventLocation, eventId, maxGuests } = req.body || {};
  if (!email || !eventTitle) {
    return res.status(400).json({ success: false, error: 'Email and event title are required' });
  }
  if (user.email && user.email !== String(email).trim()) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  try {
    const result = await sendEmail({
      to: String(email).trim(),
      subject: `Your Ember event is live: ${String(eventTitle).slice(0, 100)}`,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.EVENTS }],
      html: emailShell({
        title: 'Your event is live.',
        preheader: `${text(String(eventTitle).slice(0, 100))} is now listed on Ember.`,
        body: `
          <p style="margin:0 0 18px">Hey ${text((String(name || 'there')).split(' ')[0].slice(0, 50))},</p>
          <p style="margin:0 0 18px"><strong style="color:#ffffff">${text(String(eventTitle).slice(0, 100))}</strong> is now live on Ember.</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Date:</strong> ${text(String(eventDate || '').slice(0, 30))}</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Time:</strong> ${text(String(eventTime || '').slice(0, 20))}</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Location:</strong> ${text(String(eventLocation || '').slice(0, 200))}</p>
          <p style="margin:0"><strong style="color:#ffffff">Capacity:</strong> ${text(String(maxGuests || '').slice(0, 10))} guests</p>
        `,
        cta: { label: 'View event', href: `${siteUrl()}/#/events/${encodeURIComponent(String(eventId || '').slice(0, 50))}` },
      }),
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.error('[email event-host]', error.message);
    return res.status(502).json({ success: false, error: 'Host email could not be sent' });
  }
}
