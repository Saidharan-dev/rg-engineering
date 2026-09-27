const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./config/db');
const authRoutes    = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const architectRoutes = require('./routes/architects');
const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 3001;

async function ensureDefaultAdmin() {
  try {
    const [rows] = await db.query(
      "SELECT id, password_hash FROM admin_users WHERE username = 'admin' LIMIT 1"
    );

    const correctHash = await bcrypt.hash('admin123', 10);

    if (rows.length === 0) {
      await db.query(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['admin', correctHash]
      );
      console.log('✅ Default admin user created with password: admin123');
      return;
    }

    const isCorrect = await bcrypt.compare('admin123', rows[0].password_hash);

    if (!isCorrect) {
      await db.query(
        'UPDATE admin_users SET password_hash = ? WHERE username = ?',
        [correctHash, 'admin']
      );
      console.log('✅ Default admin password reset to: admin123');
    }
  } catch (error) {
    console.error('Admin init failed:', error.message);
  }
}

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

ensureDefaultAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
