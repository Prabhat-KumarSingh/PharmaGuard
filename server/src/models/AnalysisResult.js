const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  rsid: { type: String, required: true },
  chrom: String,
  pos: Number,
  ref: String,
  alt: String,
  gene: String,
  star_allele: String,
  phenotype_impact: String,
  frequency: Number,
  clinical_significance: String,
  evidence_level: String,
});

const diplotypeSchema = new mongoose.Schema({
  allele1: String,
  allele2: String,
  phenotype: {
    type: String,
    enum: ['PM', 'IM', 'NM', 'RM', 'URM', 'Unknown'],
    default: 'Unknown'
  },
  activity_score: Number,
  metabolizer_type: String,
});

const pharmacogenomicProfileSchema = new mongoose.Schema({
  gene: { type: String, required: true },
  diplotype: diplotypeSchema,
  detected_variants: [variantSchema],
  confidence_score: { type: Number, default: 0.0 },
  quality_metrics: {
    vcf_parsing_success: Boolean,
    variant_mapping_success: Boolean,
    annotation_completeness: Number,
  },
});

const riskAssessmentSchema = new mongoose.Schema({
  risk_label: {
    type: String,
    enum: ['Safe', 'Adjust Dosage', 'Toxic', 'Ineffective', 'Unknown', 'Monitor Needed'],
    default: 'Unknown'
  },
  confidence_score: { type: Number, default: 0.0 },
  severity: {
    type: String,
    enum: ['none', 'low', 'moderate', 'high', 'critical'],
    default: 'none'
  },
  supporting_evidence: [String],
  cpic_recommendation: String,
});

const clinicalRecommendationSchema = new mongoose.Schema({
  dosage_adjustment: String,
  alternative_drugs: [String],
  monitoring_requirements: [String],
  contraindications: [String],
  special_populations: String,
  cpic_guideline_version: String,
  evidence_level: String,
});

const llmExplanationSchema = new mongoose.Schema({
  summary: String,
  mechanism: String,
  variant_interpretation: [String],
  clinical_significance: String,
  patient_education_summary: String,
  references: [String],
  generated_at: { type: Date, default: Date.now },
  model_used: String,
});

const analysisResultSchema = new mongoose.Schema({
  patient_id: { type: String, required: true, unique: true },
  drug: { type: String, required: true },
  vcf_filename: String,
  timestamp: { type: Date, default: Date.now },
  
  risk_assessment: riskAssessmentSchema,
  pharmacogenomic_profiles: [pharmacogenomicProfileSchema],
  clinical_recommendation: clinicalRecommendationSchema,
  llm_generated_explanation: llmExplanationSchema,
  
  // Metadata
  batch_analysis_id: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error_message: String,
  processing_time_ms: Number,
  vcf_stats: {
    total_variants: Number,
    pharmacogenomic_variants: Number,
    annotation_rate: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
