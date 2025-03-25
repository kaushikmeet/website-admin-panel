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

router.post('/sliders', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
    const query = 'INSERT INTO sliders (title, description, image_url) VALUES (?, ?, ?)';
    const params = [title, description, imageUrl];
  
    db.execute(query, params, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ message: 'Slider created successfully', sliderId: result.insertId });
    });
  });

  router.get('/sliders', (req, res) => {
    const query = 'SELECT * FROM sliders';
    
    db.execute(query, (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(200).json(results);
    });
  });

  router.get('/sliders/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM sliders WHERE id = ?';
    
    db.execute(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(404).json({ error: 'Slider not found' });
      res.status(200).json(results[0]);
    });
  });

  router.put('/sliders/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
    let query = 'UPDATE sliders SET title = ?, description = ? WHERE id = ?';
    let params = [title, description, id];
  
    if (imageUrl) {
      query = 'UPDATE sliders SET title = ?, description = ?, image_url = ? WHERE id = ?';
      params = [title, description, imageUrl, id];
    }
  
    db.execute(query, params, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Slider not found' });
      res.status(200).json({ message: 'Slider updated successfully' });
    });
  });

  router.delete('/sliders/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM sliders WHERE id = ?';
  
    db.execute(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Slider not found' });
      res.status(200).json({ message: 'Slider deleted successfully' });
    });
  });

  router.get('/sliders/type/:slider_type', (req, res) => {
    const { slider_type } = req.params;
    const query = 'SELECT * FROM sliders WHERE slider_type = ?';
    
    db.execute(query, [slider_type], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(200).json(results);
    });
  });
  

  module.exports = router;