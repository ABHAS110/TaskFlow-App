const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for the given user ID.
 * @param {string} id - The user's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
