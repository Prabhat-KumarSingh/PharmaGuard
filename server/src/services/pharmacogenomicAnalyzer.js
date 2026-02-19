const VARIANT_DATABASE = require('../data/variantDatabase');
const DRUG_GENE_DATABASE = require('../data/drugGeneDatabase');

class PharmacogenomicAnalyzer {
  constructor() {
    this.variantDB = VARIANT_DATABASE;
    this.drugGeneDB = DRUG_GENE_DATABASE;
  }

  /**
   * Analyze patient genetic variants and predict drug risks
   * @param {Array} variants - Patient's detected variants
   * @param {string} drug - Drug name
   * @returns {Object} Risk assessment and recommendations
   */
  analyzePatient(variants, drug) {
    const drug_upper = drug.toUpperCase().trim();
    
    if (!this.drugGeneDB[drug_upper]) {
      return this.generateUnknownDrugResult(drug_upper);
    }

    const drugInfo = this.drugGeneDB[drug_upper];
    const primaryGene = drugInfo.primary_gene;
    
    // Determine patient phenotype based on detected variants
    const phenotypeData = this.determinePhenotype(primaryGene, variants);
    
    // Get risk assessment for the determined phenotype
    const riskAssessment = this.getRiskAssessment(drug_upper, phenotypeData.phenotype);
    
    // Generate clinical recommendations
    const clinicalRecommendation = this.generateClinicalRecommendation(
      drug_upper,
      phenotypeData,
      riskAssessment
    );

    return {
      drug: drug_upper,
      primary_gene: primaryGene,
      phenotype_data: phenotypeData,
      risk_assessment: riskAssessment,
      clinical_recommendation: clinicalRecommendation,
      raw_variants: variants
    };
  }

  /**
   * Determine patient metabolic phenotype based on detected variants
   * @param {string} gene - Gene symbol
   * @param {Array} variants - Detected variants
   * @returns {Object} Phenotype data
   */
  determinePhenotype(gene, variants) {
    if (!this.variantDB[gene]) {
      return {
        gene: gene,
        phenotype: 'Unknown',
        detected_alleles: [],
        confidence: 0.0,
        note: `Gene ${gene} not in database`
      };
    }

    const geneInfo = this.variantDB[gene];
    const detectedVariants = this.matchVariantsToGene(gene, variants);
    
    // Map detected variants to star alleles
    const alleles = this.determineAlleles(gene, detectedVariants);
    
    // Determine phenotype from allele activity
    const phenotype = this.getPhenotypeFromAlleles(gene, alleles);
    
    // Calculate confidence based on coverage
    const confidence = this.calculateConfidence(detectedVariants, geneInfo);

    return {
      gene: gene,
      phenotype: phenotype.phenotype,
      phenotype_description: phenotype.description,
      alleles: alleles,
      activity_score: phenotype.activity_score,
      detected_variants: detectedVariants.map(v => ({
        rsid: v.rsid,
        position: v.position,
        alleles: `${v.reference_allele}/${v.alternate_allele}`,
        impact: v.impact
      })),
      confidence_score: confidence,
      metabolizer_type: this.getMetabolzerType(gene, phenotype.phenotype)
    };
  }

  /**
   * Match patient variants to specific gene variants in database
   * @param {string} gene - Gene symbol
   * @param {Array} variants - Patient variants
   * @returns {Array} Matched variants
   */
  matchVariantsToGene(gene, variants) {
    if (!this.variantDB[gene] || !this.variantDB[gene].variants) {
      return [];
    }

    const geneVariants = this.variantDB[gene].variants;
    const matched = [];

    variants.forEach(pVariant => {
      for (const [rsid, variantInfo] of Object.entries(geneVariants)) {
        if (
          pVariant.rsid === rsid ||
          pVariant.rsid === variantInfo.rsid ||
          (pVariant.position === variantInfo.position && 
           pVariant.chromosome === variantInfo.chromosome)
        ) {
          matched.push({
            ...pVariant,
            star_alleles: variantInfo.star_alleles,
            phenotype_impact: variantInfo.phenotype_impact,
            evidence_level: variantInfo.evidence_level
          });
          break;
        }
      }
    });

    return matched;
  }

