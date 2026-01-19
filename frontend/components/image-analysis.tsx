"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, XCircle } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { ResultDisplay } from "./result-display"
import { healthCheck, predictImage, PredictResponse } from "../lib/api"
import { Card } from "./ui/card"

export function ImageAnalysis() {
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'unavailable'>('checking')

  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      await healthCheck()
      setApiStatus('healthy')
    } catch (error: any) {
      // Silently handle API unavailability - this is expected if backend isn't running
      if (error?.code !== 'ECONNABORTED') {
        console.warn('ReluRay AI service unavailable, using demo mode')
      }
      setApiStatus('unavailable')
    }
  }

  const handleImageUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Wait for health check to complete if still checking
      if (apiStatus === 'checking') {
        await checkApiHealth()
      }

      // Convert file to base64
      const base64Image = await fileToBase64(file)
      
      if (apiStatus === 'healthy') {
        // Use real API
        const apiResult = await predictImage(base64Image)
        setResult(apiResult)
      } else {
        // Fallback to mock data
        await new Promise(resolve => setTimeout(resolve, 2000))
        const mockResult: PredictResponse = {
          prediction: Math.random() > 0.5 ? 'Pneumonia' : 'Normal',
          confidence: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
          timestamp: new Date().toISOString(),
          processing_time: 2.0,
          status: 'success'
        }
        setResult(mockResult)
      }
    } catch (err: any) {
      console.error('Analysis failed:', err)
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <section id="analyze" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* API Status Indicator */}
        {apiStatus === 'checking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="text-center p-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm text-zinc-400">Checking AI service...</p>
            </Card>
          </motion.div>
        )}

        {apiStatus === 'unavailable' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="bg-yellow-950/50 border-yellow-800 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-300 mb-1">Demo Mode</h4>
                  <p className="text-sm text-yellow-400/80">
                    AI service unavailable. Running in demo mode with simulated results.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <ImageUpload onUpload={handleImageUpload} loading={loading} />
          </Card>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="bg-red-950/50 border-red-800 p-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-300 mb-1">Analysis Failed</h4>
                    <p className="text-sm text-red-400/80">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Display */}
        <AnimatePresence>
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
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-yellow-950/50 border-yellow-800 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-300 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-yellow-400/80">
                  This tool is for educational and research purposes only. It is not intended to replace professional medical diagnosis. 
                  Always consult with a qualified healthcare provider for medical decisions. Results should not be used as the sole basis 
                  for treatment decisions.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
