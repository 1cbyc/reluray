import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const ResultDisplay = ({ result }) => {
  const isNormal = result.prediction === 'Normal';
  const confidence = parseFloat(result.confidence);
  
  const getConfidenceColor = (conf) => {
    if (conf >= 0.9) return 'text-green-600';
    if (conf >= 0.8) return 'text-blue-600';
    if (conf >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (conf) => {
    if (conf >= 0.9) return 'Very High';
    if (conf >= 0.8) return 'High';
    if (conf >= 0.7) return 'Moderate';
    return 'Low';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`result-card ${isNormal ? 'result-normal' : 'result-pneumonia'}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {isNormal ? (
            <CheckCircle className="w-12 h-12 text-green-600" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-2xl font-bold text-starlink-black">
              {isNormal ? 'Normal Chest X-Ray' : 'Pneumonia Detected'}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isNormal 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isNormal ? 'Normal' : 'Pneumonia'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-starlink-black" />
                    <span className="font-medium text-starlink-gray-700">Confidence</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getConfidenceColor(confidence)}`}>
                      {(confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-starlink-gray-500">
                      {getConfidenceText(confidence)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-starlink-black" />
                    <span className="font-medium text-starlink-gray-700">Analysis Time</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-starlink-black">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-starlink-gray-500">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-starlink-black" />
                    <span className="font-medium text-starlink-gray-700">AI Model</span>
                  </div>
                  <div className="space-y-2 text-sm text-starlink-gray-600">
                    <div>• VGG16 Transfer Learning</div>
                    <div>• Trained on 5,000+ X-rays</div>
                    <div>• Medical-grade accuracy</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-starlink-gray-700 mb-2">What this means:</h4>
                  <p className="text-sm text-starlink-gray-600">
                    {isNormal 
                      ? "No signs of pneumonia detected in your chest X-ray. The lungs appear normal."
                      : "Signs of pneumonia detected. Please consult with a healthcare professional for proper diagnosis and treatment."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Next Steps</h4>
                  <p className="text-sm text-blue-700">
                    {isNormal 
                      ? "Continue monitoring your health. If you experience symptoms, consult a healthcare provider."
                      : "Schedule an appointment with your doctor or visit an urgent care facility for proper medical evaluation."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDisplay; 