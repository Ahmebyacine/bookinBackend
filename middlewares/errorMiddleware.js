const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Send formatted error for production
const sendErrorForProd = (err, res) =>
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || 'Something went wrong while processing your request.',
  });

// Handle JWT invalid signature
const handleJwtInvalidSignature = () =>
  new ApiError('Invalid token, please login again.', 401);

// Handle JWT expired token
const handleJwtExpired = () =>
  new ApiError('Expired token, please login again.', 401);

// Handle validation errors and merge them into a single message
const handleValidationErrors = (errors) => {
  const errorMsg = errors.array().map((err) => err.msg).join(', ');
  return new ApiError(errorMsg, 400);
};

const globalError = (err, req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    err = handleValidationErrors(errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
  if (err.name === 'TokenExpiredError') err = handleJwtExpired();

  // Default status code and status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send the error response
  sendErrorForProd(err, res);
};

module.exports = globalError;
