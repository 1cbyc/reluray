"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useCallback } from "react"
import { Upload, X, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyzeImage, validateImageFile, fileToBase64, ReluRayAPIError } from "@/lib/api"

interface AnalysisResult {
  prediction: string
  confidence: number
  timestamp: string
  processing_time: number
}

export function UploadAnalyze() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)
    setError(null)
    setResult(null)

    // Create preview
    try {
      const base64 = await fileToBase64(file)
      setPreview(base64)
    } catch (err) {
      setError('Failed to load image preview')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const data = await analyzeImage(preview)
      setResult(data)
    } catch (err) {
      if (err instanceof ReluRayAPIError) {
        setError(err.detail || err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <section id="analyze" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-instrument-sans)" }}
          >
            Analyze Chest X-Ray
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Upload a chest X-ray image and get instant AI-powered pneumonia detection results
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Upload Area */}
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
                preview
                  ? 'border-blue-500/50 bg-zinc-900'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'
              } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {preview ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={preview}
                    alt="X-ray preview"
                    className="w-full h-full object-contain bg-black"
                  />
                  {!isAnalyzing && !result && (
                    <button
                      onClick={handleReset}
                      className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center p-8">
                  <div className="p-4 rounded-full bg-zinc-800/50 mb-4">
                    <Upload className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Upload X-Ray Image</h3>
                  <p className="text-sm text-zinc-400 text-center mb-4">
                    Drag and drop or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-full"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <p className="text-xs text-zinc-500 mt-4">
                    Supports JPEG, PNG • Max 10MB
                  </p>
                </div>
              )}
            </div>

            {selectedFile && !result && (
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-full h-12 text-base font-medium disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze X-Ray'
                )}
              </Button>
            )}

            {result && (
              <Button
                onClick={handleReset}
                className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-full h-12 text-base font-medium"
              >
                Analyze Another Image
              </Button>
            )}
          </div>

          {/* Results Area */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            {!result && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-zinc-800/50 mb-4">
                  <ImageIcon className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-500">
                  {selectedFile ? 'Click "Analyze X-Ray" to get results' : 'Upload an X-ray image to begin analysis'}
                </p>
              </div>
            )}

            {error && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="p-4 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analysis Failed</h3>
                <p className="text-sm text-zinc-400 text-center">{error}</p>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`p-4 rounded-full ${
                      result.prediction === 'Normal' ? 'bg-emerald-500/10' : 'bg-yellow-500/10'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-12 h-12 ${
                        result.prediction === 'Normal' ? 'text-emerald-500' : 'text-yellow-500'
                      }`}
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {result.prediction}
                </h3>

                <div className="space-y-4 mt-6">
                  <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Confidence Score</span>
                      <span className="text-lg font-bold text-white">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          result.prediction === 'Normal'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <p className="text-xs text-zinc-500 mb-1">Processing Time</p>
                      <p className="text-lg font-semibold text-white">{result.processing_time.toFixed(2)}s</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <p className="text-xs text-zinc-500 mb-1">Analysis Date</p>
                      <p className="text-lg font-semibold text-white">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-blue-400 font-medium mb-1">⚕️ Medical Disclaimer</p>
                    <p className="text-xs text-zinc-400">
                      This AI analysis is for informational purposes only and should not replace professional medical diagnosis.
                      Always consult with a qualified healthcare provider.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
