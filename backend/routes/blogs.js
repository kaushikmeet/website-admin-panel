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
router.get('/all-blogs', (req, res) => {
  const query = `SELECT id, title, description, image_url, slug FROM blogs`;
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
router.get('/blogs/:id', (req, res) => {
  const blogId = req.params.id;

  const query = 'SELECT * FROM blogs WHERE id = ?';
  db.query(query, [blogId], (err, results) => {
    if (err) {
      console.error('Error fetching blog by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(results[0]); 
  });
});


// blogs.js (Express route)
router.get('/blogs', (req, res) => {
  const blogSlug = req.query.slug;

  if (!blogSlug) {
    return res.status(400).json({ error: 'Slug is required' });
  }
  const query = 'SELECT * FROM blogs WHERE slug = ?';
  db.query(query, [blogSlug], (err, results) => {
    if (err) {
      console.error('Error fetching blog by slug:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(results[0]);  // Return the blog post
  });
});


// Create a new blog
router.post('/blogs', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = slugify(title, { lower: true, strict: true });
  const plainTextDescription = htmlToText(description);


  const query = `INSERT INTO blogs (title, description, plain_text_description,  image_url, slug) VALUES (?, ?, ?, ?, ?)`;
  db.execute(query, [title, description, plainTextDescription, imageUrl, slug], (err, results) => {
    if (err) {
      console.error('Error inserting blog:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Blog created successfully', blogId: results.insertId });
  });
});

// Update a blog
router.put('/blogs/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const plainTextDescription = htmlToText(description);

  let query = `UPDATE blogs SET title = ?, description = ?, plain_text_description = ?, slug = ? WHERE id = ?`;
  let params = [title, description, plainTextDescription, slug, id];

  if (imageUrl) {
    query = `UPDATE blogs SET title = ?, description = ?, plain_text_description = ?, image_url = ?, slug = ? WHERE id = ?`;
    params = [title, description, imageUrl, plainTextDescription, slug, id];
  }

  db.execute(query, params, (err, results) => {
    if (err) {
      console.error('Error updating blog:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog updated successfully' });
  });
});

// Delete a blog
router.delete('/blogs/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM blogs WHERE id = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting blog:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  });
});

router.get('/dashboard/blog-count', (req, res) => {
  const query = `SELECT COUNT(*) AS total_blogs FROM blogs`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching blog count:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ total_blogs: results[0].total_blogs });
  });
});

module.exports = router;
