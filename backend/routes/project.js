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
router.get('/project', (req, res) => {
  const query = `SELECT id, title, description, image_url FROM project`;
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
router.get('/project/:id', (req, res) => {
  const blogId = req.params.id;

  const query = 'SELECT * FROM project WHERE id = ?';
  db.query(query, [blogId], (err, results) => {
    if (err) {
      console.error('Error fetching project by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'project post not found' });
    }

    res.status(200).json(results[0]); 
  });
});

// Create a new blog
router.post('/project', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `INSERT INTO project (title, description, image_url) VALUES (?, ?, ?)`;
  db.execute(query, [title, description, imageUrl, slug], (err, results) => {
    if (err) {
      console.error('Error inserting project:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'project created successfully', blogId: results.insertId });
  });
});

// Update a blog
router.put('/project/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  let query = `UPDATE project SET title = ?, description = ? WHERE id = ?`;
  let params = [title, description, id];

  if (imageUrl) {
    query = `UPDATE project SET title = ?, description = ?, image_url = ? WHERE id = ?`;
    params = [title, description, imageUrl, id];
  }

  db.execute(query, params, (err, results) => {
    if (err) {
      console.error('Error updating project:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'project post not found' });
    }
    res.status(200).json({ message: 'project updated successfully' });
  });
});

// Delete a blog
router.delete('/project/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM project WHERE id = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'project not found' });
    }
    res.status(200).json({ message: 'project deleted successfully' });
  });
});

router.get('/dashboard/project-count', (req, res) => {
  const query = `SELECT COUNT(*) AS total_projects FROM project`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching project count:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ total_projects: results[0].total_projects });
  });
});

module.exports = router;
