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

  const { name, email, eventTitle, eventDate, eventTime, eventLocation, eventId } = req.body || {};
  if (!email || !eventTitle) {
    return res.status(400).json({ success: false, error: 'Email and event title are required' });
  }

  try {
    const result = await sendEmail({
      to: email,
      subject: `You joined ${eventTitle}`,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.ACCOUNT }],
      html: emailShell({
        title: 'You are on the list.',
        preheader: `RSVP confirmed for ${eventTitle}`,
        body: `
          <p style="margin:0 0 18px">Hey ${text((name || 'there').split(' ')[0])},</p>
          <p style="margin:0 0 18px">Your RSVP for <strong style="color:#ffffff">${text(eventTitle)}</strong> is confirmed.</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Date:</strong> ${text(eventDate)}</p>
          <p style="margin:0 0 8px"><strong style="color:#ffffff">Time:</strong> ${text(eventTime)}</p>
          <p style="margin:0"><strong style="color:#ffffff">Location:</strong> ${text(eventLocation)}</p>
        `,
        cta: { label: 'View event', href: `${siteUrl()}/#/events/${encodeURIComponent(eventId || '')}` },
      }),
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.error('[email event-rsvp]', error.message);
    return res.status(502).json({ success: false, error: 'RSVP email could not be sent' });
  }
}
