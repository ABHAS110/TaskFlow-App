const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  // Validate passwords match
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  // Create the user
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  });

  if (!user) {
    res.status(500);
    throw new Error('Failed to create user. Please try again.');
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token,
    },
  });
});

/**
 * @desc    Login user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  // Find user by email
  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token,
    },
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

module.exports = { register, login, getProfile };
