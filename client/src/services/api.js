import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pharmaguard-uox4.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const analyzeVCF = async (vcfFile, drug) => {
  const formData = new FormData();
  formData.append('vcf_file', vcfFile);
  formData.append('drug', drug);

  try {
    const response = await api.post('/analysis/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAnalysisResult = async (id) => {
  try {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPatientResults = async (patientId) => {
  try {
    const response = await api.get(`/analysis/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllResults = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/analysis', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;










