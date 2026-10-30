const env = require('../config/env');

function errorHandler(err, req, res, next) {
  // 1. Default to 500 if no status code was set
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // 2. Handle Mongoose duplicate key errors (e.g., creating a category with a name that already exists)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with that value already exists.';
  }

  // 3. Log the error if it's a real 500 crash, so we can debug it
  if (statusCode === 500) {
    console.error('💥 SERVER ERROR:', err);
  }

  // 4. Send the JSON response
  res.status(statusCode).json({
    error: {
      message,
      // Only show the stack trace in development
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;