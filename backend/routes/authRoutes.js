const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rate limiter for auth routes: 100 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', protect, getProfile);

module.exports = router;
