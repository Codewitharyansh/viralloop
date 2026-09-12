/**
 * slideRenderer.js
 * Renders each slide as a real 1080x1350 PNG by loading a styled HTML
 * template in headless Chromium (Playwright) and screenshotting it.
 * This replaces a paid AI image-generation API entirely — no credits,
 * no external service, no API key. It produces clean, on-brand
 * "text carousel" slides, a legitimate and common Instagram style for
 * educational / business content.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'generated');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PALETTES = [
  { bg1: '#0f172a', bg2: '#1e293b', accent: '#f59e0b', text: '#f8fafc' },
  { bg1: '#1a1030', bg2: '#2d1b4e', accent: '#22d3ee', text: '#f5f3ff' },
  { bg1: '#052e16', bg2: '#14532d', accent: '#facc15', text: '#f0fdf4' },
  { bg1: '#3b0764', bg2: '#581c87', accent: '#fb7185', text: '#fdf4ff' },
  { bg1: '#1e1b4b', bg2: '#312e81', accent: '#34d399', text: '#eef2ff' },
];

function pickPalette(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  const index = parseInt(hash.slice(0, 8), 16) % PALETTES.length;
  return PALETTES[index];
}

function renderTemplate({ headline, body, slideNumber, totalSlides, role, brandName, palette }) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1350px;
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(160deg, ${palette.bg1} 0%, ${palette.bg2} 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 96px;
    position: relative;
    overflow: hidden;
  }
  .badge {
    position: absolute;
    top: 64px;
    left: 96px;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${palette.accent};
  }
  .counter {
    position: absolute;
    top: 64px;
    right: 96px;
    font-size: 28px;
    font-weight: 600;
    color: ${palette.text};
    opacity: 0.6;
  }
  .accent-line {
    width: 96px;
    height: 8px;
    background: ${palette.accent};
    border-radius: 4px;
    margin-bottom: 40px;
  }
  h1 {
    font-size: 84px;
    line-height: 1.08;
    font-weight: 800;
    color: ${palette.text};
    margin-bottom: 48px;
    max-width: 900px;
  }
  p {
    font-size: 40px;
    line-height: 1.4;
    font-weight: 400;
    color: ${palette.text};
    opacity: 0.85;
    max-width: 840px;
  }
  .brand {
    position: absolute;
    bottom: 64px;
    left: 96px;
    font-size: 30px;
    font-weight: 700;
    color: ${palette.text};
    opacity: 0.5;
  }
</style>
</head>
<body>
  <div class="badge">${escapeHtml(role)}</div>
  <div class="counter">${slideNumber} / ${totalSlides}</div>
  <div class="accent-line"></div>
  <h1>${escapeHtml(headline)}</h1>
  <p>${escapeHtml(body)}</p>
  <div class="brand">${escapeHtml(brandName)}</div>
</body>
</html>`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Renders all slides for one carousel using a single shared browser
 * instance and a single shared color palette (derived from the brand
 * name) so the set reads as one coherent carousel.
 */
async function renderCarouselImages(slides, { brandName = 'Viraloop', baseUrl = '' } = {}) {
  const palette = pickPalette(brandName);
  const browser = await chromium.launch();
  const results = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

    for (const slide of slides) {
      const html = renderTemplate({
        headline: slide.headline,
        body: slide.body,
        slideNumber: slide.slideNumber,
        totalSlides: slides.length,
        role: slide.role,
        brandName,
        palette,
      });

      await page.setContent(html, { waitUntil: 'load' });

      const filename = `slide-${slide.slideNumber}-${crypto.randomUUID()}.png`;
      const filePath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: filePath });

      results.push({ ...slide, imageUrl: `${baseUrl}/generated/${filename}` });
    }
  } finally {
    await browser.close();
  }

  return results;
}

module.exports = { renderCarouselImages };
