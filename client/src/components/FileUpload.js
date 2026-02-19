import React, { useState, useRef } from 'react';
import '../styles/FileUpload.css';

const FileUpload = ({ onFileSelect, onDrugChange, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [drug, setDrug] = useState('');
  const fileInputRef = useRef(null);

  const supportedDrugs = [
    'CODEINE',
    'WARFARIN',
    'CLOPIDOGREL',
    'SIMVASTATIN',
    'AZATHIOPRINE',
    'FLUOROURACIL'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.vcf')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Please drop a .vcf file');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.vcf')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Please select a .vcf file');
      }
    }
  };

  const handleDrugChange = (e) => {
    const value = e.target.value;
    setDrug(value);
    onDrugChange(value);
  };

  const handleDrugButtonClick = (drugName) => {
    setDrug(drugName);
    onDrugChange(drugName);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <h2>📤 Upload VCF File</h2>
        
        <div
          className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="zone-content">
            <p className="drag-icon">📁</p>
            <p className="main-text">Drag and drop your VCF file here</p>
            <p className="sub-text">or click to browse</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".vcf"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>

        {selectedFile && (
          <div className="file-info">
            <p className="file-name">✓ {selectedFile.name}</p>
            <p className="file-size">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
          </div>
        )}

        <div className="file-requirements">
          <p><strong>Requirements:</strong></p>
          <ul>
            <li>Format: VCF v4.2</li>
            <li>Max size: 5 MB</li>
            <li>Includes gene annotations (GENE, STAR tags)</li>
          </ul>
        </div>
      </div>

      <div className="drug-selection-section">
        <h2>💊 Select Drug(s)</h2>
        
        <div className="drug-input-group">
          <label htmlFor="drug-input">Drug Name (comma-separated for multiple):</label>
          <input
            id="drug-input"
            type="text"
            placeholder="e.g., CODEINE or WARFARIN, SIMVASTATIN"
            value={drug}
            onChange={handleDrugChange}
            disabled={isLoading}
          />
        </div>

        <div className="quick-selection">
          <p className="quick-select-label">Quick Select:</p>
          <div className="drug-buttons">
            {supportedDrugs.map((drugName) => (
              <button
                key={drugName}
                className={`drug-button ${drug.toUpperCase().includes(drugName) ? 'active' : ''}`}
                onClick={() => handleDrugButtonClick(drugName)}
                disabled={isLoading}
              >
                {drugName}
              </button>
            ))}
          </div>
        </div>

        <div className="supported-drugs">
          <p><strong>Supported Drugs:</strong></p>
          <ul>
            <li><strong>CODEINE</strong> - Opioid analgesic (CYP2D6)</li>
            <li><strong>WARFARIN</strong> - Anticoagulant (CYP2C9)</li>
            <li><strong>CLOPIDOGREL</strong> - Antiplatelet (CYP2C19)</li>
            <li><strong>SIMVASTATIN</strong> - Statin (SLCO1B1)</li>
            <li><strong>AZATHIOPRINE</strong> - Immunosuppressant (TPMT)</li>
            <li><strong>FLUOROURACIL</strong> - Chemotherapy (DPYD)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
