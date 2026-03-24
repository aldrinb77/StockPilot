"use client"

import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function BottomStatusBar() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 h-7 bg-[#0d1117] border-t border-white/5 z-[120] items-center px-4 justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
           <div className="w-2 h-2 rounded-full bg-tvGreen pulse-dot" />
           <span>System Operational</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center space-x-2">
           <span className="text-white/40">Market:</span>
           <span className="text-white">{marketConfig.name} ({marketConfig.exchangeCode})</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="overflow-hidden w-64 relative group">
           <motion.div 
             animate={{ x: [-200, 200] }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="whitespace-nowrap flex space-x-8"
           >
             {marketConfig.indices.map(idx => (
               <span key={idx.symbol}>{idx.displaySymbol}: <span className="text-tvGreen">TRACKING</span></span>
             ))}
           </motion.div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
           <span className="text-white/40">Time:</span>
           <span className="text-white font-mono">{time.toLocaleTimeString()}</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center space-x-1">
           <span className="text-tvBlue">StoxPilot</span>
           <span className="text-white/20">v1.1.0-PREMIUM</span>
        </div>
      </div>
    </div>
  )
}
