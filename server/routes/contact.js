const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../config/db');
const verifyToken = require('../middleware/verifyToken');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact - public, submit an enquiry
router.post('/', async (req, res) => {
  const { name, email, phone, project_type, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    // 1. Save to database
    const [result] = await db.query(
      `INSERT INTO enquiries (name, email, phone, project_type, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, project_type || null, message]
    );

    // 2. Notify admin via email
    await transporter.sendMail({
      from: `"RG Engineering Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Enquiry from ${name}`,
      html: `
        <h2>New Project Enquiry</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${phone || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Project Type</td><td style="padding:8px">${project_type || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${message}</td></tr>
        </table>
        <p style="margin-top:16px;color:#888">Enquiry ID: #${result.insertId}</p>
      `,
    });

    // 3. Send acknowledgement to customer
    await transporter.sendMail({
      from: `"RG Engineering Excellence" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your enquiry — RG Engineering Excellence',
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>We have received your enquiry and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong><br/>${message}</p>
        <br/>
        <p>RG Engineering Excellence Pvt. Ltd.<br/>
        Trichy, Tamil Nadu<br/>
        +91-9842872691</p>
      `,
    });

    res.status(201).json({ message: 'Enquiry submitted successfully.', id: result.insertId });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/enquiries - admin only, get all enquiries
router.get('/', verifyToken, async (req, res) => {
  const { status } = req.query; // 'pending' or 'answered'
  try {
    let query = 'SELECT * FROM enquiries';
    const params = [];

    if (status === 'pending' || status === 'answered') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get enquiries error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/enquiries/stats - admin only, counts for dashboard
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM enquiries');
    const [[{ pending }]] = await db.query("SELECT COUNT(*) as pending FROM enquiries WHERE status = 'pending'");
    const [[{ answered }]] = await db.query("SELECT COUNT(*) as answered FROM enquiries WHERE status = 'answered'");
    const [[{ projects }]] = await db.query('SELECT COUNT(*) as projects FROM projects');
    res.json({ total, pending, answered, projects });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/enquiries/:id/reply - admin only, reply and mark as answered
router.post('/:id/reply', verifyToken, async (req, res) => {
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({ message: 'Reply message is required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Enquiry not found.' });

    const enquiry = rows[0];

    if (enquiry.status === 'answered') {
      return res.status(400).json({ message: 'This enquiry has already been answered.' });
    }

    // 1. Send reply email to customer
    await transporter.sendMail({
      from: `"RG Engineering Excellence" <${process.env.EMAIL_USER}>`,
      to: enquiry.email,
      subject: 'Response to your enquiry — RG Engineering Excellence',
      html: `
        <h2>Dear ${enquiry.name},</h2>
        <p>Thank you for reaching out to us. Here is our response to your enquiry:</p>
        <blockquote style="border-left:4px solid #C9A84C;padding-left:16px;margin:16px 0;color:#444">
          ${reply}
        </blockquote>
        <p><strong>Your original message:</strong><br/>${enquiry.message}</p>
        <br/>
        <p>Feel free to reply to this email or call us at <strong>+91-9842872691</strong> for further assistance.</p>
        <br/>
        <p>Warm regards,<br/>
        R. Ganesan<br/>
        RG Engineering Excellence Pvt. Ltd.<br/>
        Trichy, Tamil Nadu</p>
      `,
    });

    // 2. Mark as answered in DB
    await db.query(
      `UPDATE enquiries
       SET status = 'answered', admin_reply = ?, replied_at = NOW()
       WHERE id = ?`,
      [reply, req.params.id]
    );

    const [updated] = await db.query('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Reply sent and enquiry marked as answered.', enquiry: updated[0] });
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ message: 'Server error. Could not send reply.' });
  }
});

module.exports = router;
