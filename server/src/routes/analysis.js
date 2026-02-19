const express = require('express');
const upload = require('../middleware/fileUpload');
const AnalysisController = require('../controllers/analysisController');

const router = express.Router();

/**
 * POST /api/analysis/analyze
 * Analyze patient VCF and predict drug risks
 * Body: drug (string, comma-separated for multiple drugs)
 * File: VCF file
 */
router.post('/analyze', upload.single('vcf_file'), AnalysisController.analyzePatient);

/**
 * GET /api/analysis/:id
 * Get analysis result by ID
 */
router.get('/:id', AnalysisController.getAnalysisResult);

/**
 * GET /api/analysis/patient/:patientId
 * Get all analysis results for a patient
 */
router.get('/patient/:patientId', AnalysisController.getPatientResults);

/**
 * GET /api/analysis
 * Get all analysis results with pagination
 */
router.get('/', AnalysisController.getAllResults);

module.exports = router;
