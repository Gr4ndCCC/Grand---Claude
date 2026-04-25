'use strict';
const router = require('express').Router();
const {
  createCheckoutValidators,
  createCheckout,
  getSubscription,
} = require('../controllers/stripeController');
const { requireAuth } = require('../middleware/auth');

router.post('/create-checkout', requireAuth, createCheckoutValidators, createCheckout);
router.get ('/subscription',    requireAuth, getSubscription);
// /api/stripe/webhook is registered at app-level with a raw body parser

module.exports = router;
