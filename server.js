require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const analyzeRoute = require('./routes/analyze');
const generateRoute = require('./routes/generate');
const publishRoute = require('./routes/publish');
const analyticsRoute = require('./routes/analytics');
const learnings = require('./services/learnings');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve locally-rendered slide images
app.use('/generated', express.static(path.join(__dirname, 'public', 'generated')));

// Serve the frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/analyze', analyzeRoute);
app.use('/api/generate', generateRoute);
app.use('/api/publish', publishRoute);
app.use('/api/analytics', analyticsRoute);

app.get('/api/state', (req, res) => {
  res.json(learnings.getState());
});

app.listen(PORT, () => {
  console.log(`\n  viraloop running -> http://localhost:${PORT}\n`);
  console.log('  Image generation runs 100% locally via Playwright — no API key, no credits needed.\n');
});
