'use strict';
const router = require('express').Router();
const {
  createEvent, getEvents, getEventById, updateEvent, deleteEvent,
  joinEvent, leaveEvent, getEventParticipants,
  addContribution, removeContribution, getContributions,
} = require('../controllers/eventController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET  /api/events?lat=&lng=&radius=&date_from=&date_to=&limit=&offset=
router.get('/', optionalAuth, getEvents);

// POST /api/events — create event (auth required)
router.post('/', requireAuth, createEvent);

// GET  /api/events/:id — event detail (public)
router.get('/:id', optionalAuth, getEventById);

// PUT  /api/events/:id — update event (host only)
router.put('/:id', requireAuth, updateEvent);

// DELETE /api/events/:id — delete event (host only)
router.delete('/:id', requireAuth, deleteEvent);

// POST   /api/events/:id/join — join event (auth required)
router.post('/:id/join', requireAuth, joinEvent);

// DELETE /api/events/:id/join — leave event (auth required)
router.delete('/:id/join', requireAuth, leaveEvent);

// GET  /api/events/:id/participants — list participants
router.get('/:id/participants', optionalAuth, getEventParticipants);

// POST   /api/events/:id/contributions — add contribution (auth required)
router.post('/:id/contributions', requireAuth, addContribution);

// DELETE /api/events/:id/contributions/:contributionId — remove own contribution
router.delete('/:id/contributions/:contributionId', requireAuth, removeContribution);

// GET  /api/events/:id/contributions — list contributions
router.get('/:id/contributions', optionalAuth, getContributions);

module.exports = router;
