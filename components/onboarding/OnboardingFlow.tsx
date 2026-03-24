"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/store/store"
import { Check, ChevronRight, Globe } from "lucide-react"
import { MARKETS, MarketRegion } from "@/lib/markets"

export function OnboardingFlow() {
  const { hasCompletedOnboarding, setHasCompletedOnboarding, setExperienceLevel, selectedMarket, setSelectedMarket } = useStore()
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Delay trigger slightly
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || hasCompletedOnboarding) return null

  const finish = (level: 'beginner' | 'intermediate' | 'experienced') => {
    setExperienceLevel(level)
    setHasCompletedOnboarding(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="w-full max-w-xl bg-[#111827] border border-gray-700/50 rounded-2xl shadow-2xl shadow-tvGreen/10 overflow-hidden relative"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-tvGreen" style={{ width: `${(step / 3) * 100}%`, transition: 'width 0.4s ease' }} />

          {step === 1 && (
            <div className="p-8 md:p-12 text-center space-y-6">
              <span className="text-7xl block mb-4 animate-bounce">👋</span>
              <h2 className="text-3xl font-extrabold text-white font-heading">Welcome to StoxPilot!</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                We simplify the stock market using pure mathematics. No AI guesswork, no confusing jargon. Just explicit <strong>educational</strong> technical indicators.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="mt-8 w-full py-4 bg-tvGreen text-white font-bold rounded-xl text-lg hover:bg-tvGreen/90 transition-transform hover:-translate-y-1 active:scale-95 flex items-center justify-center"
              >
                Get Started <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 md:p-12 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white font-heading mb-2">Select Your Market</h2>
                <p className="text-gray-400">Choose the region you primarily trade in.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.values(MARKETS).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMarket(m.id as MarketRegion);
                      setStep(3);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col items-center gap-2 ${
                      selectedMarket === m.id 
                        ? 'bg-tvGreen/10 border-tvGreen' 
                        : 'bg-[#1E222D] border-gray-700 hover:border-tvGreen/30'
                    }`}
                  >
                    <span className="text-4xl">{m.flag}</span>
                    <div className="text-center">
                      <p className="font-bold text-white text-sm">{m.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{m.currency}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 md:p-12 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white font-heading mb-2">What&apos;s your experience?</h2>
                <p className="text-gray-400">This configures how much guidance we show you.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ExperienceCard 
                  emoji="🌱" title="Complete Beginner" desc="I've never traded stocks. Guide me."
                  onClick={() => finish('beginner')}
                />
                <ExperienceCard 
                  emoji="📊" title="Some Experience" desc="I know the basics but want signals."
                  onClick={() => finish('intermediate')}
                />
                <ExperienceCard 
                  emoji="🚀" title="Experienced" desc="Skip the tips, just show the data."
                  onClick={() => finish('experienced')}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ExperienceCard({ emoji, title, desc, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-6 glass-card rounded-xl hover:border-tvGreen/50 hover:bg-tvGreen/5 transition-all group flex items-start space-x-4"
    >
      <div className="text-3xl">{emoji}</div>
      <div>
        <h3 className="font-bold text-white text-lg group-hover:text-tvGreen transition-colors">{title}</h3>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </button>
  )
}
