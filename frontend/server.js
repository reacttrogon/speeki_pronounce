import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Serve images directly at the root level to match relative paths
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Serve images from speeki_pronounce/images as well
app.use('/speeki_pronounce/images', express.static(path.join(__dirname, 'public', 'images')));

// CRITICAL: Handle relative image paths from index.html/ subdirectory
app.use('/speeki_pronounce/index.html/images', express.static(path.join(__dirname, 'public', 'images')));

// Serve all static files from dist
app.use('/speeki_pronounce', express.static(path.join(__dirname, 'dist')));

// Handle the main route with trailing slash
app.get('/speeki_pronounce/index.html/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Redirect variations to the correct URL
app.get('/speeki_pronounce/index.html', (req, res) => {
  const queryString = req.url.split('?')[1] || '';
  res.redirect(`/speeki_pronounce/index.html/${queryString ? '?' + queryString : ''}`);
});

app.get('/speeki_pronounce/', (req, res) => {
  const queryString = req.url.split('?')[1] || '';
  res.redirect(`/speeki_pronounce/index.html/${queryString ? '?' + queryString : ''}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`App available at: http://localhost:${PORT}/speeki_pronounce/index.html/`);
});
