'use strict';
const router = require('express').Router();
const { register, login, logout, getMe, refreshToken } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// POST /api/auth/register — create new account
router.post('/register', register);

// POST /api/auth/login — sign in, returns JWT
router.post('/login', login);

// POST /api/auth/logout — invalidate session (requires auth)
router.post('/logout', requireAuth, logout);

// GET  /api/auth/me — return current user profile (requires auth)
router.get('/me', requireAuth, getMe);

// POST /api/auth/refresh — exchange refresh_token for new access_token
router.post('/refresh', refreshToken);

module.exports = router;
