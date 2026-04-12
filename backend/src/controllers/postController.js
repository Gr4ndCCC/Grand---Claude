'use strict';
const { supabaseAdmin } = require('../config/supabase');

// ──────────────────────────────────────────────────────────────────
// POST /api/posts   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function createPost(req, res) {
  try {
    const { caption, image_url, event_id } = req.body;

    if (!caption && !image_url) {
      return res.status(400).json({ success: false, error: 'Post must have a caption or image' });
    }

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        user_id:   req.user.id,
        event_id:  event_id || null,
        caption:   caption  || null,
        image_url: image_url || null,
      })
      .select(`*, user:user_id(id, username, full_name, avatar_url)`)
      .single();

    if (error) {
      console.error('[createPost]', error);
      return res.status(500).json({ success: false, error: 'Failed to create post' });
    }

    return res.status(201).json({ success: true, post: { ...post, liked_by_me: false } });
  } catch (err) {
    console.error('[createPost]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/posts?limit=&offset=   (auth optional)
// ──────────────────────────────────────────────────────────────────
async function getFeed(req, res) {
  try {
    const limit  = parseInt(req.query.limit)  || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select(`*, user:user_id(id, username, full_name, avatar_url)`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[getFeed]', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch feed' });
    }

    // If user is authenticated, check which posts they've liked
    let likedPostIds = new Set();
    if (req.user && posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const { data: likes } = await supabaseAdmin
        .from('post_likes')
        .select('post_id')
        .eq('user_id', req.user.id)
        .in('post_id', postIds);

      if (likes) likedPostIds = new Set(likes.map(l => l.post_id));
    }

    const enriched = posts.map(p => ({
      ...p,
      liked_by_me: likedPostIds.has(p.id),
    }));

    return res.status(200).json({ success: true, posts: enriched, count: posts.length });
  } catch (err) {
    console.error('[getFeed]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/posts/:id/like   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function likePost(req, res) {
  try {
    const { id } = req.params;

    const { data: existing } = await supabaseAdmin
      .from('post_likes')
      .select('post_id').eq('user_id', req.user.id).eq('post_id', id).maybeSingle();

    if (existing) return res.status(409).json({ success: false, error: 'Already liked' });

    const { error } = await supabaseAdmin
      .from('post_likes').insert({ user_id: req.user.id, post_id: id });

    if (error) return res.status(500).json({ success: false, error: 'Failed to like post' });

    // Increment like counter
    const { data: post } = await supabaseAdmin.from('posts').select('likes_count').eq('id', id).maybeSingle();
    if (post) {
      await supabaseAdmin.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', id);
    }

    return res.status(200).json({ success: true, message: 'Post liked' });
  } catch (err) {
    console.error('[likePost]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE /api/posts/:id/like   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function unlikePost(req, res) {
  try {
    const { id } = req.params;

    await supabaseAdmin
      .from('post_likes').delete().eq('user_id', req.user.id).eq('post_id', id);

    const { data: post } = await supabaseAdmin.from('posts').select('likes_count').eq('id', id).maybeSingle();
    if (post) {
      await supabaseAdmin.from('posts').update({ likes_count: Math.max(0, post.likes_count - 1) }).eq('id', id);
    }

    return res.status(200).json({ success: true, message: 'Post unliked' });
  } catch (err) {
    console.error('[unlikePost]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE /api/posts/:id   (requires auth — own posts only)
// ──────────────────────────────────────────────────────────────────
async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const { data: post } = await supabaseAdmin
      .from('posts').select('user_id').eq('id', id).maybeSingle();

    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Can only delete your own posts' });
    }

    await supabaseAdmin.from('posts').delete().eq('id', id);
    return res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('[deletePost]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { createPost, getFeed, likePost, unlikePost, deletePost };
