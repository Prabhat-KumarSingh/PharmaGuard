// LLM Service for generating clinical explanations
// Integrates with OpenAI API to generate LLM-powered explanations

class LLMService {
  constructor() {
    // Initialize with OpenAI API key from environment
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.LLM_MODEL || 'gpt-3.5-turbo';
    this.useMockResponses = !this.apiKey; // Fall back to mock if no API key
  }

  /**
   * Generate clinical explanation using LLM
   * @param {Object} analysisData - Complete analysis data
   * @returns {Promise<Object>} LLM-generated explanation
   */
  async generateExplanation(analysisData) {
    const {
      drug,
      primary_gene,
      phenotype_data,
      risk_assessment,
      clinical_recommendation,
      raw_variants
    } = analysisData;

    // Prepare prompt for LLM
    const prompt = this.buildPrompt(
      drug,
      primary_gene,
      phenotype_data,
      risk_assessment,
      raw_variants
    );

    try {
      if (this.useMockResponses) {
        return this.generateMockExplanation(analysisData);
      }

      // Call OpenAI API
      const explanation = await this.callOpenAI(prompt);
      
      return {
        summary: explanation.summary,
        mechanism: explanation.mechanism,
        variant_interpretation: explanation.variant_interpretation,
        clinical_significance: explanation.clinical_significance,
        patient_education_summary: explanation.patient_education_summary,
        references: explanation.references,
        generated_at: new Date().toISOString(),
        model_used: this.model
      };
    } catch (error) {
      console.error('LLM API Error:', error);
      return this.generateMockExplanation(analysisData);
    }
  }

  /**
   * Build prompt for LLM
   * @returns {string} Formatted prompt
   */
  buildPrompt(drug, gene, phenotype, risk, variants) {
    return `
You are an expert pharmacogenomics consultant. Generate a clear, clinical explanation for the following pharmacogenomic analysis:

**Patient Information:**
- Drug: ${drug}
- Primary Gene: ${gene}
- Patient Phenotype: ${phenotype.phenotype} (${phenotype.phenotype_description || ''})
- Risk Assessment: ${risk.risk_label} (Severity: ${risk.severity})

**Detected Variants:**
${variants.map(v => `- ${v.rsid} (${v.chromosome}:${v.position}): ${v.reference_allele}>${v.alternate_allele}`).join('\n')}

**Clinical Recommendation:**
${risk.supporting_evidence[0] || 'See clinical recommendations'}

Please provide:
1. **Summary**: 2-3 sentence clinical summary
2. **Mechanism**: How the genetic variant(s) affect ${drug} metabolism
3. **Variant Interpretation**: Specific interpretation of each detected variant
4. **Clinical Significance**: What this means clinically for the patient
5. **Patient Education Summary**: Simple explanation for patient understanding
6. **References**: Relevant CPIC guidelines or clinical references

Format the response as JSON with these exact keys.
`;
  }

