import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for image processing
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const predictImage = async (imageData) => {
  try {
    const response = await api.post('/predict', {
      image: imageData
    });
    return response.data;
  } catch (error) {
    console.error('Prediction failed:', error);
    throw error;
  }
};

export const getModelInfo = async () => {
  try {
    const response = await api.get('/info');
    return response.data;
  } catch (error) {
    console.error('Failed to get model info:', error);
    throw error;
  }
};

export default api; 