# Viraloop

Turn any website into a viral Instagram carousel — and learn from every post.

Drop in a URL, and Viraloop scrapes the page, writes 6 slides of carousel
copy (Hook → Problem → Agitation → Solution → Feature → CTA), renders
each slide as a real image, and logs the post so future carousels can
learn from what's worked before.

## Features

- **Analyze** — scrapes any public URL (title, description, headlines,
  value props) with Playwright. No login, no scraping behind a wall.
- **Generate** — writes 6 slides of on-brand carousel copy and renders
  each one as a real 1080×1350 PNG, entirely **locally and for free**
  (no paid AI image API, no credits, no API key).
- **Publish** — logs the finished post locally (caption + image files)
  so your posting history and learning loop keep growing. Auto-posting
  straight to Instagram isn't wired up out of the box (see below).
- **Learnings** — every logged post is tracked in a local JSON file, so
  future carousels can be nudged toward what's performed best.

## Tech stack

- **Backend:** Node.js + Express
- **Image rendering:** Playwright (headless Chromium screenshots styled
  HTML slides — no external AI service involved)
- **Frontend:** Vanilla HTML/CSS/JS (no build step, no framework)
- **Storage:** A single local JSON file (`backend/data/learnings.json`)
  — no database required

## Project structure

```
viraloop/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── routes/
│   │   ├── analyze.js         # POST /api/analyze
│   │   ├── generate.js        # POST /api/generate
│   │   ├── publish.js         # POST /api/publish
│   │   └── analytics.js       # GET  /api/analytics
│   ├── services/
│   │   ├── scraper.js         # Reads a URL with Playwright
│   │   ├── promptBuilder.js   # Turns scraped data into slide copy
│   │   ├── slideRenderer.js   # Renders slide copy into PNG images
│   │   └── learnings.js       # Local JSON-backed post history
│   ├── data/learnings.json    # Logged posts (auto-created)
│   ├── public/generated/      # Rendered slide images (auto-created)
│   └── .env.example
└── frontend/
    ├── index.html
    ├── app.js
    └── style.css
```

## Setup

Requires [Node.js](https://nodejs.org) 18 or higher.

```bash
git clone https://github.com/YOUR-USERNAME/viraloop.git
cd viraloop/backend
npm install
npx playwright install chromium
cp .env.example .env
npm start
```

Then open **http://localhost:4000**

No API keys are required to run the app — everything works out of the
box.

## How it works

1. **Paste a URL** and click Analyze. Viraloop loads the page in a
   headless browser and pulls out its title, meta description,
   headings, and body copy.
2. Click **Generate 6 slides**. The scraped info is turned into 6
   slides of carousel copy, then each slide is rendered as a styled
   PNG by loading an HTML template in Chromium and taking a
   screenshot — this is what replaces a paid AI image-generation API.
3. Click **Publish**. The post (images + caption) is logged locally.
   Download the slides individually or all at once, then post them to
   Instagram manually — or wire up real auto-publishing (see below).

## Adding real Instagram auto-publishing (optional)

`backend/routes/publish.js` currently just logs the post locally. To
make it actually post to Instagram, you'd integrate
[Meta's Graph API](https://developers.facebook.com/docs/instagram-api),
which requires:

- A Facebook Developer app
- An Instagram **Business** or **Creator** account, connected to a
  Facebook Page
- A long-lived access token

Meta's API itself is free to use — the setup is just a one-time
process. Once you have a token, replace the logic in `publish.js` with
calls to the Graph API's `/media` (create) and `/media_publish`
(publish) endpoints.

## Environment variables

See `backend/.env.example` for the full list. None are required to
run the app locally — `IG_USERNAME` is just a label shown in the UI
and doesn't need to be a real, verified account.

## License

MIT
