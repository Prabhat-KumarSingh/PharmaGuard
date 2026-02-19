const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for VCF file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept common VCF mimetypes or files with .vcf extension
  const name = (file.originalname || '').toLowerCase();
  const mimetype = (file.mimetype || '').toLowerCase();

  const allowedByName = name.endsWith('.vcf');
  const allowedByMime = mimetype.includes('vcard') || mimetype.includes('vcf') || mimetype === 'text/plain' || mimetype === 'application/octet-stream' || mimetype.includes('text');

  if (allowedByName || allowedByMime) {
    cb(null, true);
  } else {
    cb(new Error('Only VCF files are accepted'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880) // 5MB default
  }
});

module.exports = upload;
