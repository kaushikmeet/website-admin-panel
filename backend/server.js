const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// MySQL connection setup
const db = mysql.createConnection({
    host: '162.241.85.21', 
    user: 'okdigbq1_root', 
    password: 'PyqCDKDWnVMT',
    database: 'okdigbq1_mydatabase'
});

// Test connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.post('/api/users', async (req, res) => {
    const { username, password, email, roles } = req.body;

    if (!username || !password || !email || !roles) {
        return res.status(400).json({ message: 'Please provide all required fields: username, password, email, roles.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const userSql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(userSql, [username, hashedPassword, email], (err, userResult) => {
            if (err) return res.status(500).json({ message: 'Error creating user.', err });

            const userId = userResult.insertId;

            // Assign roles to the user
            const roleSql = 'SELECT id FROM roles WHERE name IN (?)';
            db.query(roleSql, [roles], (err, roleResults) => {
                if (err) return res.status(500).json({ message: 'Error fetching roles.', err });

                const userRolesSql = 'INSERT INTO user_roles (user_id, role_id) VALUES ?';
                const userRolesData = roleResults.map(role => [userId, role.id]);

                db.query(userRolesSql, [userRolesData], (err) => {
                    if (err) return res.status(500).json({ message: 'Error assigning roles.', err });
                    res.status(201).json({ message: 'User created and roles assigned successfully!' });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
