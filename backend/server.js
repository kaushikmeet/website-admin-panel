const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));

let db;
function handleDisconnect(){
  db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'okdigbq1_root',
    password: 'PyqCDKDWnVMT',
    database: 'okdigbq1_mydatabase',
    port: 3306
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); 
    } else {
      console.log('Connected to MySQL!');
    }
  });

  db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connection to MySQL lost. Reconnecting...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}
handleDisconnect();

// diskstorage
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
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching data:', err);
          res.status(500).send('Error fetching data');
      } else {
          res.json(results);
      }
  });
});


app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT users.id, users.username, roles.name 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE users.id = ?`;

  db.execute(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(results[0]);
  });
});

app.post('/register', async (req, res) => {
  const { username, password, roleId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)',
    [username, hashedPassword, roleId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'User registered!' });
    }
  );
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length) return res.status(400).json({ message: 'User not found' });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

      const token = jwt.sign({ userId: user.id, roleId: user.role_id }, 'secretkey', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    req.roleId = decoded.roleId;
    next();
  });
};

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

// blog-api
app.get('/api/blogs', (req, res) => {
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

app.get('/api/blogs/:id', (req, res) => {
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

    res.status(200).json(results[0]);  // Send the blog post data
  });
});

app.post('/api/blogs', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = slugify(title, { lower: true, strict: true });

  const query = `INSERT INTO blogs (title, description, image_url, slug) VALUES (?, ?, ?, ?)`;
  db.execute(query, [title, description, imageUrl, slug], (err, results) => {
    if (err) {
      console.error('Error inserting blog:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Blog created successfully', blogId: results.insertId });
  });
});

// Update Blog API
app.put('/api/blogs/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body; 
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = slugify(title, { lower: true, strict: true });

  let query = `UPDATE blogs SET title = ?, description = ?, slug = ? WHERE id = ?`;
  let params = [title, description, slug, id];

  if (imageUrl) {
    query = `UPDATE blogs SET title = ?, description = ?, image_url = ?, slug = ? WHERE id = ?`;
    params = [title, description, imageUrl, slug, id];
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


// Delete Blog API
app.delete('/api/blogs/:id', (req, res) => {
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
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
