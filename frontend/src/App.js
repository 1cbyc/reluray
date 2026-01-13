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
    <div className="min-h-screen bg-starlink-gray-50">
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
            >
              <Card className="mb-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-starlink-black mx-auto mb-2"></div>
                <p className="text-sm text-starlink-gray-600">Checking AI service...</p>
              </Card>
            </motion.div>
          )}

          {apiStatus === 'unavailable' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Demo Mode</AlertTitle>
                <AlertDescription>
                  AI service unavailable. Running in demo mode with simulated results.
                </AlertDescription>
              </Alert>
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
              ReluRay
            </motion.h1>
            <motion.p 
              className="text-xl text-starlink-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Advanced AI-powered medical image analysis. Instant, accurate, and confidential.
            </motion.p>
            
            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="text-center">
                <Activity className="w-12 h-12 text-starlink-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-starlink-gray-600">Get analysis results in seconds</p>
              </Card>
              <Card className="text-center">
                <Shield className="w-12 h-12 text-starlink-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">100% Free</h3>
                <p className="text-starlink-gray-600">No cost, no registration required</p>
              </Card>
              <Card className="text-center">
                <Activity className="w-12 h-12 text-starlink-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Medical Grade</h3>
                <p className="text-starlink-gray-600">Trained on thousands of X-rays</p>
              </Card>
            </motion.div>
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <Card>
              <ImageUpload onUpload={handleImageUpload} loading={loading} />
            </Card>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-starlink-black"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-starlink-black mb-2">Analyzing Image...</h3>
                  <p className="text-starlink-gray-600">Our AI is analyzing your medical image</p>
                </Card>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Analysis Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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
            className="mt-8"
          >
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Disclaimer</AlertTitle>
              <AlertDescription>
                This tool is for educational and research purposes only. It is not intended to replace professional medical diagnosis. 
                Always consult with a qualified healthcare provider for medical decisions. Results should not be used as the sole basis 
                for treatment decisions.
              </AlertDescription>
            </Alert>
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