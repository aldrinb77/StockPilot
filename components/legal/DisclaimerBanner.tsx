"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, X } from "lucide-react"
import { useAppMode } from "@/hooks/useAppMode"

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { isGodMode, isLoaded } = useAppMode()

  // Immediately hide if God Mode is active
  if (!isLoaded || isGodMode || !isVisible) return null

  return (
    <div className="bg-tvAmber/10 border-b border-tvAmber/20 px-4 py-2 flex items-center justify-between z-50 relative shrink-0">
      <div className="flex items-center space-x-2 w-full justify-center text-xs text-tvAmber md:text-sm font-medium">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span className="text-center">
          Educational Tool Only — Not Financial Advice — DYOR — 
          <Link href="/disclaimer" className="underline ml-1 hover:text-yellow-400 transition-colors">
            Read Full Disclaimer
          </Link>
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-tvAmber/60 hover:text-tvAmber p-1 absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-tvAmber/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
