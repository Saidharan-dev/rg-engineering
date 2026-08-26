const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const architectRoutes = require('./routes/architects');
const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.ADMIN_URL  || 'http://localhost:5174',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded images statically ──────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/architects', architectRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/enquiries', contactRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.message?.includes('image files are allowed')) {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image files must be 5MB or smaller.' });
  }
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
