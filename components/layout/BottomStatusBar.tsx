"use client"

import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { PulseDot } from "@/components/ui/PulseDot"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function BottomStatusBar() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [lastUpdate, setLastUpdate] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setInterval(() => setLastUpdate(prev => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  if (pathname === "/") return null

  return (
    <div className="hidden lg:flex fixed bottom-0 left-0 right-0 h-7 bg-[#060a13f2] backdrop-blur-md border-t border-white/5 z-[60] items-center px-4 justify-between select-none">
      <div className="flex items-center space-x-6 text-[10px] font-mono font-black tracking-widest text-[#5c6b7a] uppercase">
        <div className="flex items-center gap-2">
           <PulseDot color="green" />
           <span className="text-[#00e676]">Live Market Feed</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-white/20">|</span>
           <span>Market: {marketConfig.name}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-white/20">|</span>
           <span>NIFTY: <AnimatedNumber value={24150.35} decimals={2} /></span>
           <span className="text-[#00e676]">(+0.82%)</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-white/20">|</span>
           <span>SENSEX: <AnimatedNumber value={79502.12} decimals={2} /></span>
           <span className="text-[#00e676]">(+0.55%)</span>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-[10px] font-mono font-black tracking-[0.2em] text-[#5c6b7a] uppercase">
        <div className="flex items-center gap-2">
           <span>Engine Status: <span className="text-[#00e676]">Optimal</span></span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-white/20">|</span>
           <span>Updated: {lastUpdate}s Ago</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-white/20">|</span>
           <span className="text-white/40">StoxPilot Private Terminal v2.1</span>
        </div>
      </div>
    </div>
  )
}
