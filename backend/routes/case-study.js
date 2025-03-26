const express = require('express');
const slugify = require('slugify');
const multer = require('multer');
const db = require('../db');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { htmlToText } = require('html-to-text');

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Get all blogs
router.get('/case-study', (req, res) => {
  const query = `SELECT id, title, description, image_url, slug FROM casestudy`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Get blog by ID
router.get('/case-study/:id', (req, res) => {
  const blogId = req.params.id;

  const query = 'SELECT * FROM casestudy WHERE id = ?';
  db.query(query, [blogId], (err, results) => {
    if (err) {
      console.error('Error fetching blog by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'casestudy post not found' });
    }

    res.status(200).json(results[0]); 
  });
});

// Create a new blog
router.post('/case-study', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = slugify(title, { lower: true, strict: true });
  const plainTextDescription = htmlToText(description);

  const query = `INSERT INTO casestudy (title, description, plain_text_description, image_url, slug) VALUES (?, ?, ?, ?, ?)`;
  db.execute(query, [title, description, plainTextDescription, imageUrl, slug], (err, results) => {
    if (err) {
      console.error('Error inserting blog:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'casestudy created successfully', blogId: results.insertId });
  });
});

// Update a blog
router.put('/case-study/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const plainTextDescription = htmlToText(description);

  let query = `UPDATE casestudy SET title = ?, description = ?, plain_text_description = ?, slug = ? WHERE id = ?`;
  let params = [title, description, plainTextDescription, slug, id];

  if (imageUrl) {
    query = `UPDATE casestudy SET title = ?, description = ?, plain_text_description = ?, image_url = ?, slug = ? WHERE id = ?`;
    params = [title, description, plainTextDescription, imageUrl,  slug, id];
  }

  db.execute(query, params, (err, results) => {
    if (err) {
      console.error('Error updating casestudy:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'casestudy post not found' });
    }
    res.status(200).json({ message: 'casestudy updated successfully' });
  });
});

// Delete a blog
router.delete('/case-study/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM casestudy WHERE id = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting casestudy:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'casestudy not found' });
    }
    res.status(200).json({ message: 'casestudy deleted successfully' });
  });
});

router.get('/dashboard/casestudy-count', (req, res) => {
  const query = `SELECT COUNT(*) AS total_blogs FROM casestudy`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching blog count:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ total_blogs: results[0].total_blogs });
  });
});

module.exports = router;