  /**
   * Call OpenAI API
   * @param {string} prompt - The prompt text
   * @returns {Promise<Object>} API response
   */
  async callOpenAI(prompt) {
    try {
      const OpenAI = require('openai');
      const client = new OpenAI({ apiKey: this.apiKey });

      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert clinical pharmacogenomics specialist. Provide accurate, evidence-based explanations for pharmacogenomic testing results.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON response
      try {
        return JSON.parse(content);
      } catch (e) {
        // If not valid JSON, structure the response
        return this.parseTextResponse(content);
      }
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Parse text response into structured format
   * @param {string} text - Response text
   * @returns {Object} Structured response
   */
  parseTextResponse(text) {
    return {
      summary: text.substring(0, 300),
      mechanism: 'See full explanation',
      variant_interpretation: ['See clinical notes'],
      clinical_significance: text,
      patient_education_summary: 'Consult with healthcare provider',
      references: ['CPIC Guidelines']
    };
  }

  /**
   * Generate mock explanation (for development without API key)
   * @param {Object} analysisData - Analysis data
   * @returns {Object} Mock explanation
   */
  generateMockExplanation(analysisData) {
    const { drug, primary_gene, phenotype_data, risk_assessment, raw_variants } = analysisData;

    const explanations = {
      CODEINE: {
        summary: `Patient genotype shows ${phenotype_data.phenotype} status for CYP2D6. ${risk_assessment.supporting_evidence[0]}`,
        mechanism: `Codeine is a prodrug that requires CYP2D6 enzyme for bioactivation to morphine. The patient's ${phenotype_data.phenotype} metabolizer status indicates ${phenotype_data.phenotype === 'PM' ? 'inability to convert codeine to morphine, resulting in lack of analgesic effect' : phenotype_data.phenotype === 'URM' ? 'rapid conversion to morphine, increasing overdose risk' : 'normal drug metabolism'}`,
        variant_interpretation: raw_variants.map(v => `Variant ${v.rsid}: Located at ${v.chromosome}:${v.position}, this variant affects CYP2D6 enzyme function`),
        clinical_significance: `This ${phenotype_data.phenotype} phenotype means ${phenotype_data.metabolizer_type.toLowerCase()}. Clinical action: ${risk_assessment.cpic_recommendation}`,
        patient_education_summary: `Based on your genes, your body processes pain medication differently than average. We recommend ${risk_assessment.risk_label === 'Safe' ? 'standard dosing with regular monitoring' : 'discussing alternative pain medications with your doctor'}.`,
        references: ['CPIC Codeine-CYP2D6 Guideline v4.2', 'PharmGKB CYP2D6 Page', 'FDA Codeine Label Updates 2013']
      },
      WARFARIN: {
        summary: `Patient carries ${phenotype_data.alleles.map(a => a.allele).join('/')} alleles for CYP2C9. ${risk_assessment.supporting_evidence[0]}`,
        mechanism: `Warfarin is metabolized by CYP2C9 enzyme. Variants in this gene affect how quickly your body clears warfarin, influencing bleeding risk and INR levels.`,
        variant_interpretation: raw_variants.map(v => `${v.rsid}: This polymorphism alters CYP2C9 enzyme activity`),
        clinical_significance: `Your ${phenotype_data.phenotype} status indicates ${phenotype_data.metabolizer_type.toLowerCase()}, requiring ${risk_assessment.risk_label === 'Adjust Dosage' ? 'dose adjustment' : 'standard'} warfarin dosing.`,
        patient_education_summary: `Your genetics show you may need a different warfarin dose than most people. Close INR monitoring is essential. Work with your doctor on the right dose.`,
        references: ['CPIC Warfarin-CYP2C9 Guideline v2.1', 'FDA Warfarin dosing labels']
      },
      CLOPIDOGREL: {
        summary: `${risk_assessment.supporting_evidence[0]}`,
        mechanism: `Clopidogrel is a prodrug activated by CYP2C19. Your ${phenotype_data.phenotype} status affects how effectively clopidogrel prevents blood clots.`,
        variant_interpretation: raw_variants.map(v => `Detected variant ${v.rsid} at position ${v.chromosome}:${v.position}`),
        clinical_significance: `As a ${phenotype_data.phenotype}, you may have ${phenotype_data.phenotype === 'PM' ? 'reduced effectiveness' : 'normal effectiveness'} of clopidogrel for clot prevention.`,
        patient_education_summary: `Your genes affect how clopidogrel works in your body. Your doctor may recommend a different blood thinner medication that works better for your genetics.`,
        references: ['CPIC Clopidogrel-CYP2C19 Guideline v3.2', 'ACC/AHA Guidelines on Antiplatelet Use']
      },
      SIMVASTATIN: {
        summary: `SLCO1B1 genotype indicates ${phenotype_data.phenotype} transporter function. ${risk_assessment.supporting_evidence[0]}`,
        mechanism: `Simvastatin is transported into liver cells by SLCO1B1 protein. Genetic variants affecting this transporter influence statin concentration and myopathy risk.`,
        variant_interpretation: raw_variants.map(v => `Variant ${v.rsid}: Affects statin transporter efficiency`),
        clinical_significance: `Your ${phenotype_data.phenotype} transporter function indicates ${phenotype_data.phenotype === 'Reduced' ? 'increased myopathy risk with simvastatin' : 'normal statin metabolism'}.`,
        patient_education_summary: `Based on your genetics, ${phenotype_data.phenotype === 'Reduced' ? 'simvastatin may increase your risk of muscle pain. Your doctor may recommend a different statin.' : 'simvastatin is appropriate for you with standard monitoring'}`,
        references: ['CPIC Simvastatin-SLCO1B1 Guideline v1.2', 'Statin Safety Guidelines']
      },
      AZATHIOPRINE: {
        summary: `TPMT status: ${phenotype_data.phenotype}. ${risk_assessment.supporting_evidence[0]}`,
        mechanism: `TPMT enzyme inactivates azathioprine metabolites. Reduced enzyme activity leads to toxic 6-TGN accumulation causing bone marrow suppression.`,
        variant_interpretation: raw_variants.map(v => `${v.rsid}: Critical for TPMT enzyme function`),
        clinical_significance: `Your TPMT ${phenotype_data.phenotype} phenotype suggests ${phenotype_data.phenotype === 'Poor' ? 'severe toxicity risk' : 'need for dose adjustment'}.`,
        patient_education_summary: `Your genes affect how your body processes this immune medication. Close blood monitoring is needed, and dose adjustment may be necessary.`,
        references: ['CPIC TPMT-Thiopurine Guideline v4.1', 'IBD Pharmacogenetics Consensus']
      },
      FLUOROURACIL: {
        summary: `DPYD status: ${phenotype_data.phenotype}. ${risk_assessment.supporting_evidence[0]}`,
        mechanism: `DPYD enzyme breaks down fluorouracil. Deficiency causes toxic accumulation of active metabolites, leading to severe chemotherapy toxicity.`,
        variant_interpretation: raw_variants.map(v => `DPYD ${v.rsid}: Critical enzyme function variant`),
        clinical_significance: `Your DPYD ${phenotype_data.phenotype} status indicates ${phenotype_data.phenotype === 'Homozygous' ? 'absolute contraindication for fluorouracil' : 'need for dose reduction'}.`,
        patient_education_summary: `Your genes show reduced ability to process this chemotherapy drug safely. Alternative cancer treatments should be considered.`,
        references: ['CPIC DPYD-Fluoropyrimidine Guideline v3.1', 'FDA Fluorouracil Labeling 2018']
      }
    };

    const drugExplanation = explanations[drug] || explanations.CODEINE;

    return {
      summary: drugExplanation.summary,
      mechanism: drugExplanation.mechanism,
      variant_interpretation: drugExplanation.variant_interpretation,
      clinical_significance: drugExplanation.clinical_significance,
      patient_education_summary: drugExplanation.patient_education_summary,
      references: drugExplanation.references,
      generated_at: new Date().toISOString(),
      model_used: this.useMockResponses ? 'mock-llm' : this.model
    };
  }
}

module.exports = LLMService;
