// routes/analysis.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const VCFFile = require('../models/VCFFile');

// Upload VCF and save to MongoDB
router.post('/analyze', upload.single('vcf_file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const newVCF = new VCFFile({
      filename: req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer, // file content in memory
    });

    await newVCF.save();

    res.json({
      success: true,
      message: 'VCF uploaded successfully',
      fileId: newVCF._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Fetch a VCF file by ID
router.get('/:id', async (req, res) => {
  try {
    const file = await VCFFile.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    res.set('Content-Type', file.mimetype);
    res.send(file.data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
