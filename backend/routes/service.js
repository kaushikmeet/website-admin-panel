const express = require('express');
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

// Get all blogs
router.get('/service', (req, res) => {
  const query = `SELECT id, title, description, image_url FROM service`;
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
router.get('/service/:id', (req, res) => {
  const blogId = req.params.id;

  const query = 'SELECT * FROM service WHERE id = ?';
  db.query(query, [blogId], (err, results) => {
    if (err) {
      console.error('Error fetching service by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'service post not found' });
    }

    res.status(200).json(results[0]); 
  });
});

// Create a new blog
router.post('/service', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
  const query = `INSERT INTO service (title, description, image_url) VALUES (?, ?, ?)`;
  db.execute(query, [title, description, imageUrl], (err, results) => {
    if (err) {
      console.error('Error inserting service:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'service created successfully', serviceId: results.insertId });
  });
});

// Update a blog
router.put('/service/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  let query = `UPDATE service SET title = ?, description = ? WHERE id = ?`;
  let params = [title, description, id];

  if (imageUrl) {
    query = `UPDATE service SET title = ?, description = ?, image_url = ? WHERE id = ?`;
    params = [title, description, imageUrl, id];
  }

  db.execute(query, params, (err, results) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'service post not found' });
    }
    res.status(200).json({ message: 'service updated successfully' });
  });
});

// Delete a blog
router.delete('/service/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM service WHERE id = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting service:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'service not found' });
    }
    res.status(200).json({ message: 'service deleted successfully' });
  });
});

router.get('/dashboard/service-count', (req, res) => {
  const query = `SELECT COUNT(*) AS total_services FROM service`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching project count:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ total_services: results[0].total_services });
  });
});

module.exports = router;
