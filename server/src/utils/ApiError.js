class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from bugs
    
    // Captures the stack trace excluding the constructor itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;