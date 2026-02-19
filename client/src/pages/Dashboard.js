import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsDisplay from '../components/ResultsDisplay';
import { analyzeVCF, healthCheck } from '../services/api';
// import '../styles/Dashboard.css';

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    // Check server health on component mount
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await healthCheck();
      setServerStatus('online');
    } catch (err) {
      setServerStatus('offline');
      setError('⚠️ Server is not responding. Some features may not work.');
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
  };

  const handleDrugChange = (drug) => {
    setSelectedDrug(drug);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a VCF file');
      return;
    }

    if (!selectedDrug.trim()) {
      setError('Please enter at least one drug name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await analyzeVCF(selectedFile, selectedDrug);
      
      if (response.success) {
        setResults(response.data || []);
        setError('');
      } else {
        setError(response.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.error || 
        err.message || 
        'Failed to analyze VCF file. Please check the file format and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="title-section">
            <h1>🧬 PharmaGuard</h1>
            <p className="subtitle">AI-Powered Pharmacogenomics Analysis</p>
          </div>
          <div className="server-status">
            <span className={`status-indicator ${serverStatus}`} />
            <span className="status-text">
              {serverStatus === 'online' ? '✓ Server Online' : 
               serverStatus === 'offline' ? '✗ Server Offline' : 
               '⟳ Checking...'}
            </span>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="content-wrapper">
          <section className="input-section">
            <FileUpload 
              onFileSelect={handleFileSelect}
              onDrugChange={handleDrugChange}
              isLoading={isLoading}
            />

            <div className="analyze-section">
              <button 
                className={`analyze-button ${isLoading ? 'loading' : ''}`}
                onClick={handleAnalyze}
                disabled={isLoading || !selectedFile || !selectedDrug}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🚀</span>
                    Analyze Patient
                  </>
                )}
              </button>

              {error && (
                <div className="error-message">
                  <p>❌ {error}</p>
                </div>
              )}
            </div>
          </section>

          <section className="results-section">
            <h2>📊 Analysis Results</h2>
            <ResultsDisplay results={results} />
          </section>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>
          ⚕️ <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. 
          Not for clinical decision-making. Consult healthcare professionals for medication guidance.
        </p>
        <p className="footer-links">
          <a href="#privacy">Privacy Policy</a> • 
          <a href="#terms">Terms of Use</a> • 
          <a href="#contact">Contact</a>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
