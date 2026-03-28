"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Target, TrendingUp, Star, CheckCircle2, AlertTriangle, ArrowRight, Zap, Shield, Wallet, Eye, X } from "lucide-react"
import { useStore } from "@/store/store"
import { formatCurrency } from "@/lib/utils"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { PulseDot } from "@/components/ui/PulseDot"
import { MARKETS } from "@/lib/markets"
import Link from "next/link"
import { useUserProfile } from "@/hooks/useUserProfile"
import { TradeCard } from "../social/TradeCard"

interface SignalCardProps {
  symbol?: string
  name?: string
  signal: any
  price?: number
  stock?: any
  isMockData?: boolean
}

export function SignalCard(props: SignalCardProps) {
  const signal = props.signal
  const symbol = props.symbol || props.stock?.symbol
  const name = props.name || props.stock?.name || ''
  const price = props.price || props.stock?.price || 0
  const change = props.stock?.change || 2.45 // Default mock if missing
  const changePercent = props.stock?.changePercent || 1.2
  
  const [expanded, setExpanded] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const { addToWatchlist, watchlist, removeFromWatchlist, selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]

  const isWatched = watchlist.some((w: any) => w.symbol === symbol)
  const toggleWatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isWatched) removeFromWatchlist(symbol)
    else addToWatchlist({ symbol, name, addedAt: Date.now() })
  }

  const isStrongBuy = signal.type === 'STRONG_BULLISH'
  const isBuy = signal.type.includes('BULLISH')
  const isStrongSell = signal.type === 'STRONG_BEARISH'
  const isSell = signal.type.includes('BEARISH')
  const isHold = signal.type === 'NEUTRAL'

  const cardTypeClass = isStrongBuy ? 'glass-card-green' : isStrongSell ? 'glass-card-red' : isHold ? 'glass-card-amber' : isBuy ? 'glass-card-green' : 'glass-card-red'
  
  const getActionPill = () => {
    if (isStrongBuy) return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e67615] border border-[#00e67630] text-[#00e676] text-[10px] font-black tracking-widest uppercase">
         <PulseDot color="green" /> 🚀 STRONG BUY
      </div>
    )
    if (isBuy) return (
       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e67615] border border-[#00e67620] text-[#00e676] text-[10px] font-black tracking-widest uppercase">
          📈 BUY
       </div>
    )
    if (isStrongSell) return (
       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff174415] border border-[#ff174430] text-[#ff1744] text-[10px] font-black tracking-widest uppercase font-bold">
          <PulseDot color="red" /> 🚨 STRONG SELL — EXIT NOW
       </div>
    )
    if (isSell) return (
       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff174415] border border-[#ff174420] text-[#ff1744] text-[10px] font-black tracking-widest uppercase">
          📉 SELL
       </div>
    )
    return (
       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffab0015] border border-[#ffab0020] text-[#ffab00] text-[10px] font-black tracking-widest uppercase">
          ⏸️ HOLD — Wait for better entry
       </div>
    )
  }

  const strengthColor = signal.strength > 60 ? '#00e676' : signal.strength > 40 ? '#ffab00' : '#ff1744'

  return (
    <motion.div 
      layout
      className={`glass-card p-6 ${cardTypeClass} hover:translate-y-[-4px] cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* TOP ROW: Symbol & Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{symbol}</h3>
             <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${change >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent}%) {change >= 0 ? '📈' : '📉'}
             </div>
          </div>
          <p className="text-[11px] text-[#8899a6] font-bold uppercase tracking-wider truncate max-w-[180px]">{name}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="text-xl font-black text-white font-mono tracking-tighter">
              <AnimatedNumber value={price} prefix={marketConfig.currencySymbol} />
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowShare(true) }}
                className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={toggleWatch} 
                className={`p-1.5 bg-white/5 border border-white/10 rounded-lg transition-all ${isWatched ? 'text-[#ffab00] border-[#ffab0040] bg-[#ffab0005]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              >
                 <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-[#ffab00]' : ''}`} />
              </button>
           </div>
        </div>
      </div>

      <div className="mb-6">
        {getActionPill()}
      </div>

      {/* CONFIDENCE BAR */}
      <div className="space-y-2 mb-8">
         <div className="flex justify-between text-[10px] font-black text-[#8899a6] uppercase tracking-widest">
            <span>Probability Score</span>
            <span style={{ color: strengthColor }}>{signal.strength}%</span>
         </div>
         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${signal.strength}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: strengthColor }}
            />
         </div>
      </div>

      {/* ACTIONABLE LEVELS (MINIFIED) */}
      <div className="grid grid-cols-3 gap-2 mb-8">
         <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] text-[#5c6b7a] font-black uppercase mb-1">{isBuy ? 'Entry' : 'Exit'}</p>
            <p className="text-xs font-black text-white font-mono">{formatCurrency(signal.entry.min, selectedMarket)}</p>
         </div>
         <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10">
            <p className="text-[9px] text-red-400 font-black uppercase mb-1">Stop</p>
            <p className="text-xs font-black text-red-400 font-mono">{formatCurrency(signal.stopLoss, selectedMarket)}</p>
         </div>
         <div className="bg-green-500/5 p-3 rounded-xl border border-green-500/10">
            <p className="text-[9px] text-green-400 font-black uppercase mb-1">Target</p>
            <p className="text-xs font-black text-green-400 font-mono">{formatCurrency(signal.targets[0], selectedMarket)}</p>
         </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pt-6 border-t border-white/5 space-y-8"
          >
             {/* THE "WHY" SECTION */}
             <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.2em] flex items-center">
                   <Zap className="w-3.5 h-3.5 mr-2 text-[#ffab00]" /> Intelligence Reasons:
                </h4>
                <div className="space-y-2">
                   {signal.reasons.map((r: string, i: number) => (
                     <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                        <p className="text-xs text-[#8899a6] font-medium leading-relaxed">{r}</p>
                     </div>
                   ))}
                </div>
             </div>

             {/* WHAT TO DO (SPOON FEEDER 2.0) */}
             <div className="bg-[#2979ff10] border border-[#2979ff20] p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Shield className="w-12 h-12 text-[#2979ff]" />
                </div>
                <h4 className="text-[10px] font-black text-[#2979ff] uppercase tracking-[0.2em] mb-4">Execution Protocol:</h4>
                <div className="space-y-4">
                   {[
                     `Buy ${symbol} at current market price`,
                     `Hard set Stop Loss at ${formatCurrency(signal.stopLoss, selectedMarket)}`,
                     `Exit 50% position at Target 1: ${formatCurrency(signal.targets[0], selectedMarket)}`,
                     `Move SL to break-even after Target 1 hit`,
                     `Ride remaining position to subsequent targets`
                   ].map((step, i) => (
                     <div key={i} className="flex items-start gap-4">
                        <div className="w-5 h-5 rounded-lg bg-[#2979ff20] text-[#2979ff] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i+1}</div>
                        <p className="text-xs text-white/80 font-bold leading-relaxed">{step}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="flex gap-4">
                <Link 
                  href={`/stock/${symbol}`}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                >
                   <Eye className="w-4 h-4" /> Full Chart
                </Link>
                <button className="flex-1 py-3 bg-gradient-to-r from-[#00e676] to-[#00c853] rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#00e67620] hover:brightness-110 active:scale-95 transition-all">
                   🎯 Execute Now
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
         {showShare && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
               onClick={(e) => { e.stopPropagation(); setShowShare(false) }}
            >
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-sm relative"
                  onClick={(e) => e.stopPropagation()}
               >
                  <button 
                    onClick={() => setShowShare(false)}
                    className="absolute -top-12 right-0 p-3 bg-white/5 text-white hover:bg-white/10 rounded-full transition-all border border-white/10"
                  >
                     <X className="w-5 h-5" />
                  </button>
                  <TradeCard stock={{ symbol, name, price, change, changePercent } as any} signal={signal} />
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  )
}
