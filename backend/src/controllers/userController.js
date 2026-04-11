'use strict';
const { supabaseAdmin } = require('../config/supabase');

// ──────────────────────────────────────────────────────────────────
// GET /api/users/:username
// ──────────────────────────────────────────────────────────────────
async function getProfile(req, res) {
  try {
    const { username } = req.params;

    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (error || !profile) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // If the viewer is the profile owner, include email
    const isOwn = req.user && req.user.id === profile.id;

    return res.status(200).json({
      success: true,
      user:    isOwn ? { ...profile, email: req.user.email } : profile,
    });
  } catch (err) {
    console.error('[getProfile]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// PUT /api/users/me   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function updateProfile(req, res) {
  try {
    const allowed = ['full_name', 'bio', 'avatar_url', 'location', 'website'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('[updateProfile]', error);
      return res.status(500).json({ success: false, error: 'Failed to update profile' });
    }

    return res.status(200).json({ success: true, user: profile });
  } catch (err) {
    console.error('[updateProfile]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/users/:username/follow   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function followUser(req, res) {
  try {
    const { username } = req.params;

    const { data: target } = await supabaseAdmin
      .from('users').select('id').eq('username', username.toLowerCase()).maybeSingle();

    if (!target) return res.status(404).json({ success: false, error: 'User not found' });
    if (target.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    }

    // Check already following
    const { data: existing } = await supabaseAdmin
      .from('follows')
      .select('follower_id')
      .eq('follower_id', req.user.id)
      .eq('following_id', target.id)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, error: 'Already following this user' });
    }

    const { error } = await supabaseAdmin
      .from('follows')
      .insert({ follower_id: req.user.id, following_id: target.id });

    if (error) {
      console.error('[followUser]', error);
      return res.status(500).json({ success: false, error: 'Failed to follow user' });
    }

    // Increment counters
    await Promise.all([
      supabaseAdmin.rpc('increment_counter', { table_name: 'users', column_name: 'following_count', row_id: req.user.id }),
      supabaseAdmin.rpc('increment_counter', { table_name: 'users', column_name: 'followers_count', row_id: target.id }),
    ]).catch(() => {
      // If RPC doesn't exist, update manually
      return Promise.all([
        supabaseAdmin.from('users').update({ following_count: supabaseAdmin.raw('following_count + 1') }).eq('id', req.user.id),
        supabaseAdmin.from('users').update({ followers_count: supabaseAdmin.raw('followers_count + 1') }).eq('id', target.id),
      ]);
    });

    return res.status(200).json({ success: true, message: `Now following @${username}` });
  } catch (err) {
    console.error('[followUser]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE /api/users/:username/follow   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function unfollowUser(req, res) {
  try {
    const { username } = req.params;

    const { data: target } = await supabaseAdmin
      .from('users').select('id').eq('username', username.toLowerCase()).maybeSingle();

    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    const { error } = await supabaseAdmin
      .from('follows')
      .delete()
      .eq('follower_id', req.user.id)
      .eq('following_id', target.id);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to unfollow user' });
    }

    return res.status(200).json({ success: true, message: `Unfollowed @${username}` });
  } catch (err) {
    console.error('[unfollowUser]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/users/:username/followers
// ──────────────────────────────────────────────────────────────────
async function getFollowers(req, res) {
  try {
    const { username } = req.params;
    const limit  = parseInt(req.query.limit)  || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { data: target } = await supabaseAdmin
      .from('users').select('id').eq('username', username.toLowerCase()).maybeSingle();

    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    const { data, error } = await supabaseAdmin
      .from('follows')
      .select('follower:follower_id(id, username, full_name, avatar_url, bio), created_at')
      .eq('following_id', target.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch followers' });
    }

    return res.status(200).json({
      success:   true,
      followers: data.map(f => f.follower),
      count:     data.length,
    });
  } catch (err) {
    console.error('[getFollowers]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/users/:username/following
// ──────────────────────────────────────────────────────────────────
async function getFollowing(req, res) {
  try {
    const { username } = req.params;
    const limit  = parseInt(req.query.limit)  || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { data: target } = await supabaseAdmin
      .from('users').select('id').eq('username', username.toLowerCase()).maybeSingle();

    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    const { data, error } = await supabaseAdmin
      .from('follows')
      .select('following:following_id(id, username, full_name, avatar_url, bio), created_at')
      .eq('follower_id', target.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch following' });
    }

    return res.status(200).json({
      success:   true,
      following: data.map(f => f.following),
      count:     data.length,
    });
  } catch (err) {
    console.error('[getFollowing]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/users/search?q=query
// ──────────────────────────────────────────────────────────────────
async function searchUsers(req, res) {
  try {
    const q     = (req.query.q || '').trim();
    const limit = parseInt(req.query.limit) || 10;

    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, error: 'Query must be at least 2 characters' });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, username, full_name, avatar_url, bio')
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(limit);

    if (error) {
      return res.status(500).json({ success: false, error: 'Search failed' });
    }

    return res.status(200).json({ success: true, users: data });
  } catch (err) {
    console.error('[searchUsers]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { getProfile, updateProfile, followUser, unfollowUser, getFollowers, getFollowing, searchUsers };
