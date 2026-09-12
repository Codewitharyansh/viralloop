/**
 * scraper.js
 * Loads a public URL with Playwright and pulls out the raw material an
 * LLM-free heuristic (see promptBuilder.js) needs to build carousel copy:
 * title, meta description, headline text, and bullet-ish lines.
 */

const { chromium } = require('playwright');

async function analyzeUrl(url) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (ViraloopBot/1.0)' });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const data = await page.evaluate(() => {
      const text = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
      const metaContent = (name) =>
        document.querySelector(`meta[name="${name}"]`)?.content ||
        document.querySelector(`meta[property="${name}"]`)?.content ||
        '';

      const headings = Array.from(document.querySelectorAll('h1, h2'))
        .map((h) => h.textContent.trim())
        .filter(Boolean)
        .slice(0, 8);

      const paragraphs = Array.from(document.querySelectorAll('p'))
        .map((p) => p.textContent.trim())
        .filter((t) => t.length > 30)
        .slice(0, 8);

      return {
        title: text('title') || metaContent('og:title'),
        description: metaContent('description') || metaContent('og:description'),
        headings,
        paragraphs,
      };
    });

    return buildAnalysis(url, data);
  } finally {
    await browser.close();
  }
}

function buildAnalysis(url, data) {
  const name = data.title.split(/[-|·]/)[0].trim() || new URL(url).hostname.replace('www.', '');
  const tagline = data.title;
  const description = data.description || data.paragraphs[0] || '';

  const valueProps = data.headings.slice(0, 3);
  const features = data.paragraphs.slice(0, 2);

  return {
    url,
    name,
    tagline,
    description,
    valueProps: valueProps.length ? valueProps : [description].filter(Boolean),
    features: features.length ? features : ['No standout features detected — try a page with more marketing copy.'],
    competitors: [],
  };
}

module.exports = { analyzeUrl };
