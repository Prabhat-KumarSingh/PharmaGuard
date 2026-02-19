import React, { useState } from 'react';
import '../styles/ResultsDisplay.css';

const ResultsDisplay = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const downloadJSON = (result) => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${result.patient_id}-${result.drug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (result) => {
    const jsonStr = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert('JSON copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // const getRiskColor = (label) => {
  //   switch (label) {
  //     case 'Safe':
  //       return '#27ae60';
  //     case 'Adjust Dosage':
  //       return '#f39c12';
  //     case 'Toxic':
  //     case 'Ineffective':
  //       return '#e74c3c';
  //     case 'Monitor Needed':
  //       return '#f39c12';
  //     default:
  //       return '#95a5a6';
  //   }
  // };


  return (
    <div className="results-display">
      {results && results.length > 0 ? (
        <div className="results-list">
          {results.map((result, idx) => (
            <div key={idx} className="result-card">
              <div className="result-header">
                <div className="result-info">
                  <h3>{result.drug}</h3>
                  <p className="patient-id">Patient ID: {result.patient_id}</p>
                  <p className="timestamp">{new Date(result.timestamp).toLocaleString()}</p>
                </div>
                {/* <div 
                  className="risk-indicator"
                  style={{ backgroundColor: getRiskColor(result.risk_assessment.risk_label) }}
                >
                  <span className="risk-text">{result.risk_assessment.risk_label}</span>
                </div> */}
              </div>

              <div className="result-content">
                {/* Risk Assessment Section */}
                <div className="section">
                  <button 
                    className="section-toggle"
                    onClick={() => toggleSection(`risk-${idx}`)}
                  >
                    <span className="toggle-icon">
                      {expandedSections[`risk-${idx}`] ? '▼' : '▶'}
                    </span>
                    🎯 Risk Assessment
                  </button>
                  {expandedSections[`risk-${idx}`] && (
                    <div className="section-content">
                      <p><strong>Risk Label:</strong> {result.risk_assessment.risk_label}</p>
                      <p><strong>Severity:</strong> {result.risk_assessment.severity}</p>
                      <p><strong>Confidence:</strong> {(result.risk_assessment.confidence_score * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>

                {/* Pharmacogenomic Profile Section */}
                <div className="section">
                  <button 
                    className="section-toggle"
                    onClick={() => toggleSection(`pgx-${idx}`)}
                  >
                    <span className="toggle-icon">
                      {expandedSections[`pgx-${idx}`] ? '▼' : '▶'}
                    </span>
                    🧬 Pharmacogenomic Profile
                  </button>
                  {expandedSections[`pgx-${idx}`] && (
                    <div className="section-content">
                      <p><strong>Gene:</strong> {result.pharmacogenomic_profile.primary_gene}</p>
                      <p><strong>Diplotype:</strong> {result.pharmacogenomic_profile.diplotype}</p>
                      <p><strong>Phenotype:</strong> {result.pharmacogenomic_profile.phenotype}</p>
                      <div className="variants-list">
                        <p><strong>Detected Variants:</strong></p>
                        <ul>
                          {result.pharmacogenomic_profile.detected_variants.map((v, i) => (
                            <li key={i}>{v.rsid}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clinical Recommendation Section */}
                <div className="section">
                  <button 
                    className="section-toggle"
                    onClick={() => toggleSection(`clinical-${idx}`)}
                  >
                    <span className="toggle-icon">
                      {expandedSections[`clinical-${idx}`] ? '▼' : '▶'}
                    </span>
                    💊 Clinical Recommendation
                  </button>
                  {expandedSections[`clinical-${idx}`] && (
                    <div className="section-content">
                      <p><strong>Dosage Adjustment:</strong> {result.clinical_recommendation.dosage_adjustment}</p>
                      {result.clinical_recommendation.alternative_drugs && result.clinical_recommendation.alternative_drugs.length > 0 && (
                        <div>
                          <p><strong>Alternative Drugs:</strong></p>
                          <ul>
                            {result.clinical_recommendation.alternative_drugs.map((drug, i) => (
                              <li key={i}>{drug}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.clinical_recommendation.monitoring_requirements && (
                        <div>
                          <p><strong>Monitoring:</strong></p>
                          <ul>
                            {result.clinical_recommendation.monitoring_requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p><strong>Evidence Level:</strong> {result.clinical_recommendation.evidence_level}</p>
                    </div>
                  )}
                </div>

                {/* LLM Explanation Section */}
                <div className="section">
                  <button 
                    className="section-toggle"
                    onClick={() => toggleSection(`llm-${idx}`)}
                  >
                    <span className="toggle-icon">
                      {expandedSections[`llm-${idx}`] ? '▼' : '▶'}
                    </span>
                    🤖 Clinical Explanation (AI-Generated)
                  </button>
                  {expandedSections[`llm-${idx}`] && (
                    <div className="section-content">
                      {result.llm_generated_explanation && (
                        <>
                          <div className="explanation-item">
                            <h5>Summary</h5>
                            <p>{result.llm_generated_explanation.summary}</p>
                          </div>
                          <div className="explanation-item">
                            <h5>Mechanism</h5>
                            <p>{result.llm_generated_explanation.mechanism}</p>
                          </div>
                          <div className="explanation-item">
                            <h5>Clinical Significance</h5>
                            <p>{result.llm_generated_explanation.clinical_significance}</p>
                          </div>
                          <div className="explanation-item">
                            <h5>Patient Education</h5>
                            <p>{result.llm_generated_explanation.patient_education_summary}</p>
                          </div>
                          {result.llm_generated_explanation.references && (
                            <div className="explanation-item">
                              <h5>References</h5>
                              <ul>
                                {result.llm_generated_explanation.references.map((ref, i) => (
                                  <li key={i}>{ref}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Quality Metrics Section */}
                <div className="section">
                  <button 
                    className="section-toggle"
                    onClick={() => toggleSection(`quality-${idx}`)}
                  >
                    <span className="toggle-icon">
                      {expandedSections[`quality-${idx}`] ? '▼' : '▶'}
                    </span>
                    ✓ Quality Metrics
                  </button>
                  {expandedSections[`quality-${idx}`] && (
                    <div className="section-content">
                      <p><strong>VCF Parsing:</strong> {result.quality_metrics.vcf_parsing_success ? '✓ Success' : '✗ Failed'}</p>
                      <p><strong>Variant Mapping:</strong> {result.quality_metrics.variant_mapping_success ? '✓ Success' : '✗ Failed'}</p>
                      <p><strong>Annotation Completeness:</strong> {(result.quality_metrics.annotation_completeness * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="result-actions">
                <button 
                  className="action-button download"
                  onClick={() => downloadJSON(result)}
                  title="Download as JSON"
                >
                  📥 Download JSON
                </button>
                <button 
                  className="action-button copy"
                  onClick={() => copyToClipboard(result)}
                  title="Copy to clipboard"
                >
                  📋 Copy JSON
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No results yet. Upload a VCF file to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
