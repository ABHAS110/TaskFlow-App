const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Middleware to protect routes.
 * Verifies the JWT from the Authorization header and attaches the user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized - user not found');
      }

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('Not authorized - invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Not authorized - token expired');
      }
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized - no token provided');
  }
});

module.exports = { protect };
