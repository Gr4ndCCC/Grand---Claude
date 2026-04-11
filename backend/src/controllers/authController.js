'use strict';
const { supabase, supabaseAdmin } = require('../config/supabase');

// ──────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────────────────
async function register(req, res) {
  try {
    const { email, password, username, full_name } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        error: 'email, password, and username are required',
      });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3–30 characters, letters/numbers/underscores only',
      });
    }

    // Check username is not already taken
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true, // skip email confirmation in development
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ success: false, error: 'Email already registered' });
      }
      console.error('[register] auth error:', authError);
      return res.status(400).json({ success: false, error: authError.message });
    }

    const userId = authData.user.id;

    // Create the public profile row (service role bypasses RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id:        userId,
        username:  username.toLowerCase(),
        full_name: full_name || null,
      })
      .select()
      .single();

    if (profileError) {
      // Rollback auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      console.error('[register] profile error:', profileError);
      return res.status(500).json({ success: false, error: 'Failed to create user profile' });
    }

    // Sign the user in to get a session/token
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (sessionError) {
      console.error('[register] session error:', sessionError);
      // User was created; just can't issue token right now
      return res.status(201).json({
        success: true,
        message: 'Account created. Please sign in.',
        user: profile,
      });
    }

    return res.status(201).json({
      success:      true,
      message:      'Account created successfully',
      token:        sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      user:         profile,
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Fetch the public profile
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    return res.status(200).json({
      success:       true,
      token:         data.session.access_token,
      refresh_token: data.session.refresh_token,
      user:          profile || { id: data.user.id, email: data.user.email },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────────────────────────
async function logout(req, res) {
  try {
    // Supabase JWT is stateless — just instruct client to discard the token.
    // If using refresh tokens, we can revoke the session.
    if (req.token) {
      await supabase.auth.signOut();
    }
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('[logout]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/auth/me   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function getMe(req, res) {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error || !profile) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    return res.status(200).json({
      success: true,
      user:    { ...profile, email: req.user.email },
    });
  } catch (err) {
    console.error('[getMe]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// ──────────────────────────────────────────────────────────────────
async function refreshToken(req, res) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ success: false, error: 'refresh_token is required' });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    return res.status(200).json({
      success:       true,
      token:         data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (err) {
    console.error('[refreshToken]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { register, login, logout, getMe, refreshToken };
