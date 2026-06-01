import { EMAIL_CATEGORIES, sendEmail, welcomeEmail } from '../_lib/email.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const user = await requireAuth(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { email, name } = req.body || {};
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(String(email))) {
    return res.status(400).json({ success: false, error: 'Valid email is required' });
  }
  if (user.email && user.email !== String(email).trim()) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const safeName = String(name || '').slice(0, 100);
  try {
    const message = welcomeEmail({ name: safeName });
    const result = await sendEmail({
      to: String(email).trim(),
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
