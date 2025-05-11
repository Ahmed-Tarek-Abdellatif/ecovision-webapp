// backend/models/User.js

const mongoose = require('mongoose');

// Define schema for the User model
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;

