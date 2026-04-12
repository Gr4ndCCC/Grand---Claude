'use strict';
const router = require('express').Router();
const { createPost, getFeed, likePost, unlikePost, deletePost } = require('../controllers/postController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET  /api/posts?limit=&offset=  — feed (auth optional, enriches liked_by_me)
router.get('/', optionalAuth, getFeed);

// POST /api/posts  — create post (auth required)
router.post('/', requireAuth, createPost);

// POST   /api/posts/:id/like   — like post (auth required)
router.post('/:id/like', requireAuth, likePost);

// DELETE /api/posts/:id/like   — unlike post (auth required)
router.delete('/:id/like', requireAuth, unlikePost);

// DELETE /api/posts/:id        — delete own post (auth required)
router.delete('/:id', requireAuth, deletePost);

module.exports = router;
