const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

let db;
function handleDisconnect(){
  db = mysql.createConnection({
    host: '162.241.85.21',
    user: 'okdigbq1_root',
    password: 'PyqCDKDWnVMT',
    database: 'okdigbq1_mydatabase',
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

      // Role ID and other info is encoded into the token
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
