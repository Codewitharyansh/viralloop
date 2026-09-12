const express = require('express');
const learnings = require('../services/learnings');

const router = express.Router();

/**
 * GET /api/analytics
 * Returns locally logged posts. Real engagement numbers (likes, saves,
 * reach) would need to come from Instagram's Graph API — not included
 * here since it requires paid/verified app credentials.
 */
router.get('/', (req, res) => {
  const state = learnings.getState();
  res.json(state);
});

module.exports = router;
