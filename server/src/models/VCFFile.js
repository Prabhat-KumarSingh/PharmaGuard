// models/VCFFile.js
const mongoose = require('mongoose');

const VCFFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true }, // store file content as binary
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VCFFile', VCFFileSchema);
