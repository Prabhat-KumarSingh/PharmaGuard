// middleware/upload.js
const multer = require('multer');

// Store files in memory (not disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
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
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880), // 5MB default
  },
});

module.exports = upload;
