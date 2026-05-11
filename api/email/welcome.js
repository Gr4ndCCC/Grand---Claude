import { EMAIL_CATEGORIES, sendEmail, welcomeEmail } from '../_lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, name } = req.body || {};
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email is required' });
  }

  try {
    const message = welcomeEmail({ name });
    const result = await sendEmail({
      to: email,
      subject: message.subject,
      html: message.html,
      tags: [{ name: 'category', value: EMAIL_CATEGORIES.ACCOUNT }],
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.error('[email welcome]', error.message);
    return res.status(502).json({ success: false, error: 'Welcome email could not be sent' });
  }
}
