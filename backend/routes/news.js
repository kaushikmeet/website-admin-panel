const express = require('express');
const slugify = require('slugify');
const multer = require('multer');
const db = require('../db');
const router = express.Router();
const path = require('path');
const fs = require('fs');

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

// Get all newss
router.get('/news', (req, res) => {
  const query = `SELECT id, title, description, image_url, slug FROM news`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Get news by ID
router.get('/news/:id', (req, res) => {
  const newsId = req.params.id;

  const query = 'SELECT * FROM news WHERE id = ?';
  db.query(query, [newsId], (err, results) => {
    if (err) {
      console.error('Error fetching news by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'news post not found' });
    }

    res.status(200).json(results[0]); 
  });
});

// Create a new news
router.post('/news', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = slugify(title, { lower: true, strict: true });

  const query = `INSERT INTO news (title, description, image_url, slug) VALUES (?, ?, ?, ?)`;
  db.execute(query, [title, description, imageUrl, slug], (err, results) => {
    if (err) {
      console.error('Error inserting news:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'news created successfully', newsId: results.insertId });
  });
});

// Update a news
router.put('/news/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  let query = `UPDATE news SET title = ?, description = ?, slug = ? WHERE id = ?`;
  let params = [title, description, slug, id];

  if (imageUrl) {
    query = `UPDATE news SET title = ?, description = ?, image_url = ?, slug = ? WHERE id = ?`;
    params = [title, description, imageUrl, slug, id];
  }

  db.execute(query, params, (err, results) => {
    if (err) {
      console.error('Error updating news:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'news post not found' });
    }
    res.status(200).json({ message: 'news updated successfully' });
  });
});

// Delete a news
router.delete('/news/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM news WHERE id = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting news:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'news not found' });
    }
    res.status(200).json({ message: 'news deleted successfully' });
  });
});

router.get('/dashboard/news-count', (req, res) => {
  const query = `SELECT COUNT(*) AS total_news FROM news`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching news count:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ total_news: results[0].total_news });
  });
});

module.exports = router;
