// Minimal maintenance server to avoid running any external code or secrets
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;
const STATIC_DIR = path.join(__dirname, 'public');

// Serve a simple maintenance page and healthcheck only
app.get('/health', (req, res) => {
  res.json({ status: 'maintenance' });
});

app.get('/', (req, res) => {
  const indexPath = path.join(STATIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  return res.status(503).send('Site temporarily unavailable');
});

// Do not expose any other endpoints
app.all('*', (req, res) => {
  res.status(503).send('Service temporarily unavailable');
});

app.listen(PORT, () => console.log(`Maintenance server listening on ${PORT}`));
