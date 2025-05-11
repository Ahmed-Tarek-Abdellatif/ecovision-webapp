const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

// MongoDB connection string
const mongoURI = "mongodb://localhost:27017/your-database-name";

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api/auth', authRoutes);  // Prefix all routes in authRoutes with /api/auth

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend Server is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
