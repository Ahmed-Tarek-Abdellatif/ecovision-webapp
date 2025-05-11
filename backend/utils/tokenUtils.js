// backend/utils/tokenUtils.js

const jwt = require('jsonwebtoken'); // Import JWT

// Function to generate JWT tokens
exports.generateToken = ({ payload, options }) => {
  // Replace 'yourSecretKey' with your actual secret key or load from environment variables
  const secretKey = process.env.SECRET_KEY || 'yourSecretKey';

  // Generate the token
  return jwt.sign(payload, secretKey, options);
};
