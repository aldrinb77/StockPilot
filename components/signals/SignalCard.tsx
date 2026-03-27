"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, TrendingUp, Star, CheckCircle2, AlertTriangle, ArrowRight, Zap, Shield, Wallet } from "lucide-react"
import { useStore } from "@/store/store"
import { formatCurrency } from "@/lib/utils"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { MARKETS } from "@/lib/markets"
import Link from "next/link"
import { useUserProfile } from "@/hooks/useUserProfile"

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
  const [expanded, setExpanded] = useState(false)
  const { addToWatchlist, watchlist, removeFromWatchlist, selectedMarket } = useStore()
  const { userName } = useUserProfile()
  const marketConfig = MARKETS[selectedMarket]

  const isWatched = watchlist.some((w: any) => w.symbol === symbol)
  const toggleWatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isWatched) removeFromWatchlist(symbol)
    else addToWatchlist({ symbol, name, addedAt: Date.now() })
  }

  const isStrongBuy = signal.type === 'STRONG_BUY'
  const isBuy = signal.type.includes('BUY')
  const isStrongSell = signal.type === 'STRONG_SELL'
  const isSell = signal.type.includes('SELL')
  const isHold = signal.type === 'HOLD'

  const accentColor = isBuy ? 'var(--tvGreen)' : isSell ? 'var(--tvRed)' : 'var(--tvAmber)'
  const glowShadow = isBuy ? 'rgba(16, 185, 129, 0.2)' : isSell ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'
  
  const getActionLabel = () => {
    if (isStrongBuy) return "STRONG BUY 🚀"
    if (isBuy) return "BUY 📈"
    if (isStrongSell) return "EXIT NOW ⛔"
    if (isSell) return "SELL 📉"
    return "WAIT FOR ENTRY ⏳"
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card rounded-3xl border-l-4 overflow-hidden group relative transition-all duration-500`}
      style={{ 
        borderLeftColor: accentColor,
        boxShadow: expanded ? `0 0 50px ${glowShadow}` : `0 0 20px ${glowShadow}`
      }}
    >
      <div 
        className="absolute -top-24 -left-24 w-64 h-64 blur-[100px] opacity-10 pointer-events-none transition-opacity group-hover:opacity-20" 
        style={{ background: accentColor }}
      />
      
      <div className="p-8 cursor-pointer relative z-10" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <Link 
              href={`/stock/${symbol}`} 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-3 group/link"
            >
              <h3 className="text-3xl font-black text-white tracking-tighter group-hover/link:text-tvGreen transition-colors">{symbol}</h3>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover/link:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 font-bold truncate max-w-[200px]">{name}</p>
          </div>
          <div className="flex flex-col items-end">
             <div className="text-2xl font-black text-white mb-1 font-mono tracking-tighter">
                {formatCurrency(price, selectedMarket)}
             </div>
             <button 
                onClick={toggleWatch}
                className={`p-2.5 rounded-xl transition-all border ${isWatched ? 'bg-tvAmber/10 border-tvAmber/40 text-tvAmber shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
              >
                <Star className={`w-5 h-5 ${isWatched ? 'fill-tvAmber' : ''}`} />
              </button>
          </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                 <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: accentColor }} />
                 <span className="font-black uppercase tracking-[0.2em] text-sm" style={{ color: accentColor }}>{getActionLabel()}</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                 WIN RATE: ~80%
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                 <span>Confidence</span>
                 <span>{signal.strength}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${signal.strength}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
           </div>
        </div>
        
        {/* WHY YOU SHOULD DO THIS */}
        <div className="mt-8 space-y-3">
           <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center">
              <Zap className="w-3 h-3 mr-2 text-tvAmber" /> WHY YOU SHOULD {isBuy ? 'BUY' : 'SELL'}:
           </h4>
           <div className="space-y-2">
              {signal.reasons.slice(0, 3).map((reason: string, i: number) => (
                <div key={i} className="flex items-start gap-2 group/reason">
                   <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-tvBlue/40 group-hover/reason:bg-tvBlue transition-colors" />
                   <p className="text-xs text-gray-400 font-medium leading-relaxed">{reason}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-8 pt-4 border-t border-white/5 bg-black/20"
          >
            {/* ACTIONABLE LEVELS */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-tvGreen/30 transition-all">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">💰 {isBuy ? 'Entry Range' : 'Exit Range'}</p>
                  <p className="text-lg font-black text-white font-mono tracking-tighter">
                    {formatCurrency(signal.entry.min, selectedMarket)} 
                    <span className="text-gray-600 text-xs px-2">-</span>
                    {formatCurrency(signal.entry.max, selectedMarket)}
                  </p>
               </div>
               <div className="p-5 rounded-2xl bg-tvRed/5 border border-tvRed/10 hover:border-tvRed/30 transition-all">
                  <p className="text-[10px] text-tvRed/60 uppercase font-black mb-1">🛑 Stop Loss</p>
                  <p className="text-lg font-black text-tvRed font-mono tracking-tighter">{formatCurrency(signal.stopLoss, selectedMarket)}</p>
               </div>
            </div>

            {/* TARGETS */}
            <div className="space-y-4 mb-8">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                  <Target className="w-4 h-4 mr-2 text-tvAmber" /> PROFIT TARGETS
               </h4>
               <div className="grid grid-cols-3 gap-3">
                  {signal.targets.map((t: number, i: number) => {
                    const upside = ((t - price) / price * 100).toFixed(1);
                    return (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-tvGreen/20 transition-all text-center">
                         <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Target {i+1}</p>
                         <p className="text-sm font-black text-tvGreen font-mono">{formatCurrency(t, selectedMarket)}</p>
                         <p className="text-[10px] text-gray-500 font-bold">({upside}%)</p>
                      </div>
                    )
                  })}
               </div>
            </div>

            {/* WHAT TO DO - THE SPOON FEEDER */}
            <div className="p-6 rounded-2xl bg-tvBlue/10 border border-tvBlue/20 space-y-4">
               <h4 className="text-[10px] font-black text-tvBlue uppercase tracking-[0.2em] flex items-center">
                  <Shield className="w-4 h-4 mr-2" /> WHAT TO DO:
               </h4>
               <div className="space-y-3">
                  {[
                    `Buy at current price (${formatCurrency(price, selectedMarket)})`,
                    `Set your Stop Loss at ${formatCurrency(signal.stopLoss, selectedMarket)}`,
                    `Book 50% profit at Target 1 (${formatCurrency(signal.targets[0], selectedMarket)})`,
                    `Move Stop Loss to entry price for remaining 50%`,
                    `Book remaining at Target 2 or 3 for maximum profit`
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                       <div className="w-5 h-5 rounded-full bg-tvBlue/20 text-tvBlue flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i+1}</div>
                       <p className="text-xs text-gray-300 font-bold leading-relaxed">{step}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-8 flex gap-4">
               <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all">
                  📊 View Full Chart
               </button>
               <button className="flex-1 py-4 bg-tvGreen text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-tvGreen/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  🎯 Execute Trade
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
