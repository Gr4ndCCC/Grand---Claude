const PLANS = {
  monthly: {
    label: 'Vault Monthly',
    variantId: process.env.LEMONSQUEEZY_MONTHLY_VARIANT_ID,
  },
  annual: {
    label: 'Vault Annual',
    variantId: process.env.LEMONSQUEEZY_ANNUAL_VARIANT_ID,
  },
};

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') {
    return Promise.resolve(req.body ? JSON.parse(req.body) : {});
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://emberworld.co';
}

function requireConfig() {
  const missing = [];
  if (!process.env.LEMONSQUEEZY_API_KEY) missing.push('LEMONSQUEEZY_API_KEY');
  if (!process.env.LEMONSQUEEZY_STORE_ID) missing.push('LEMONSQUEEZY_STORE_ID');
  if (!PLANS.monthly.variantId) missing.push('LEMONSQUEEZY_MONTHLY_VARIANT_ID');
  if (!PLANS.annual.variantId) missing.push('LEMONSQUEEZY_ANNUAL_VARIANT_ID');
  return missing;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const missing = requireConfig();
  if (missing.length) {
    return res.status(503).json({
      success: false,
      error: 'Lemon Squeezy is not configured',
      missing,
    });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid JSON body' });
  }

  const plan = body.plan;
  const selected = PLANS[plan];
  if (!selected) {
    return res.status(400).json({ success: false, error: 'Plan must be monthly or annual' });
  }

  const email = String(body.email || '').trim();
  const name = String(body.name || '').trim();
  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const origin = siteUrl();
  const redirectUrl = `${origin}/#/account?checkout=success&plan=${encodeURIComponent(plan)}`;

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        product_options: {
          name: `Ember ${selected.label}`,
          redirect_url: redirectUrl,
          receipt_button_text: 'Open Ember',
          receipt_link_url: origin,
          receipt_thank_you_note: 'Welcome to the Ember Vault.',
          enabled_variants: [Number(selected.variantId)],
        },
        checkout_options: {
          embed: false,
          media: true,
          logo: true,
          desc: true,
          discount: true,
          subscription_preview: true,
          background_color: '#0A0A0A',
          headings_color: '#F5EFE6',
          primary_text_color: '#FFFFFF',
          secondary_text_color: '#A0A0A0',
          links_color: '#8B1E1E',
          borders_color: '#2A2A2A',
          button_color: '#800000',
          button_text_color: '#FFFFFF',
        },
        checkout_data: {
          email,
          name,
          custom: {
            email,
            name,
            plan,
            source: 'emberworld.co',
          },
        },
        test_mode: process.env.LEMONSQUEEZY_TEST_MODE === 'true',
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: String(process.env.LEMONSQUEEZY_STORE_ID),
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: String(selected.variantId),
          },
        },
      },
    },
  };

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: 'Failed to create Lemon Squeezy checkout',
        details: data.errors || data,
      });
    }

    return res.json({
      success: true,
      url: data.data?.attributes?.url,
      checkout_id: data.data?.id,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: 'Could not reach Lemon Squeezy',
      message: error.message,
    });
  }
}
