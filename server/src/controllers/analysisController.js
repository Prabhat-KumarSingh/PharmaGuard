const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const AnalysisResult = require('../models/AnalysisResult');
const Patient = require('../models/Patient');
const VCFParser = require('../services/vcfParser');
const PharmacogenomicAnalyzer = require('../services/pharmacogenomicAnalyzer');
const LLMService = require('../services/llmService');

class AnalysisController {
  /**
   * Analyze patient VCF and predict drug risks
   */
  static async analyzePatient(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Validate inputs
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'VCF file is required',
          code: 'MISSING_FILE'
        });
      }

      if (!req.body.drug) {
        return res.status(400).json({
          success: false,
          error: 'Drug name is required',
          code: 'MISSING_DRUG'
        });
      }

      const vcfFilePath = req.file.path;
      const drugs = req.body.drug
        .split(',')
        .map(d => d.trim().toUpperCase())
        .filter(d => d);

      if (drugs.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one valid drug name required',
          code: 'INVALID_DRUG'
        });
      }

      // Parse VCF file
      console.log(`Parsing VCF file: ${vcfFilePath}`);
      const parser = new VCFParser();
      const vcfData = await parser.parseVCF(vcfFilePath);

      if (vcfData.variants.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No variants found in VCF file',
          code: 'NO_VARIANTS'
        });
      }

      // Process variants
      const processedVariants = vcfData.variants.map(v => parser.processVariant(v));
      const pharmacogenomicVariants = parser.filterPharmacogenomicVariants(processedVariants);

      // Analyze each drug
      const analyzer = new PharmacogenomicAnalyzer();
      const llmService = new LLMService();

      const analysisResults = [];

      for (const drug of drugs) {
        console.log(`Analyzing drug: ${drug}`);
        const analysisData = analyzer.analyzePatient(pharmacogenomicVariants, drug);

        // Generate LLM explanation
        const llmExplanation = await llmService.generateExplanation(analysisData);

        // Create comprehensive result
        const result = {
          patient_id: `PATIENT_${uuidv4().substring(0, 8).toUpperCase()}`,
          drug: drug,
          timestamp: new Date().toISOString(),
          risk_assessment: {
            risk_label: analysisData.risk_assessment.risk_label,
            confidence_score: analysisData.risk_assessment.confidence_score,
            severity: analysisData.risk_assessment.severity
          },
          pharmacogenomic_profile: {
            primary_gene: analysisData.primary_gene,
            diplotype: analysisData.phenotype_data.alleles
              .map(a => a.allele)
              .join('/'),
            phenotype: analysisData.phenotype_data.phenotype,
            detected_variants: analysisData.phenotype_data.detected_variants
          },
          clinical_recommendation: analysisData.clinical_recommendation,
          llm_generated_explanation: llmExplanation,
          quality_metrics: {
            vcf_parsing_success: true,
            variant_mapping_success: pharmacogenomicVariants.length > 0,
            annotation_completeness: analysisData.phenotype_data.confidence_score,
            total_variants: vcfData.variants.length,
            pharmacogenomic_variants: pharmacogenomicVariants.length
          }
        };

        // Save to database
        const savedResult = new AnalysisResult(result);
        await savedResult.save();

        analysisResults.push(result);
      }

      const processingTime = Date.now() - startTime;

      // Cleanup uploaded file
      fs.unlink(vcfFilePath, (err) => {
        if (err) console.error('File cleanup error:', err);
      });

      res.status(200).json({
        success: true,
        message: `Analysis completed for ${drugs.length} drug(s)`,
        data: analysisResults,
        metadata: {
          processing_time_ms: processingTime,
          vcf_filename: req.file.originalname,
          variants_analyzed: vcfData.variants.length,
          pharmacogenomic_variants_found: pharmacogenomicVariants.length
        }
      });
    } catch (error) {
      // Cleanup file on error
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('File cleanup error:', err);
        });
      }
      next(error);
    }
  }

  /**
   * Get analysis result by ID
   */
  static async getAnalysisResult(req, res, next) {
    try {
      const { id } = req.params;

      const result = await AnalysisResult.findById(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          error: 'Analysis result not found',
          code: 'NOT_FOUND'
        });
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all analysis results for a patient
   */
  static async getPatientResults(req, res, next) {
    try {
      const { patientId } = req.params;

      const results = await AnalysisResult.find({ patient_id: patientId })
        .sort({ timestamp: -1 });

      res.status(200).json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all analysis results with pagination
   */
  static async getAllResults(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const results = await AnalysisResult.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

      const total = await AnalysisResult.countDocuments();

      res.status(200).json({
        success: true,
        data: results,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(req, res) {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0'
    });
  }
}

module.exports = AnalysisController;
