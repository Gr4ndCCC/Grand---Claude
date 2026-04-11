'use strict';
const { supabaseAdmin } = require('../config/supabase');

const REQUIRED_FIELDS = ['company_name', 'owner_name', 'email'];

// ──────────────────────────────────────────────────────────────────
// POST /api/partners/apply   (no auth required)
// ──────────────────────────────────────────────────────────────────
async function submitApplication(req, res) {
  try {
    const {
      company_name, owner_name, email, phone,
      country, city, website,
      business_type, years_in_business,
      ships_internationally, monthly_orders,
      why_ember, unique_offering,
      chef_collaborations, awards,
      partnership_type, member_discount,
      additional_info,
    } = req.body;

    // Validate required fields
    const missing = REQUIRED_FIELDS.filter(f => !req.body[f] || !String(req.body[f]).trim());
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error:   `Missing required fields: ${missing.join(', ')}`,
      });
    }

    // Basic email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    const { data: application, error } = await supabaseAdmin
      .from('partner_applications')
      .insert({
        company_name, owner_name, email: email.toLowerCase(),
        phone:    phone    || null,
        country:  country  || null,
        city:     city     || null,
        website:  website  || null,
        business_type:      business_type      || null,
        years_in_business:  years_in_business  || null,
        ships_internationally: ships_internationally || null,
        monthly_orders:     monthly_orders     || null,
        why_ember:          why_ember          || null,
        unique_offering:    unique_offering    || null,
        chef_collaborations: chef_collaborations || null,
        awards:             awards             || null,
        partnership_type:   partnership_type   || null,
        member_discount:    member_discount    || null,
        additional_info:    additional_info    || null,
        status: 'pending',
      })
      .select('id, company_name, status, submitted_at')
      .single();

    if (error) {
      console.error('[submitApplication]', error);
      return res.status(500).json({ success: false, error: 'Failed to submit application' });
    }

    return res.status(201).json({
      success: true,
      message: "Thank you! Your application has been received. We'll review it and get back to you soon.",
      application: {
        id:           application.id,
        company_name: application.company_name,
        status:       application.status,
        submitted_at: application.submitted_at,
      },
    });
  } catch (err) {
    console.error('[submitApplication]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { submitApplication };
