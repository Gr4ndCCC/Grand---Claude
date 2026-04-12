'use strict';
const router = require('express').Router();
const {
  getProfile, updateProfile,
  followUser, unfollowUser,
  getFollowers, getFollowing,
  searchUsers,
} = require('../controllers/userController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET  /api/users/search?q=query — search users
router.get('/search', optionalAuth, searchUsers);

// GET  /api/users/me/profile — alias for own profile (requires auth)
router.get('/me/profile', requireAuth, (req, res, next) => {
  req.params.username = req.user.user_metadata?.username || '';
  next();
}, getProfile);

// PUT  /api/users/me — update own profile (requires auth)
router.put('/me', requireAuth, updateProfile);

// GET  /api/users/:username — public profile
router.get('/:username', optionalAuth, getProfile);

// GET  /api/users/:username/followers
router.get('/:username/followers', optionalAuth, getFollowers);

// GET  /api/users/:username/following
router.get('/:username/following', optionalAuth, getFollowing);

// POST   /api/users/:username/follow — follow a user (requires auth)
router.post('/:username/follow', requireAuth, followUser);

// DELETE /api/users/:username/follow — unfollow a user (requires auth)
router.delete('/:username/follow', requireAuth, unfollowUser);

module.exports = router;
