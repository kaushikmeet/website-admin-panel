const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
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

// Login User
router.post('/login', (req, res) => {
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

// Get all users
router.get('/users', (req, res) => {
  const query = `
    SELECT users.id, users.username, roles.name 
    FROM users 
    JOIN roles ON users.role_id = roles.id`;

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error fetching users and roles:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(results);
  });
});


// Get user by ID
router.get('/users/:id', (req, res) => {
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

router.get('/uesrs/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching users by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Users post not found' });
    }

    res.status(200).json(results[0]); 
  });
});

router.get('/dashboard/user-count', (req, res) => {
  const query = `SELECT COUNT(*) AS total_users FROM users`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user count:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ total_users: results[0].total_users });
  });
});

router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, roleName } = req.body;

  const findRoleQuery = 'SELECT id FROM roles WHERE name = ?';
  db.execute(findRoleQuery, [roleName], (err, roleResults) => {
    if (err) {
      console.error('Error fetching role ID:', err);
      return res.status(500).json({ error: 'Database error while fetching role' });
    }

    if (roleResults.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const roleId = roleResults[0].id;

    const updateUserQuery = 'UPDATE users SET username = ?, role_id = ? WHERE id = ?';
    db.execute(updateUserQuery, [username, roleId, id], (err, results) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Database error while updating user' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully' });
    });
  });
});

router.delete('/usres/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM users WHERE id = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Users not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
