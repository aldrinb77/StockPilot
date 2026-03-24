"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SpotlightTour({ steps, tourId }: { steps: any[], tourId: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tour_seen_${tourId}`)
    if (!hasSeen) {
      setTimeout(() => setActive(true), 1500)
    }
  }, [tourId])

  if (!active || steps.length === 0) return null

  const finish = () => {
    localStorage.setItem(`tour_seen_${tourId}`, 'true')
    setActive(false)
  }

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      finish()
    }
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Dark overlay with transparent cutout - simplified via CSS for MVP */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute z-[101] glass-panel p-6 rounded-2xl max-w-sm left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-2 font-heading">{step.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{step.content}</p>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-1">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-tvGreen' : 'bg-gray-700'}`} />
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button onClick={finish} className="text-xs text-gray-400 font-medium hover:text-white">Skip</button>
              <button 
                onClick={next}
                className="px-4 py-2 bg-tvGreen text-white text-sm font-bold rounded-lg hover:bg-tvGreen/90 transition-colors"
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
