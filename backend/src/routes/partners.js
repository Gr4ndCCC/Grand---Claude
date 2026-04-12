'use strict';
const router = require('express').Router();
const { submitApplication } = require('../controllers/partnerController');

// POST /api/partners/apply — submit partner application (no auth required)
router.post('/apply', submitApplication);

module.exports = router;
