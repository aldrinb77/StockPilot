"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert } from "lucide-react"
import { useAppMode } from "@/hooks/useAppMode"

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  
  const { isGodMode, isLoaded } = useAppMode()

  useEffect(() => {
    // Only show if we've successfully loaded the auth state
    if (!isLoaded) return;
    
    // Automatically hide for God Mode
    if (isGodMode) {
      setIsOpen(false);
      return;
    }

    const accepted = localStorage.getItem("disclaimerAccepted_v1")
    if (!accepted) {
      setIsOpen(true)
    }
  }, [isGodMode, isLoaded])

  const allChecked = checked1 && checked2 && checked3

  const handleAccept = () => {
    if (!allChecked) return
    localStorage.setItem("disclaimerAccepted_v1", "true")
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#131722] border border-gray-700/50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-tvRed/10 border-b border-tvRed/20 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-tvRed/20 text-tvRed p-3 rounded-full mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Important Disclaimer</h2>
            <p className="text-gray-400 mt-2 text-sm">Welcome to StoxPilot</p>
          </div>
          
          <div className="p-6 space-y-4 text-sm text-gray-300 leading-relaxed overflow-y-auto max-h-[40vh]">
            <p className="font-bold text-white">By using this platform, you acknowledge that:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">StoxPilot is an EDUCATIONAL and INFORMATIONAL tool ONLY.</strong></li>
              <li>Nothing on this platform constitutes financial, investment, or legal advice.</li>
              <li>We are <strong>NOT</strong> registered financial advisors or brokers.</li>
              <li>Past indicator performance does <strong>NOT</strong> guarantee future results.</li>
              <li>You must <strong>ALWAYS</strong> do your own research (DYOR) before executing any trade.</li>
            </ol>
            
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" checked={checked1} onChange={e => setChecked1(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-tvBlue focus:ring-tvBlue focus:ring-offset-gray-900" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">I have read, understood, and agree to the above disclaimer.</span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" checked={checked2} onChange={e => setChecked2(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-tvBlue focus:ring-tvBlue focus:ring-offset-gray-900" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">I understand that this is an educational tool.</span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" checked={checked3} onChange={e => setChecked3(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-tvBlue focus:ring-tvBlue focus:ring-offset-gray-900" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">I confirm that I am 18 years of age or older.</span>
              </label>
            </div>
          </div>
          
          <div className="p-6 bg-[#0a0e17] border-t border-gray-800 flex justify-end">
            <button
              onClick={handleAccept}
              disabled={!allChecked}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                allChecked 
                  ? 'bg-tvBlue/20 text-tvBlue hover:bg-tvBlue hover:text-white border border-tvBlue/50 hover:shadow-lg hover:shadow-tvBlue/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              }`}
            >
              I Accept & Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
