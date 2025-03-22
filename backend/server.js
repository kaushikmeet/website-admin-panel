const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blogs');
const newsRoutes = require('./routes/news');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', userRoutes);
app.use('/api', blogRoutes);
app.use('/api', newsRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
