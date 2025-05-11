// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Define routes for login and registration
router.post('/login', login);
router.post('/register', register);

module.exports = router;