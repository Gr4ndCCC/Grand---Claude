import { EMAIL_CATEGORIES, newsletterWelcomeEmail, sendEmail } from '../_lib/email.js';
import { checkRate, getIp } from '../_lib/ratelimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!checkRate(getIp(req), { maxHits: 3, windowMs: 60_000 })) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait a minute.' });
  }

  const { email } = req.body || {};
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(String(email)) || String(email).length > 254) {
    return res.status(400).json({ success: false, error: 'Valid email is required' });
  }

  const safeEmail = String(email).trim().slice(0, 254);

  try {
    if (process.env.RESEND_NEWSLETTER_AUDIENCE_ID && process.env.RESEND_API_KEY) {
      await fetch(`https://api.resend.com/audiences/${process.env.RESEND_NEWSLETTER_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: safeEmail, unsubscribed: false }),
      });
    }

    const message = newsletterWelcomeEmail({ email: safeEmail });
    const result = await sendEmail({
      to: safeEmail,
      subject: message.subject,
      html: message.html,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.NEWSLETTER }],
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.error('[email newsletter]', error.message);
    return res.status(502).json({ success: false, error: 'Newsletter subscription could not be saved' });
  }
}
