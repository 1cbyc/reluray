import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, AlertTriangle, XCircle } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import { predictImage, healthCheck } from './services/api';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
import { Card } from './components/ui/card';

function HomePage() {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [apiStatus, setApiStatus] = React.useState('checking');

  React.useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await healthCheck();
      setApiStatus('healthy');
    } catch (error) {
      console.warn('API not available, using mock mode:', error);
      setApiStatus('unavailable');
    }
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);
      
      if (apiStatus === 'healthy') {
        // Use real API
        const apiResult = await predictImage(base64Image);
        setResult({
          prediction: apiResult.prediction,
          confidence: apiResult.confidence,
          timestamp: apiResult.timestamp
        });
      } else {
        // Fallback to mock data
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockResult = {
          prediction: Math.random() > 0.5 ? 'Pneumonia' : 'Normal',
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
          timestamp: new Date().toISOString()
        };
        setResult(mockResult);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* API Status Indicator */}
          {apiStatus === 'checking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="medical-card mb-6 text-center"
            >
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-medical-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Checking AI service...</p>
            </motion.div>
          )}

          {apiStatus === 'unavailable' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="medical-card mb-6 border-l-4 border-health-warning bg-yellow-50"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-health-warning mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">Demo Mode</h3>
                  <p className="text-xs text-yellow-700">AI service unavailable. Running in demo mode with simulated results.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gradient mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Pneumonia Detection AI
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Advanced AI-powered analysis of chest X-ray images for instant pneumonia detection. 
              Free, accurate, and confidential.
            </motion.p>
            
            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="medical-card text-center">
                <Activity className="w-12 h-12 text-medical-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-gray-600">Get analysis results in seconds</p>
              </div>
              <div className="medical-card text-center">
                <Shield className="w-12 h-12 text-medical-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">100% Free</h3>
                <p className="text-gray-600">No cost, no registration required</p>
              </div>
              <div className="medical-card text-center">
                <Heart className="w-12 h-12 text-medical-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Medical Grade</h3>
                <p className="text-gray-600">Trained on thousands of X-rays</p>
              </div>
            </motion.div>
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="medical-card mb-8"
          >
            <ImageUpload onUpload={handleImageUpload} loading={loading} />
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="medical-card text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Image...</h3>
                <p className="text-gray-600">Our AI is examining your X-ray for signs of pneumonia</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="medical-card border-l-4 border-health-danger bg-red-50"
              >
                <div className="flex items-center">
                  <XCircle className="w-6 h-6 text-health-danger mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Analysis Failed</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResultDisplay result={result} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="medical-card mt-8 bg-yellow-50 border-l-4 border-health-warning"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-health-warning mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  This tool is for educational and research purposes only. It is not intended to replace professional medical diagnosis. 
                  Always consult with a qualified healthcare provider for medical decisions. Results should not be used as the sole basis 
                  for treatment decisions.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
      </Routes>
    </Router>
  );
}

export default App; 