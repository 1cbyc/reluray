"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, TrendingUp, Clock, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ResultDisplayProps {
  result: {
    prediction: string
    confidence: number
    timestamp: string
  }
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const isNormal = result.prediction === 'Normal'
  const confidence = parseFloat(result.confidence.toString())
  
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'text-emerald-500'
    if (conf >= 0.8) return 'text-blue-500'
    if (conf >= 0.7) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getConfidenceText = (conf: number) => {
    if (conf >= 0.9) return 'Very High'
    if (conf >= 0.8) return 'High'
    if (conf >= 0.7) return 'Moderate'
    return 'Low'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {isNormal ? (
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-2xl font-bold text-white">
              {isNormal ? 'Normal Chest X-Ray' : 'Pneumonia Detected'}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isNormal 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isNormal ? 'Normal' : 'Pneumonia'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="font-medium text-zinc-300">Confidence</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getConfidenceColor(confidence)}`}>
                      {(confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-zinc-500">
                      {getConfidenceText(confidence)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="font-medium text-zinc-300">Analysis Time</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="font-medium text-zinc-300">AI Model</span>
                  </div>
                  <div className="space-y-2 text-sm text-zinc-400">
                    <div>• VGG16 Transfer Learning</div>
                    <div>• Trained on 5,000+ X-rays</div>
                    <div>• Medical-grade accuracy</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="p-4">
                  <h4 className="font-medium text-zinc-300 mb-2">What this means:</h4>
                  <p className="text-sm text-zinc-400">
                    {isNormal 
                      ? "No signs of pneumonia detected in your chest X-ray. The lungs appear normal."
                      : "Signs of pneumonia detected. Please consult with a healthcare professional for proper diagnosis and treatment."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-blue-950/50 border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-300 mb-1">Next Steps</h4>
                  <p className="text-sm text-blue-400/80">
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
  )
}
