const express = require('express');
const { analyzeUrl } = require('../services/scraper');

const router = express.Router();

/**
 * POST /api/analyze
 * Body: { url: "https://..." }
 */
router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Body must include "url".' });
  }

  try {
    const analysis = await analyzeUrl(url);
    res.json({ analysis });
  } catch (err) {
    console.error('[analyze] failed:', err.message);
    res.status(502).json({ error: `Could not analyze ${url}: ${err.message}` });
  }
});

module.exports = router;
