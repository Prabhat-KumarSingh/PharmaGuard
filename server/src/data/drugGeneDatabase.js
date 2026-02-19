// Drug-Gene-Risk associations and CPIC guidelines
// Based on CPIC (Clinical Pharmacogenetics Implementation Consortium) recommendations

const DRUG_GENE_DATABASE = {
  CODEINE: {
    gene_associations: ['CYP2D6'],
    primary_gene: 'CYP2D6',
    drug_class: 'Opioid Analgesic',
    mechanism: 'Prodrug - requires metabolic activation by CYP2D6',
    
    phenotype_recommendations: {
      'PM': {
        risk_label: 'Ineffective',
        severity: 'high',
        recommendation: 'Avoid or use alternative analgesic. Codeine ineffective due to lack of O-demethylation.',
        dosage_adjustment: 'Not recommended - select alternative',
        alternative_drugs: ['Morphine', 'Oxycodone', 'Tramadol (if RM/NM)'],
        monitoring: ['Monitor pain control', 'Consider alternative opioid'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'IM': {
        risk_label: 'Adjust Dosage',
        severity: 'moderate',
        recommendation: 'Consider dose increase or alternative analgesic. May have suboptimal analgesia.',
        dosage_adjustment: '25-50% dose increase if used',
        alternative_drugs: ['Morphine', 'Oxycodone'],
        monitoring: ['Pain control assessment', 'Adverse event monitoring'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'NM': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard dosing. Codeine is effective for pain management.',
        dosage_adjustment: 'Standard dose 30-60 mg Q4-6H',
        alternative_drugs: [],
        monitoring: ['Routine monitoring'],
        cpic_evidence: 'A - Standard recommendation'
      },
      'RM': {
        risk_label: 'Toxic',
        severity: 'critical',
        recommendation: 'Avoid codeine. Risk of overdose-like symptoms and respiratory depression from increased morphine production.',
        dosage_adjustment: 'Not recommended - select alternative',
        alternative_drugs: ['Morphine', 'Oxycodone (dose adjustment needed)'],
        monitoring: ['Do not use'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'URM': {
        risk_label: 'Toxic',
        severity: 'critical',
        recommendation: 'CONTRAINDICATED. Extreme overdose risk from rapid metabolite conversion.',
        dosage_adjustment: 'Not recommended - select alternative',
        alternative_drugs: ['Morphine', 'Oxycodone (dose adjustment needed)'],
        monitoring: ['Do not use'],
        cpic_evidence: 'A - Strong recommendation'
      }
    },
    
    clinical_notes: 'Codeine is a prodrug that requires CYP2D6 catalysis to be converted to morphine (active metabolite). Poor metabolizers cannot activate the drug and will experience inadequate analgesia. Rapid and ultra-rapid metabolizers produce excessive amounts of morphine, leading to potential overdose.',
    
    cpic_guideline_link: 'https://cpicpgx.org/guidelines/guideline-for-codeine-therapy-in-the-context-of-cyp2d6-genotype/',
    cpic_guideline_version: 'Version 4.2'
  },

  WARFARIN: {
    gene_associations: ['CYP2C9', 'VKORC1'],
    primary_gene: 'CYP2C9',
    drug_class: 'Anticoagulant',
    mechanism: 'Inhibition of vitamin K-dependent clotting factors via CYP2C9 metabolism',
    
    phenotype_recommendations: {
      'PM': {
        risk_label: 'Toxic',
        severity: 'high',
        recommendation: 'Use with extreme caution and reduced dose. Higher levels of S-warfarin (active form) due to CYP2C9 deficiency.',
        dosage_adjustment: '25-50% reduction in starting dose',
        alternative_drugs: ['Direct oral anticoagulants (DOACs)', 'Apixaban', 'Dabigatran'],
        monitoring: ['Frequent INR monitoring (e.g., Q3-7 days)', 'Genetic dosing algorithm recommended'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'IM': {
        risk_label: 'Adjust Dosage',
        severity: 'moderate',
        recommendation: 'Warfarin effective but requires dose adjustment. Consider pharmacogenetic dosing algorithm.',
        dosage_adjustment: '10-30% reduction from standard starting dose',
        alternative_drugs: ['Consider DOAC for simplicity'],
        monitoring: ['INR Q7-14 days after initiation', 'Use warfarin dosing calculator incorporating CYP2C9 and VKORC1 genotype'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'NM': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard warfarin dosing. Normal metabolism expected.',
        dosage_adjustment: 'Standard starting dose 5 mg daily, then titrate based on INR',
        alternative_drugs: [],
        monitoring: ['INR monitoring per standard protocol (Q2-7 days × 7-10 days, then per clinical judgment)', 'Target INR 2-3 for most indications'],
        cpic_evidence: 'A - Standard protocol'
      }
    },
    
    clinical_notes: 'Warfarin dosing is complex and affected by both CYP2C9 and VKORC1 genotypes. Poor metabolizers and intermediate metabolizers have reduced warfarin clearance and require lower maintenance doses to avoid over-anticoagulation and bleeding risk. CPIC recommends use of pharmacogenetic dosing algorithms.',
    
    cpic_guideline_link: 'https://cpicpgx.org/guidelines/guideline-for-warfarin-dosing-based-on-cyp2c9-and-vkorc1-genotype/',
    cpic_guideline_version: 'Version 2.1'
  },

  CLOPIDOGREL: {
    gene_associations: ['CYP2C19'],
    primary_gene: 'CYP2C19',
    drug_class: 'Antiplatelet',
    mechanism: 'Prodrug requiring CYP2C19 activation to active thiol metabolite',
    
    phenotype_recommendations: {
      'PM': {
        risk_label: 'Ineffective',
        severity: 'critical',
        recommendation: 'Clopidogrel is not recommended. Poor metabolizers have significantly reduced activation to the active metabolite, leading to increased stent thrombosis risk.',
        dosage_adjustment: 'Not recommended - select alternative',
        alternative_drugs: ['Prasugrel 5 mg daily (preferred alternative)', 'Ticagrelor 60 mg BID'],
        monitoring: ['Use alternative P2Y12 inhibitor', 'Consider platelet function testing with prasugrel/ticagrelor'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'IM': {
        risk_label: 'Adjust Dosage',
        severity: 'high',
        recommendation: 'Clopidogrel not recommended. Consider alternative antiplatelet agents with superior efficacy in these metabolizers.',
        dosage_adjustment: 'If clopidogrel necessary: Consider higher loading dose (600 mg) and/or increased maintenance (75 mg vs. standard dose) - but alternatives preferred',
        alternative_drugs: ['Prasugrel 5-10 mg daily (preferred)', 'Ticagrelor 60 mg BID'],
        monitoring: ['Platelet function testing recommended', 'Clinical outcomes monitoring'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'NM': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard clopidogrel dosing is appropriate. Normal activation to active metabolite.',
        dosage_adjustment: 'Loading dose 300-600 mg, then 75 mg daily',
        alternative_drugs: [],
        monitoring: ['Standard antiplatelet monitoring', 'Assess response at 5 days if possible'],
        cpic_evidence: 'A - Standard protocol'
      },
      'RM': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard dosing. Rapid metabolizers achieve adequate antiplatelet effect.',
        dosage_adjustment: 'Standard loading and maintenance doses',
        alternative_drugs: [],
        monitoring: ['Standard monitoring'],
        cpic_evidence: 'B - Adequate evidence'
      }
    },
    
    clinical_notes: 'Clopidogrel is a prodrug requiring CYP2C19-mediated conversion to its active metabolite. Carriers of CYP2C19 loss-of-function alleles (*2, *3) have significantly reduced active metabolite exposure and increased risk of stent thrombosis and cardiovascular events.',
    
    cpic_guideline_link: 'https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19-genotype/',
    cpic_guideline_version: 'Version 3.2'
  },

  SIMVASTATIN: {
    gene_associations: ['SLCO1B1'],
    primary_gene: 'SLCO1B1',
    drug_class: 'HMG-CoA Reductase Inhibitor (Statin)',
    mechanism: 'SLCO1B1 (OATP1B1) transporter-mediated hepatic uptake and metabolism',
    
    phenotype_recommendations: {
      'Reduced': {
        risk_label: 'Toxic',
        severity: 'high',
        recommendation: 'Simvastatin not recommended. Significantly increased myopathy and rhabdomyolysis risk due to impaired hepatic clearance.',
        dosage_adjustment: 'Not recommended - select alternative',
        alternative_drugs: ['Pravastatin', 'Rosuvastatin' , 'Atorvastatin'],
        monitoring: ['Use alternative statin with lower transporter dependency'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'Normal': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard simvastatin dosing. Normal hepatic uptake via SLCO1B1 transporter.',
        dosage_adjustment: 'Standard starting dose 10-20 mg daily (dose-dependent on indication); max 40 mg daily',
        alternative_drugs: [],
        monitoring: ['Lipid panel at 4-8 weeks, then annually', 'Muscle symptoms monitoring'],
        cpic_evidence: 'A - Standard protocol'
      }
    },
    
    clinical_notes: 'Simvastatin is highly dependent on SLCO1B1-mediated hepatic uptake. Patients with reduced transporter function (*5/*5, *5/WT, *15/*15, *15/WT) have significantly increased simvastatin concentrations and myopathy risk. These patients should use alternative statins.',
    
    cpic_guideline_link: 'https://cpicpgx.org/guidelines/guideline-for-simvastatin-dosing-based-on-slco1b1-genotype/',
    cpic_guideline_version: 'Version 1.2'
  },

  AZATHIOPRINE: {
    gene_associations: ['TPMT', 'NUDT15'],
    primary_gene: 'TPMT',
    drug_class: 'Immunosuppressant / Antimetabolite',
    mechanism: 'TPMT catalyzes inactivation of thiopurine metabolites; reduced activity leads to accumulation of toxic metabolites',
    
    phenotype_recommendations: {
      'Poor': {
        risk_label: 'Toxic',
        severity: 'critical',
        recommendation: 'Azathioprine is contraindicated or requires extreme dose reduction (>90% reduction). Severe risk of hematologic toxicity (bone marrow suppression).',
        dosage_adjustment: 'Not recommended or minimal dose (<0.5 mg/kg/day) with intensive monitoring',
        alternative_drugs: ['Mycophenolate', 'Leflunomide', '6-TG (only if TPMT normal)', 'Biologic agents'],
        monitoring: ['Do not use if possible', 'If essential: CBC weekly, liver function tests weekly, consider lower alternative'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'Intermediate': {
        risk_label: 'Adjust Dosage',
        severity: 'high',
        recommendation: 'Azathioprine use requires significant dose reduction. Heterozygotes have ~50% enzyme activity.',
        dosage_adjustment: '30-70% dose reduction from standard (standard: 1-2.5 mg/kg/day; use 0.5-1.5 mg/kg/day)',
        alternative_drugs: ['Consider alternative immunosuppressant for simplicity'],
        monitoring: ['CBC every 1-2 weeks initially, then monthly', 'Liver function tests monthly', 'Thiopurine metabolite testing (6-TGN, 6-MMPR) recommended'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'Normal': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard azathioprine dosing. Normal TPMT enzyme activity.',
        dosage_adjustment: 'Standard dose 1-2.5 mg/kg/day, titrated based on response',
        alternative_drugs: [],
        monitoring: ['CBC and liver function every 1-2 weeks initially, then every 3 months', 'Monitor for signs of hematologic toxicity'],
        cpic_evidence: 'A - Standard protocol'
      }
    },
    
    clinical_notes: 'TPMT deficiency leads to accumulation of active thiopurine metabolites (6-TGN), causing severe myelosuppression, infections, and hepatotoxicity. CPIC recommends TPMT genotyping or phenotyping before azathioprine initiation. Poor metabolizers should avoid the drug.',
    
    cpic_guideline_link: 'https://cpicpgx.org/guidelines/guideline-for-thiopurine-dosing-based-on-tpmt-phenotype/',
    cpic_guideline_version: 'Version 4.1'
  },

  FLUOROURACIL: {
    gene_associations: ['DPYD'],
    primary_gene: 'DPYD',
    drug_class: 'Antimetabolite Chemotherapy',
    mechanism: 'DPYD catalyzes degradation of fluorouracil; deficiency leads to life-threatening toxicity',
    
    phenotype_recommendations: {
      'Homozygous': {
        risk_label: 'Toxic',
        severity: 'critical',
        recommendation: 'Fluorouracil is CONTRAINDICATED. Severe and potentially life-threatening toxicity from inability to metabolize 5-FU leads to accumulation.',
        dosage_adjustment: 'Not recommended - do not use',
        alternative_drugs: ['Capecitabine contraindicated in same way', 'Consider alternative chemotherapy regimens'],
        monitoring: ['Do not use this drug'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'Heterozygous': {
        risk_label: 'Toxic',
        severity: 'high',
        recommendation: 'Fluorouracil not recommended or requires significant dose reduction. Risk of severe toxicity including myelosuppression and mucositis.',
        dosage_adjustment: 'If essential, reduce dose by 25-75% and use cautiously with intensive monitoring',
        alternative_drugs: ['Consider alternative chemotherapy regimens', 'Capecitabine also risky'],
        monitoring: ['Genetic counseling recommended', 'Intensive toxicity monitoring if used', 'CBC, creatinine, liver function weekly'],
        cpic_evidence: 'A - Strong recommendation'
      },
      'Normal': {
        risk_label: 'Safe',
        severity: 'none',
        recommendation: 'Standard fluorouracil dosing. Normal DPYD enzyme activity for drug metabolism.',
        dosage_adjustment: 'Standard dosing per chemotherapy protocol (typically 400-600 mg/m² IV weekly or as bolus)',
        alternative_drugs: [],
        monitoring: ['Standard chemotherapy monitoring', 'CBC weekly initially', 'Liver and renal function monitoring'],
        cpic_evidence: 'A - Standard protocol'
      }
    },
    
    clinical_notes: 'DPYD deficiency is rare but critically important. DPYD catalyzes inactivation of 5-fluorouracil, converting it to the non-toxic compound dihydrofluorouracil. Deficient patients cannot metabolize 5-FU and experience severe toxicity. FDA requires DPYD testing before prescribing fluorouracil or capecitabine.',
    
    cpic_guideline_link: 'https://cpicpgx.org/guidelines/guideline-for-dihydropyrimidine-dehydrogenase-deficiency-and-fluoropyrimidine-dosing/',
    cpic_guideline_version: 'Version 3.1'
  }
};

module.exports = DRUG_GENE_DATABASE;