  /**
   * Infer star alleles from detected variants
   * @param {string} gene - Gene symbol
   * @param {Array} variants - Matched variants
   * @returns {Array} Inferred alleles with activity scores
   */
  determineAlleles(gene, variants) {
    const geneInfo = this.variantDB[gene];
    if (!geneInfo || !geneInfo.haplotype_definitions) {
      return [{ allele: 'Unknown', activity: 0.5 }];
    }

    const haplotypes = geneInfo.haplotype_definitions;
    
    // Simple allele inference: 
    // - If no variants detected, assume *1/*1 (wild-type)
    // - If variants detected, map to corresponding star alleles
    
    if (variants.length === 0) {
      return [
        { allele: '*1', activity: haplotypes['*1'].activity, description: haplotypes['*1'].description },
        { allele: '*1', activity: haplotypes['*1'].activity, description: haplotypes['*1'].description }
      ];
    }

    // Collect inferred alleles from variants
    const inferredAlleles = [];
    const processedAlleles = new Set();

    variants.forEach(v => {
      if (v.star_alleles) {
        v.star_alleles.forEach(allele => {
          if (!processedAlleles.has(allele) && haplotypes[allele]) {
            inferredAlleles.push({
              allele: allele,
              activity: haplotypes[allele].activity,
              description: haplotypes[allele].description
            });
            processedAlleles.add(allele);
          }
        });
      }
    });

    // If no alleles inferred, return wild-type
    if (inferredAlleles.length === 0) {
      return [
        { allele: '*1', activity: haplotypes['*1'].activity, description: haplotypes['*1'].description },
        { allele: '*1', activity: haplotypes['*1'].activity, description: haplotypes['*1'].description }
      ];
    }

    // Return inferred alleles (simplified diplotype)
    return inferredAlleles.slice(0, 2);
  }

  /**
   * Determine phenotype from allele activities
   * @param {string} gene - Gene symbol
   * @param {Array} alleles - Inferred alleles
   * @returns {Object} Phenotype information
   */
  getPhenotypeFromAlleles(gene, alleles) {
    const geneInfo = this.variantDB[gene];
    if (!geneInfo || !geneInfo.phenotype_definitions) {
      return {
        phenotype: 'Unknown',
        description: 'Unable to determine phenotype',
        activity_score: 0.5
      };
    }

    // Calculate total activity score
    const totalActivity = alleles.reduce((sum, a) => sum + (a.activity || 0.5), 0);
    const avgActivity = totalActivity / alleles.length;

    // Find matching phenotype
    const phenotypes = geneInfo.phenotype_definitions;
    for (const [phenoType, phenoInfo] of Object.entries(phenotypes)) {
      if (
        avgActivity >= phenoInfo.activity_range[0] &&
        avgActivity < phenoInfo.activity_range[1]
      ) {
        return {
          phenotype: phenoType,
          description: phenoInfo.description,
          activity_score: avgActivity,
          clinical_impact: phenoInfo.clinical_impact
        };
      }
    }

    // Default to last range if activity exceeds
    const lastPheno = Object.entries(phenotypes)[Object.entries(phenotypes).length - 1];
    return {
      phenotype: lastPheno[0],
      description: lastPheno[1].description,
      activity_score: avgActivity,
      clinical_impact: lastPheno[1].clinical_impact
    };
  }

  /**
   * Get risk assessment based on drug and phenotype
   * @param {string} drug - Drug name (uppercase)
   * @param {string} phenotype - Patient phenotype
   * @returns {Object} Risk assessment
   */
  getRiskAssessment(drug, phenotype) {
    const drugInfo = this.drugGeneDB[drug];
    
    if (!drugInfo || !drugInfo.phenotype_recommendations[phenotype]) {
      return {
        risk_label: 'Unknown',
        confidence_score: 0.0,
        severity: 'moderate',
        supporting_evidence: ['Phenotype not found in guidelines'],
        cpic_recommendation: 'Consult CPIC guidelines for this phenotype'
      };
    }

    const recommendation = drugInfo.phenotype_recommendations[phenotype];

    return {
      risk_label: recommendation.risk_label,
      confidence_score: 0.95,
      severity: recommendation.severity,
      supporting_evidence: [recommendation.recommendation],
      cpic_recommendation: recommendation.recommendation,
      evidence_level: `CPIC: ${recommendation.cpic_evidence}`
    };
  }

