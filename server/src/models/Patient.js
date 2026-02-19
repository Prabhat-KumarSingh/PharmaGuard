const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patient_id: { type: String, required: true, unique: true, index: true },
  name: String,
  age: Number,
  gender: { type: String, enum: ['M', 'F', 'Other'] },
  ethnicity: String,
  genetic_data_filename: String,
  vcf_file_path: String,
  vcf_file_hash: String,
  
  // Clinical history
  medications: [String],
  allergies: [String],
  conditions: [String],
  
  // Analysis history
  analysis_count: { type: Number, default: 0 },
  last_analysis_date: Date,
  analysis_results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisResult'
  }],
  
  // Consent and compliance
  gdpr_consent: { type: Boolean, default: false },
  research_consent: { type: Boolean, default: false },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
