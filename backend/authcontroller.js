const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./server'); // Your MySQL connection

// Register new user
exports.register = (req, res) => {
    const { username, email, password, role } = req.body;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Find the role_id based on the role
    const queryRole = `SELECT id FROM roles WHERE name = ?`;
    db.query(queryRole, [role], (err, results) => {
        if (err) return res.status(500).json({ message: 'Role not found' });

        const roleId = results[0].id;

        // Insert user
        const queryUser = `INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)`;
        db.query(queryUser, [username, email, hashedPassword, roleId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error registering user' });
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

// Login user and generate JWT token
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const queryUser = `SELECT users.*, roles.name as role_name FROM users INNER JOIN roles ON users.role_id = roles.id WHERE email = ?`;
    db.query(queryUser, [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });

        const user = results[0];

        // Compare hashed passwords
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role_name }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ token });
    });
};
