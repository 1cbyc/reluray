"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Basic",
    description: "For clinicians & researchers to try AI-powered chest X-ray analysis.",
    price: { monthly: 0, yearly: 0 },
    yearlyLabel: "Free forever",
    features: [
      "Upload & analyze chest X-rays instantly",
      "No account needed",
      "Confidential and secure",
      "Sample/mock mode fallback",
      "AI-powered diagnosis",
      "Visualization of results",
    ],
    cta: "Get Started Free",
    highlighted: true,
    ctaLink: "#image-analysis",
  },
  {
    name: "Pro (Coming Soon)",
    description: "For medical groups, teams, and organizations that need more power & support.",
    price: { monthly: 39, yearly: 28 },
    yearlyLabel: "$336/year",
    features: [
      "Everything in Basic",
      "Team dashboard & user management",
      "Usage statistics & audit logs",
      "Priority support",
      "Higher API rate limits",
      "Bulk/pipeline uploads",
      "Integration & developer API",
      "Business Associate Agreement (BAA)",
    ],
    cta: "Contact Us",
    highlighted: false,
    ctaLink: "mailto:hello@reluray.com?subject=ReluRay%20Pro%20Inquiry",
  },
]

function BorderGlow() {
  return (
    <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-40 bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
    </div>
  )
}

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-24 px-4 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl tracking-tight font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-instrument-sans)" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Instantly upload a chest X-ray and see AI-powered analysis for{" "}
            <span className="text-emerald-400 font-medium">free</span>. Always confidential.
          </p>
          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "monthly" ? "text-white" : "text-zinc-400"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-zinc-800 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "yearly" ? "text-white" : "text-zinc-400"
              }`}
            >
              {billingCycle === "yearly" && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-zinc-800 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 ml-2 px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                -28%
              </span>
            </button>
          </div>
        </motion.div>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.32 + index * 0.11 }}
              className={`relative p-8 rounded-2xl shadow-xl border group transition hover:scale-[1.015] ${
                plan.highlighted
                  ? "bg-zinc-900 border-emerald-800 ring-1 ring-emerald-900/20"
                  : "bg-zinc-900/70 border-zinc-800 hover:border-emerald-900"
              }`}
            >
              {plan.highlighted && <BorderGlow />}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-zinc-400 text-sm">{plan.description}</p>
              </div>
              <div className="mb-8 flex items-center gap-3 min-h-[48px]">
                {plan.price[billingCycle] === 0 ? (
                  <>
                    <span className="text-4xl font-bold text-white">Free</span>
                    <span
                      className={`text-xs py-1 px-3 rounded-full font-medium ${
                        plan.highlighted
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-zinc-700/40 text-zinc-300"
                      }`}
                    >
                      {plan.yearlyLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-zinc-400 text-base">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                    {billingCycle === "yearly" && (
                      <span className="text-xs py-1 px-3 rounded-full font-medium bg-emerald-500/10 text-emerald-300">
                        {plan.yearlyLabel}
                      </span>
                    )}
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-zinc-300"
                  >
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={1.7} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full rounded-full py-3 font-medium ${
                  plan.highlighted
                    ? "shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                }`}
                tabIndex={0}
              >
                <a
                  href={plan.ctaLink}
                  target={plan.ctaLink.startsWith("mailto:") ? "_blank" : undefined}
                  rel={plan.ctaLink.startsWith("mailto:") ? "noopener noreferrer" : undefined}
                >
                  {plan.cta}
                </a>
              </Button>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-center text-zinc-500 text-xs mt-12 max-w-xl mx-auto">
          <span className="font-medium text-zinc-400">Not for clinical decision making.</span>{" "}
          ReluRay is for research and educational use only. Data is never stored or shared.
        </p>
      </div>
    </section>
  )
}
