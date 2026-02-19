// Error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 5MB limit',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files uploaded',
        code: 'TOO_MANY_FILES'
      });
    }
  }

  // Custom file validation errors
  if (err.message && err.message.includes('Only VCF files')) {
    return res.status(400).json({
      success: false,
      error: err.message,
      code: 'INVALID_FILE_TYPE'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Database errors
  if (err.name === 'MongoError' || err.name === 'MongoParseError') {
    return res.status(500).json({
      success: false,
      error: 'Database error',
      code: 'DATABASE_ERROR'
    });
  }

  // VCF parsing errors
  if (err.message && err.message.includes('VCF')) {
    return res.status(400).json({
      success: false,
      error: err.message,
      code: 'VCF_PARSE_ERROR'
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR'
  });
};

module.exports = errorHandler;
