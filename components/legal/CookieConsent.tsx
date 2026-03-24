"use client"

import { useState, useEffect } from "react"
import { Cookie } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem("cookieConsent_v1")
    if (!accepted) {
      // Small delay so it pops up after main modal
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent_v1", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-4 left-4 z-50 max-w-md bg-[#1B202B] border border-gray-700 shadow-2xl rounded-xl p-4 md:p-5 text-sm"
      >
        <div className="flex items-start space-x-3">
          <div className="text-tvBlue bg-tvBlue/10 p-2 rounded-lg flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Cookie Notice</h4>
            <p className="text-gray-400 mb-3 text-xs leading-relaxed">
              We use strictly essential cookies and local storage to save your watchlist and dark mode preferences. 
              No personal tracking data is collected.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleAccept}
                className="bg-tvBlue hover:bg-tvBlue/90 text-white font-bold py-1.5 px-4 rounded-md transition-colors text-xs"
              >
                Accept Essential
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
