const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

const ensureTable = db.query(`
  CREATE TABLE IF NOT EXISTS architects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    category VARCHAR(100),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

router.get('/', async (req, res) => {
  try {
    await ensureTable;
    const [architects] = await db.query('SELECT * FROM architects ORDER BY name ASC');
    const [projects] = await db.query(
      'SELECT id, title, category, architect FROM projects WHERE architect IS NOT NULL ORDER BY title ASC'
    );
    res.json(architects.map((architect) => ({
      ...architect,
      projects: projects.filter((project) => project.architect === architect.name),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', verifyToken, upload.single('logo'), async (req, res) => {
  const { name, location, category } = req.body;
  if (!name || !location || !category) {
    return res.status(400).json({ message: 'Name, location, and category are required.' });
  }

  try {
    await ensureTable;
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await db.query(
      'INSERT INTO architects (name, location, category, logo_url) VALUES (?, ?, ?, ?)',
      [name.trim(), location.trim(), category, logoUrl]
    );
    const [rows] = await db.query('SELECT * FROM architects WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...rows[0], projects: [] });
  } catch (err) {
    console.error(err);
    res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
      message: err.code === 'ER_DUP_ENTRY' ? 'An architect with this name already exists.' : 'Server error.',
    });
  }
});

router.put('/:id', verifyToken, upload.single('logo'), async (req, res) => {
  const { name, location, category } = req.body;
  try {
    await ensureTable;
    const [existing] = await db.query('SELECT * FROM architects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Architect not found.' });

    const architect = existing[0];
    let logoUrl = architect.logo_url;
    if (req.file) {
      if (logoUrl && logoUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', logoUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      logoUrl = `/uploads/${req.file.filename}`;
    }

    const nextName = name?.trim() || architect.name;
    await db.query(
      'UPDATE architects SET name=?, location=?, category=?, logo_url=? WHERE id=?',
      [nextName, location?.trim() || architect.location, category || architect.category, logoUrl, req.params.id]
    );
    if (nextName !== architect.name) {
      await db.query('UPDATE projects SET architect = ? WHERE architect = ?', [nextName, architect.name]);
    }
    const [updated] = await db.query('SELECT * FROM architects WHERE id = ?', [req.params.id]);
    const [projects] = await db.query('SELECT id, title, category, architect FROM projects WHERE architect = ?', [updated[0].name]);
    res.json({ ...updated[0], projects });
  } catch (err) {
    console.error(err);
    res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
      message: err.code === 'ER_DUP_ENTRY' ? 'An architect with this name already exists.' : 'Server error.',
    });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await ensureTable;
    const [existing] = await db.query('SELECT * FROM architects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Architect not found.' });
    const logoUrl = existing[0].logo_url;
    if (logoUrl && logoUrl.startsWith('/uploads/')) {
      const logoPath = path.join(__dirname, '..', logoUrl);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }
    await db.query('DELETE FROM architects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Architect deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;