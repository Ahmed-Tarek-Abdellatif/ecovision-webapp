// backend/controllers/authController.js

const User = require('../models/User');  // Make sure to import your User model
const { compare } = require('bcrypt');  // Assuming bcrypt for password comparison
const { generateToken } = require('../utils/tokenUtils');  // Your JWT generation logic


// Login controller
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return next(new Error('User does not exist', { cause: 404 }));
    }

    // Use await for bcrypt's compare function
    const matched = await compare(password, userExist.password);
    if (!matched) {
      return next(new Error('Incorrect password', { cause: 500 }));
    }

    if (userExist.isDeleted) {
      await User.updateOne({ _id: userExist._id }, { isDeleted: false });
    }

    const accessToken = generateToken({ payload: { email, id: userExist._id }, options: { expiresIn: '20d' } });
    const refreshToken = generateToken({ payload: { email, id: userExist._id }, options: { expiresIn: '2h' } });

    return res.status(200).json({
      message: 'Logged in successfully',
      success: true,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    next(error);  // Pass the error to the next middleware
  }
};


// Register controller
exports.register = async (req, res, next) => {
  const { userName, password, email, phone } = req.body;

  try {
    // Ensure user doesn't exist already
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const createdUser = await User.create({
      userName,
      email,
      phone,
      password,
      isActivated: true,
    });

    return res.status(200).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return res.status(500).json({ message: "Server error occurred during registration", error: error.message });
  }
};
