import { EMAIL_CATEGORIES, newsletterWelcomeEmail, sendEmail } from '../_lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email is required' });
  }

  try {
    if (process.env.RESEND_NEWSLETTER_AUDIENCE_ID && process.env.RESEND_API_KEY) {
      await fetch(`https://api.resend.com/audiences/${process.env.RESEND_NEWSLETTER_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    const message = newsletterWelcomeEmail({ email });
    const result = await sendEmail({
      to: email,
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
