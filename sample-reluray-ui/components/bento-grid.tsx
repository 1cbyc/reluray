"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Activity, Scan, BarChart3, Zap, Shield } from "lucide-react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function SystemStatus() {
  const [dots, setDots] = useState([true, true, true, false, true])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => prev.map(() => Math.random() > 0.2))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      {dots.map((active, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${active ? "bg-emerald-500" : "bg-zinc-700"}`}
          animate={active ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

function KeyboardCommand() {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPressed(true)
      setTimeout(() => setPressed(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1">
      <motion.kbd
        animate={pressed ? { scale: 0.95, y: 2 } : { scale: 1, y: 0 }}
        className="px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-300 font-mono"
      >
        ⌘
      </motion.kbd>
      <motion.kbd
        animate={pressed ? { scale: 0.95, y: 2 } : { scale: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-300 font-mono"
      >
        K
      </motion.kbd>
    </div>
  )
}

function AnimatedChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const points = [
    { x: 0, y: 60 },
    { x: 20, y: 45 },
    { x: 40, y: 55 },
    { x: 60, y: 30 },
    { x: 80, y: 40 },
    { x: 100, y: 15 },
  ]

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, "")

  return (
    <svg ref={ref} viewBox="0 0 100 70" className="w-full h-24">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(255,255,255)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="rgb(255,255,255)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {isInView && (
        <>
          <path d={`${pathD} L 100 70 L 0 70 Z`} fill="url(#chartGradient)" className="opacity-50" />
          <path d={pathD} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="draw-line" />
        </>
      )}
    </svg>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-instrument-sans)" }}
          >
            Advanced AI Medical Imaging
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            State-of-the-art deep learning technology for accurate pneumonia detection. Fast, reliable, and trusted by healthcare professionals.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Large card - AI Analysis */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/30 border border-zinc-800 hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-fit mb-4">
                  <Activity className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analysis</h3>
                <p className="text-zinc-400 text-sm">
                  Advanced deep learning model trained on thousands of medical images for accurate pneumonia detection from chest X-rays.
                </p>
              </div>
              <SystemStatus />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Accuracy", value: "94.2%" },
                { label: "Speed", value: "<3s" },
                { label: "Analyses", value: "10K+" },
                { label: "Uptime", value: "99.9%" }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-zinc-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Instant Upload */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-fit mb-4">
              <Scan className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Upload</h3>
            <p className="text-zinc-400 text-sm mb-6">Upload chest X-ray images and receive AI-powered analysis results within seconds.</p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <span className="font-mono">JPEG, PNG, DICOM</span>
            </div>
          </motion.div>

          {/* Detailed Reports */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 w-fit mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Detailed Reports</h3>
            <p className="text-zinc-400 text-sm mb-4">Comprehensive analysis with confidence scores and diagnostic insights.</p>
            <AnimatedChart />
          </motion.div>

          {/* Lightning Fast */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 w-fit mb-4">
              <Zap className="w-5 h-5 text-yellow-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Get diagnostic insights in under 3 seconds with our optimized neural network architecture.
            </p>
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <span className="font-mono">~2.5s</span>
              <span className="text-zinc-500">avg analysis</span>
            </div>
          </motion.div>

          {/* Medical Grade Security */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mb-4">
              <Shield className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Medical Grade Security</h3>
            <p className="text-zinc-400 text-sm mb-4">HIPAA compliant with end-to-end encryption. Your patient data is always protected.</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">HIPAA</span>
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">Encrypted</span>
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">Secure</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
