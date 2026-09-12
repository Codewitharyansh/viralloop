const express = require('express');
const { buildSlides } = require('../services/promptBuilder');
const { renderCarouselImages } = require('../services/slideRenderer');
const learnings = require('../services/learnings');

const router = express.Router();

/**
 * POST /api/generate
 * Body: { analysis: {...} }  (from /api/analyze)
 * Builds slide copy, then renders all 6 slides as real PNGs locally via
 * Playwright — free, no external API, no credits required.
 */
router.post('/', async (req, res) => {
  const { analysis } = req.body;
  if (!analysis) {
    return res.status(400).json({ error: 'Body must include "analysis" (from /api/analyze).' });
  }

  const state = learnings.getState();
  const slides = buildSlides(analysis, state);

  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const slidesWithImages = await renderCarouselImages(slides, {
      brandName: analysis.name,
      baseUrl,
    });

    res.json({
      slides: slidesWithImages,
      appliedLearnings: state.bestPerforming,
    });
  } catch (err) {
    console.error('[generate] image rendering failed:', err.message);
    res.status(502).json({
      error: `Slide copy was built but image rendering failed: ${err.message}`,
      slidesCopyOnly: slides,
    });
  }
});

module.exports = router;
