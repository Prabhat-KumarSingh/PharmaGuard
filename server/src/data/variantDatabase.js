// Comprehensive pharmacogenomic variant database
// Based on CPIC guidelines and clinical evidence

const VARIANT_DATABASE = {
  CYP2D6: {
    gene_symbol: 'CYP2D6',
    location: '22q13.1',
    drug_substrates: ['CODEINE', 'TRAMADOL', 'METOPROLOL', 'DOXORUBICIN'],
    phenotype_range: ['PM', 'IM', 'NM', 'RM', 'URM'],
    
    variants: {
      'rs1065852': {
        rsid: 'rs1065852',
        position: 42127941,
        chromosome: '22',
        ref: 'C',
        alt: 'T',
        star_alleles: ['*4', '*6', '*7', '*8'],
        phenotype_impact: 'Loss of function',
        allele_frequency: 0.2,
        populations: {
          'european': 0.2,
          'african': 0.15,
          'eastasian': 0.05
        },
        evidence_level: 'A',
        clinical_significance: 'Strong metabolic impact'
      },
      'rs28365072': {
        rsid: 'rs28365072',
        position: 42130692,
        chromosome: '22',
        ref: 'G',
        alt: 'A',
        star_alleles: ['*41'],
        phenotype_impact: 'Loss of function',
        allele_frequency: 0.25,
        populations: {
          'european': 0.25,
          'african': 0.10,
          'eastasian': 0.08
        },
        evidence_level: 'A',
        clinical_significance: 'Critical metabolizer phenotype marker'
      },
      'rs16947': {
        rsid: 'rs16947',
        position: 42130838,
        chromosome: '22',
        ref: 'C',
        alt: 'T',
        star_alleles: ['*10'],
        phenotype_impact: 'Reduced function',
        allele_frequency: 0.35,
        populations: {
          'eastasian': 0.35,
          'african': 0.15,
          'european': 0.08
        },
        evidence_level: 'B',
        clinical_significance: 'Population-specific reduced activity'
      }
    },
    
    haplotype_definitions: {
      '*1': { description: 'Wild-type / fully functional', activity: 1.0 },
      '*2': { description: 'Normal metabolizer (common variant)', activity: 0.5 },
      '*4': { description: 'Non-functional (deletion)', activity: 0 },
      '*5': { description: 'Non-functional (deletion)', activity: 0 },
      '*10': { description: 'Reduced function (Asian-specific)', activity: 0.5 },
      '*41': { description: 'Reduced function', activity: 0.5 }
    },
    
    phenotype_definitions: {
      'PM': { activity_range: [0, 0.5], description: 'Poor Metabolizer', clinical_impact: 'Accumulation of parent drug' },
      'IM': { activity_range: [0.5, 1.0], description: 'Intermediate Metabolizer', clinical_impact: 'Reduced drug clearance' },
      'NM': { activity_range: [1.0, 2.0], description: 'Normal Metabolizer', clinical_impact: 'Standard dosing' },
      'RM': { activity_range: [2.0, 3.0], description: 'Rapid Metabolizer', clinical_impact: 'Faster drug metabolism' },
      'URM': { activity_range: [3.0, 100], description: 'Ultra-Rapid Metabolizer', clinical_impact: 'Very fast drug clearance' }
    }
  },

  CYP2C19: {
    gene_symbol: 'CYP2C19',
    location: '10q24',
    drug_substrates: ['CLOPIDOGREL', 'WARFARIN', 'ESCITALOPRAM', 'OMEPRAZOLE'],
    phenotype_range: ['PM', 'IM', 'NM', 'RM'],
    
    variants: {
      'rs4244285': {
        rsid: 'rs4244285',
        position: 94761900,
        chromosome: '10',
        ref: 'G',
        alt: 'A',
        star_alleles: ['*2'],
        phenotype_impact: 'Loss of function',
        allele_frequency: 0.30,
        populations: {
          'eastasian': 0.30,
          'european': 0.13,
          'african': 0.05
        },
        evidence_level: 'A',
        clinical_significance: 'CRITICAL for CLOPIDOGREL efficacy'
      },
      'rs4986893': {
        rsid: 'rs4986893',
        position: 94770409,
        chromosome: '10',
        ref: 'G',
        alt: 'A',
        star_alleles: ['*3'],
        phenotype_impact: 'Loss of function',
        allele_frequency: 0.15,
        populations: {
          'african': 0.15,
          'european': 0.04,
          'eastasian': 0.01
        },
        evidence_level: 'A',
        clinical_significance: 'Strong metabolic impact'
      }
    },
    
    haplotype_definitions: {
      '*1': { description: 'Fully functional', activity: 1.0 },
      '*2': { description: 'Non-functional', activity: 0 },
      '*3': { description: 'Non-functional', activity: 0 },
      '*4': { description: 'Fully functional (alternate)', activity: 1.0 }
    },
    
    phenotype_definitions: {
      'PM': { activity_range: [0, 0.5], description: 'Poor Metabolizer', clinical_impact: 'Reduced drug activation (clopidogrel)' },
      'IM': { activity_range: [0.5, 1.0], description: 'Intermediate Metabolizer', clinical_impact: 'Intermediate activation' },
      'NM': { activity_range: [1.0, 2.0], description: 'Normal Metabolizer', clinical_impact: 'Standard drug activation' },
      'RM': { activity_range: [2.0, 4.0], description: 'Rapid Metabolizer', clinical_impact: 'Enhanced drug clearance' }
    }
  },

  CYP2C9: {
    gene_symbol: 'CYP2C9',
    location: '10q23',
    drug_substrates: ['WARFARIN', 'NSAIDS', 'PHENYTOIN', 'GLIPIZIDE'],
    phenotype_range: ['PM', 'IM', 'NM'],
    
    variants: {
      'rs1799853': {
        rsid: 'rs1799853',
        position: 94938996,
        chromosome: '10',
        ref: 'A',
        alt: 'C',
        star_alleles: ['*2'],
        phenotype_impact: 'Reduced function',
        allele_frequency: 0.13,
        populations: {
          'european': 0.13,
          'eastasian': 0.03,
          'african': 0.06
        },
        evidence_level: 'A',
        clinical_significance: 'CRITICAL for WARFARIN dosing'
      },
      'rs1057910': {
        rsid: 'rs1057910',
        position: 94942758,
        chromosome: '10',
        ref: 'A',
        alt: 'C',
        star_alleles: ['*3'],
        phenotype_impact: 'Reduced function',
        allele_frequency: 0.08,
        populations: {
          'african': 0.08,
          'european': 0.07,
          'eastasian': 0.01
        },
        evidence_level: 'A',
        clinical_significance: 'Strong impact on drug metabolism'
      }
    },
    
    haplotype_definitions: {
      '*1': { description: 'Fully functional', activity: 1.0 },
      '*2': { description: 'Reduced function (Arg144Cys)', activity: 0.8 },
      '*3': { description: 'Reduced function (Ile359Leu)', activity: 0.4 }
    },
    
    phenotype_definitions: {
      'PM': { activity_range: [0, 0.4], description: 'Poor Metabolizer', clinical_impact: 'Increased anticoagulant sensitivity' },
      'IM': { activity_range: [0.4, 1.0], description: 'Intermediate Metabolizer', clinical_impact: 'Moderate warfarin sensitivity' },
      'NM': { activity_range: [1.0, 2.0], description: 'Normal Metabolizer', clinical_impact: 'Standard metabolism' }
    }
  },

  SLCO1B1: {
    gene_symbol: 'SLCO1B1',
    location: '12p13',
    drug_substrates: ['SIMVASTATIN', 'ROSUVASTATIN', 'PRAVASTATIN'],
    phenotype_range: ['High', 'Normal', 'Reduced'],
    
    variants: {
      'rs4149056': {
        rsid: 'rs4149056',
        position: 21566392,
        chromosome: '12',
        ref: 'C',
        alt: 'T',
        star_alleles: ['*5', '*15'],
        phenotype_impact: 'Loss of function - statin transporter',
        allele_frequency: 0.06,
        populations: {
          'european': 0.06,
          'eastasian': 0.02,
          'african': 0.01
        },
        evidence_level: 'A',
        clinical_significance: 'CRITICAL for SIMVASTATIN-induced myopathy risk'
      }
    },
    
    haplotype_definitions: {
      '*1a': { description: 'Normal transporter function', activity: 1.0 },
      '*1b': { description: 'Normal variant', activity: 1.0 },
      '*5': { description: 'Reduced transporter function (Val174Ala, Val104Ala)', activity: 0 },
      '*15': { description: 'Reduced transporter function (Asn130Asp, Val174Ala)', activity: 0 }
    },
    
    phenotype_definitions: {
      'High': { activity_range: [1.0, 2.0], description: 'High transporter function', clinical_impact: 'Normal statin clearance' },
      'Normal': { activity_range: [0.5, 1.0], description: 'Normal transporter function', clinical_impact: 'Standard statin metabolism' },
      'Reduced': { activity_range: [0, 0.5], description: 'Reduced transporter function', clinical_impact: 'Increased statin concentrations, myopathy risk' }
    }
  },

  TPMT: {
    gene_symbol: 'TPMT',
    location: '6p22',
    drug_substrates: ['AZATHIOPRINE', '6-MERCAPTOPURINE', '6-THIOGUANINE'],
    phenotype_range: ['Poor', 'Intermediate', 'Normal'],
    
    variants: {
      'rs1800462': {
        rsid: 'rs1800462',
        position: 18131118,
        chromosome: '6',
        ref: 'A',
        alt: 'G',
        star_alleles: ['*3a', '*3b', '*3c'],
        phenotype_impact: 'Loss of function - thiopurine metabolism',
        allele_frequency: 0.01,
        populations: {
          'european': 0.01,
          'eastasian': 0.005,
          'african': 0.008
        },
        evidence_level: 'A',
        clinical_significance: 'CRITICAL - hematopoietic toxicity risk'
      },
      'rs1800460': {
        rsid: 'rs1800460',
        position: 18131127,
        chromosome: '6',
        ref: 'G',
        alt: 'A',
        star_alleles: ['*2', '*3a'],
        phenotype_impact: 'Reduced enzyme activity',
        allele_frequency: 0.02,
        populations: {
          'european': 0.02,
          'eastasian': 0.01,
          'african': 0.01
        },
        evidence_level: 'A',
        clinical_significance: 'Increased thiopurine toxicity risk'
      }
    },
    
    haplotype_definitions: {
      '*1': { description: 'Normal enzyme activity', activity: 1.0 },
      '*2': { description: 'Reduced enzyme activity', activity: 0.5 },
      '*3a': { description: 'No enzyme activity', activity: 0 },
      '*3b': { description: 'No enzyme activity', activity: 0 },
      '*3c': { description: 'No enzyme activity', activity: 0 }
    },
    
    phenotype_definitions: {
      'Normal': { activity_range: [0.8, 1.0], description: 'Normal TPMT enzyme activity', clinical_impact: 'Standard dosing' },
      'Intermediate': { activity_range: [0.3, 0.8], description: 'Intermediate enzyme activity', clinical_impact: 'Reduced dosing recommended' },
      'Poor': { activity_range: [0, 0.3], description: 'Low or absent enzyme activity', clinical_impact: 'Severe toxicity risk - contraindicated or minimal dosing' }
    }
  },

  DPYD: {
    gene_symbol: 'DPYD',
    location: '1p22',
    drug_substrates: ['FLUOROURACIL', '5-FU', 'CAPECITABINE'],
    phenotype_range: ['Normal', 'Heterozygous', 'Homozygous'],
    
    variants: {
      'rs3918290': {
        rsid: 'rs3918290',
        position: 97915614,
        chromosome: '1',
        ref: 'G',
        alt: 'A',
        star_alleles: ['*2a'],
        phenotype_impact: 'DPYD deficiency - severe 5-FU toxicity',
        allele_frequency: 0.001,
        populations: {
          'european': 0.001,
          'eastasian': 0.0005,
          'african': 0.0005
        },
        evidence_level: 'A',
        clinical_significance: 'CRITICAL - absolute contraindication for 5-FU'
      },
      'rs55886062': {
        rsid: 'rs55886062',
        position: 98007750,
        chromosome: '1',
        ref: 'CTG',
        alt: 'C',
        star_alleles: ['*13'],
        phenotype_impact: 'DPYD deficiency',
        allele_frequency: 0.002,
        populations: {
          'european': 0.002,
          'eastasian': 0.001,
          'african': 0.001
        },
        evidence_level: 'A',
        clinical_significance: 'Increased risk of 5-FU toxicity'
      }
    },
    
    haplotype_definitions: {
      'Normal': { description: 'Normal DPYD enzyme activity', activity: 1.0 },
      '*2a': { description: 'DPYD*2A - severe deficiency (IVS14+1G>A)', activity: 0 },
      '*13': { description: 'DPYD*13 - deficiency (1679T>G)', activity: 0 }
    },
    
    phenotype_definitions: {
      'Normal': { activity_range: [0.8, 1.0], description: 'Normal DPYD enzyme activity', clinical_impact: 'Standard 5-FU dosing' },
      'Heterozygous': { activity_range: [0.3, 0.8], description: 'Reduced DPYD activity', clinical_impact: 'Reduced fluorouracil dose recommended' },
      'Homozygous': { activity_range: [0, 0.3], description: 'Severe DPYD deficiency', clinical_impact: 'Fluorouracil contraindicated - high toxicity risk' }
    }
  }
};

module.exports = VARIANT_DATABASE;
