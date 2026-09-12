const express = require('express');
const learnings = require('../services/learnings');

const router = express.Router();

/**
 * POST /api/publish
 * Body: { imageUrls: [...], caption: "..." }
 *
 * No paid publishing API is wired up. This logs the "post" locally (so
 * the learnings loop and the "posts logged" counter still work end to
 * end) and returns the image files so you can manually post them, or
 * swap this for Meta's Graph API later if you want real auto-publishing.
 */
router.post('/', async (req, res) => {
  const { imageUrls, caption } = req.body;
  if (!imageUrls || !imageUrls.length) {
    return res.status(400).json({ error: 'Body must include "imageUrls" (from /api/generate).' });
  }

  const username = process.env.IG_USERNAME || 'your_account';
  const state = learnings.recordPost({
    username,
    imageUrls,
    caption,
    score: 0, // update later via /api/analytics once you have real engagement numbers
  });

  res.json({
    published: false,
    note: 'Auto-publishing to Instagram is not wired up (that requires Meta Graph API credentials). This post was logged locally instead — download the images below and post manually, or add real publishing later.',
    imageUrls,
    caption,
    postsLogged: state.postsLogged,
  });
});

module.exports = router;
