import React from 'react';
import '../styles/RiskAssessment.css';

const RiskAssessment = ({ risk, drug, gene, phenotype }) => {
  const getRiskColor = (label) => {
    switch (label) {
      case 'Safe':
        return 'safe';
      case 'Adjust Dosage':
        return 'adjust';
      case 'Toxic':
      case 'Ineffective':
        return 'critical';
      case 'Monitor Needed':
        return 'warning';
      default:
        return 'unknown';
    }
  };

  const getSeverityEmoji = (severity) => {
    switch (severity) {
      case 'none':
        return '✓';
      case 'low':
        return '⚠';
      case 'moderate':
        return '⚠️';
      case 'high':
        return '🔴';
      case 'critical':
        return '🛑';
      default:
        return '❓';
    }
  };

  return (
    <div className="risk-assessment">
      <div className={`risk-badge ${getRiskColor(risk.risk_label)}`}>
        <div className="badge-content">
          <div className="risk-label">{risk.risk_label}</div>
          <div className="badge-bar">
            <span className="severity-indicator">{getSeverityEmoji(risk.severity)}</span>
            <span className="severity-text">{risk.severity.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="assessment-details">
        <div className="detail-item">
          <label>Drug:</label>
          <span className="drug-name">{drug}</span>
        </div>
        
        <div className="detail-item">
          <label>Gene:</label>
          <span className="gene-name">{gene}</span>
        </div>

        <div className="detail-item">
          <label>Phenotype:</label>
          <span className="phenotype-badge">{phenotype}</span>
        </div>

        <div className="detail-item">
          <label>Confidence:</label>
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ width: `${risk.confidence_score * 100}%` }}
            />
            <span className="confidence-text">
              {(risk.confidence_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {risk.supporting_evidence && risk.supporting_evidence.length > 0 && (
        <div className="supporting-evidence">
          <h4>Supporting Evidence:</h4>
          <ul>
            {risk.supporting_evidence.map((evidence, idx) => (
              <li key={idx}>{evidence}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
