/**
 * learnings.js
 * Tiny local JSON-backed store of past posts and which hooks/styles did
 * best, so promptBuilder.js can nudge future slides toward what worked.
 * No external service required — this is just a file on disk.
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'learnings.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch {
    return { posts: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function getState() {
  const { posts } = readData();
  const bestPerforming = [...posts].sort((a, b) => (b.score || 0) - (a.score || 0))[0] || null;
  return { posts, bestPerforming, postsLogged: posts.length };
}

function recordPost(post) {
  const data = readData();
  data.posts.push({ ...post, loggedAt: new Date().toISOString() });
  writeData(data);
  return getState();
}

module.exports = { getState, recordPost };
