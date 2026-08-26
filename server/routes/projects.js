const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

// GET /api/projects - public
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM projects';
    const params = [];
    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY featured DESC, created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/projects/:id - public
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Project not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/projects - admin only, with optional image upload
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const { title, category, architect, description, featured } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: 'Title and category are required.' });
  }

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await db.query(
      `INSERT INTO projects (title, category, architect, description, image_url, featured)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, category, architect || null, description || null, image_url, featured === 'true' ? 1 : 0]
    );
    const [newProject] = await db.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(newProject[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/projects/:id - admin only, with optional image upload
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  const { title, category, architect, description, featured } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Project not found.' });

    const project = existing[0];

    // If new image uploaded, delete old one
    let image_url = project.image_url;
    if (req.file) {
      if (project.image_url && project.image_url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', project.image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      `UPDATE projects SET title=?, category=?, architect=?, description=?, image_url=?, featured=? WHERE id=?`,
      [
        title ?? project.title,
        category ?? project.category,
        architect ?? project.architect,
        description ?? project.description,
        image_url,
        featured !== undefined ? (featured === 'true' ? 1 : 0) : project.featured,
        req.params.id,
      ]
    );

    const [updated] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/projects/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Project not found.' });

    // Delete image file if exists
    const project = existing[0];
    if (project.image_url && project.image_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', project.image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
