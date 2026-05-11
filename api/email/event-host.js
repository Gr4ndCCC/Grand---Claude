import { EMAIL_CATEGORIES, emailShell, sendEmail, siteUrl } from '../_lib/email.js';

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

  const { name, email, eventTitle, eventDate, eventTime, eventLocation, eventId, maxGuests } = req.body || {};
  if (!email || !eventTitle) {
    return res.status(400).json({ success: false, error: 'Email and event title are required' });
  }

  try {
    const result = await sendEmail({
      to: email,
      subject: `Your Ember event is live: ${eventTitle}`,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.EVENTS }],
      html: emailShell({
        title: 'Your event is live.',
        preheader: `${eventTitle} is now listed on Ember.`,
        body: `
          <p style="margin:0 0 18px">Hey ${text((name || 'there').split(' ')[0])},</p>
          <p style="margin:0 0 18px"><strong style="color:#ffffff">${text(eventTitle)}</strong> is now live on Ember.</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Date:</strong> ${text(eventDate)}</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Time:</strong> ${text(eventTime)}</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Location:</strong> ${text(eventLocation)}</p>
          <p style="margin:0"><strong style="color:#ffffff">Capacity:</strong> ${text(maxGuests)} guests</p>
        `,
        cta: { label: 'View event', href: `${siteUrl()}/#/events/${encodeURIComponent(eventId || '')}` },
      }),
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.error('[email event-host]', error.message);
    return res.status(502).json({ success: false, error: 'Host email could not be sent' });
  }
}
