const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authenticated. Please log in.');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token using our secret
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Find the user in the DB (in case they were deleted since the token was issued)
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      throw new ApiError(401, 'User no longer exists.');
    }

    // Attach user to the request object
    req.user = user;
    next(); // Move to the next controller
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token.'));
    }
    next(err);
  }
}

module.exports = requireAuth;