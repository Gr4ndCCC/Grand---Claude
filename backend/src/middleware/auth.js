'use strict';
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

/**
 * requireAuth — verifies the Bearer JWT in the Authorization header.
 * Attaches req.user (Supabase user object) and req.token to the request.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT with Supabase — this validates the signature and expiry
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    req.user  = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('[auth middleware]', err.message);
    return res.status(500).json({ success: false, error: 'Authentication check failed' });
  }
}

/**
 * optionalAuth — same as requireAuth but does not block unauthenticated requests.
 * Attaches req.user if a valid token is present, otherwise req.user is null.
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user  = null;
      req.token = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    req.user  = error ? null : user;
    req.token = error ? null : token;
    next();
  } catch {
    req.user  = null;
    req.token = null;
    next();
  }
}

module.exports = { requireAuth, optionalAuth };
