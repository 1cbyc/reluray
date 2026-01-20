import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for image processing
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  timestamp: string;
  version: string;
}

export interface PredictResponse {
  prediction: string;
  confidence: number;
  raw_confidence?: number;
  timestamp: string;
  processing_time: number;
  status: string;
}

export interface ModelInfoResponse {
  model_name: string;
  architecture: string;
  training_data: string;
  classes: string[];
  input_size: string;
  framework: string;
  model_loaded: boolean;
  status: string;
}

export const healthCheck = async (): Promise<HealthResponse> => {
  try {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const predictImage = async (imageData: string): Promise<PredictResponse> => {
  try {
    const response = await api.post<PredictResponse>('/predict', {
      image: imageData
    });
    return response.data;
  } catch (error) {
    console.error('Prediction failed:', error);
    throw error;
  }
};

export const getModelInfo = async (): Promise<ModelInfoResponse> => {
  try {
    const response = await api.get<ModelInfoResponse>('/info');
    return response.data;
  } catch (error) {
    console.error('Failed to get model info:', error);
    throw error;
  }
};

export default api;