  /**
   * Generate clinical recommendation
   * @param {string} drug - Drug name
   * @param {Object} phenotypeData - Patient phenotype data
   * @param {Object} riskAssessment - Risk assessment
   * @returns {Object} Clinical recommendation
   */
  generateClinicalRecommendation(drug, phenotypeData, riskAssessment) {
    const drugInfo = this.drugGeneDB[drug];
    const phenotype = phenotypeData.phenotype;

    if (!drugInfo || !drugInfo.phenotype_recommendations[phenotype]) {
      return {
        dosage_adjustment: 'Insufficient data',
        alternative_drugs: [],
        monitoring_requirements: ['Consult specialist'],
        contraindications: [],
        special_populations: 'Unknown',
        cpic_guideline_version: 'Unknown'
      };
    }

    const rec = drugInfo.phenotype_recommendations[phenotype];

    return {
      dosage_adjustment: rec.dosage_adjustment,
      alternative_drugs: rec.alternative_drugs || [],
      monitoring_requirements: rec.monitoring || [],
      contraindications: [],
      special_populations: rec.special_populations || 'None specified',
      cpic_guideline_version: drugInfo.cpic_guideline_version,
      drug_class: drugInfo.drug_class,
      mechanism: drugInfo.mechanism,
      clinical_notes: drugInfo.clinical_notes,
      evidence_level: rec.cpic_evidence,
      guideline_link: drugInfo.cpic_guideline_link
    };
  }

  /**
   * Calculate confidence score
   * @param {Array} detectedVariants - Detected variants
   * @param {Object} geneInfo - Gene database info
   * @returns {number} Confidence score 0-1
   */
  calculateConfidence(detectedVariants, geneInfo) {
    if (!geneInfo.variants) return 0.0;
    
    const totalKnownVariants = Object.keys(geneInfo.variants).length;
    const detectedRate = detectedVariants.length / totalKnownVariants;
    
    // Confidence increases with number of detected variants
    return Math.min(detectedRate * 1.2, 1.0);
  }

  /**
   * Map phenotype string to metabolizer type
   * @param {string} gene - Gene symbol
   * @param {string} phenotype - Phenotype string
   * @returns {string} Metabolizer type description
   */
  getMetabolzerType(gene, phenotype) {
    const descriptions = {
      'PM': 'Poor Metabolizer - Reduced or absent enzyme activity',
      'IM': 'Intermediate Metabolizer - Reduced enzyme activity',
      'NM': 'Normal Metabolizer - Normal enzyme activity',
      'RM': 'Rapid Metabolizer - Enhanced enzyme activity',
      'URM': 'Ultra-Rapid Metabolizer - Very high enzyme activity',
      'Poor': 'Reduced enzyme activity',
      'Normal': 'Normal enzyme activity',
      'Reduced': 'Reduced transporter function'
    };

    return descriptions[phenotype] || 'Unknown metabolizer phenotype';
  }

  /**
   * Handle unknown drugs
   * @param {string} drug - Drug name
   * @returns {Object} Generic result for unknown drug
   */
  generateUnknownDrugResult(drug) {
    return {
      drug: drug,
      primary_gene: 'Unknown',
      phenotype_data: {
        gene: 'Unknown',
        phenotype: 'Unknown',
        confidence_score: 0.0,
        note: `Drug ${drug} not in pharmacogenomic database`
      },
      risk_assessment: {
        risk_label: 'Unknown',
        confidence_score: 0.0,
        severity: 'moderate',
        supporting_evidence: [`Drug ${drug} pharmacogenomics not available in current database`],
        cpic_recommendation: 'Limited pharmacogenomic data available for this drug'
      },
      clinical_recommendation: {
        dosage_adjustment: 'Consult pharmacist',
        alternative_drugs: [],
        monitoring_requirements: ['Standard monitoring'],
        note: 'This drug may have pharmacogenomic associations not included in this system'
      }
    };
  }
}

module.exports = PharmacogenomicAnalyzer;
