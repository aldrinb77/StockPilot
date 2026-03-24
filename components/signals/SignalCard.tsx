"use client"

import { Signal, IndicatorVerdict } from "@/lib/types"
import { Battery, Target, TrendingUp, AlertTriangle, Star, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { STAGGER_CONTAINER, FADE_IN } from "@/lib/animations"
import { useStore } from "@/store/store"
import { getFriendlyIndicatorDescription } from "@/lib/friendly"
import { HelpBadge } from "@/components/guidance/HelpBadge"
import { useAppMode } from "@/hooks/useAppMode"
import { getLabel, getSignalLabel, getFriendlySignalReasonWithMode } from "@/lib/legal"
import { formatCurrency } from "@/lib/utils"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { MARKETS } from "@/lib/markets"

interface SignalCardProps {
  symbol?: string
  name?: string
  signal: any
  price?: number
  stock?: any
}

export function SignalCard(props: SignalCardProps) {
  const signal = props.signal
  const symbol = props.symbol || props.stock?.symbol
  const name = props.name || props.stock?.name || ''
  const price = props.price || props.stock?.price || 0
  
  const [expanded, setExpanded] = useState(false)
  const [showHowToBuy, setShowHowToBuy] = useState(false)
  const { addToWatchlist, watchlist, removeFromWatchlist, experienceLevel, selectedMarket } = useStore()
  const { isGodMode } = useAppMode()
  const labels = getLabel(!!isGodMode)
  const marketConfig = MARKETS[selectedMarket]

  const isWatched = watchlist.some((w: any) => w.symbol === symbol)
  
  const toggleWatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isWatched) removeFromWatchlist(symbol)
    else addToWatchlist({ symbol, name, addedAt: Date.now() })
  }

  const isBuy = signal.type.includes('BULLISH') || signal.type.includes('BUY')
  const isSell = signal.type.includes('BEARISH') || signal.type.includes('SELL')
  
  const accentColor = isBuy ? 'var(--tvGreen)' : isSell ? 'var(--tvRed)' : 'var(--tvAmber)'
  const glowShadow = isBuy ? 'rgba(16, 185, 129, 0.1)' : isSell ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
  
  const signalLabel = getSignalLabel(signal.type, !!isGodMode)

  return (
    <motion.div 
      layout
      variants={FADE_IN}
      initial="hidden"
      animate="visible"
      className={`glass-card rounded-2xl border-l-[3px] overflow-hidden group relative`}
      style={{ 
        borderLeftColor: accentColor,
        boxShadow: `0 0 30px ${glowShadow}`
      }}
    >
      {/* Background Glow Gradient */}
      <div 
        className="absolute -top-12 -left-12 w-48 h-48 blur-[80px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-30" 
        style={{ background: accentColor }}
      />
      
      {/* Header Content */}
      <div 
        className="p-6 cursor-pointer relative z-10"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-black font-heading text-white tracking-tight">{symbol}</h3>
              <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-gray-400 tracking-widest">{marketConfig.exchangeCode}</div>
            </div>
            <p className="text-sm text-gray-500 font-medium truncate max-w-[180px] mt-1">{name}</p>
            <div className="text-3xl font-black text-white font-mono mt-3 tracking-tighter">
              <AnimatedNumber 
                value={price} 
                prefix={marketConfig.currencySymbol} 
                decimals={2} 
              />
            </div>
          </div>
          <button 
            onClick={toggleWatch}
            className={`p-3 rounded-2xl transition-all hover:scale-110 active:scale-90 border ${isWatched ? 'bg-tvAmber/10 border-tvAmber/40 text-tvAmber shadow-lg shadow-tvAmber/10' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
          >
            <Star className={`w-5 h-5 ${isWatched ? 'fill-tvAmber' : ''}`} />
          </button>
        </div>

        {/* Signal & Strength Row */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                 <div className="pulse-dot" style={{ backgroundColor: accentColor }} />
                 <span className="font-black uppercase tracking-[0.15em] text-xs" style={{ color: accentColor }}>{signalLabel}</span>
              </div>
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest glass-panel px-3 py-1.5 rounded-full border-white/5">
                 <Battery className="w-3.5 h-3.5 mr-1.5 opacity-60" style={{ color: accentColor }} />
                 <span className="text-gray-300">
                    <AnimatedNumber value={signal.strength} suffix="%" /> ALIGNMENT
                 </span>
              </div>
           </div>

           {/* Animated Strength Bar */}
           <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden relative shadow-inner">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${signal.strength}%` }}
               transition={{ duration: 1.2, ease: "circOut" }}
               className="h-full rounded-full bg-gradient-to-r"
               style={{ 
                  backgroundImage: `linear-gradient(to right, ${isSell ? '#ef4444' : isBuy ? '#10b981' : '#f59e0b'}, ${accentColor})` 
               }}
             />
           </div>
        </div>
        
        {/* Dynamic Reason Quote */}
        <div className="mt-6 relative">
           <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-white/10 rounded-full" />
           <p className="text-sm text-gray-300 leading-relaxed font-medium pl-4 italic">
             &quot;{getFriendlySignalReasonWithMode(signal, signal.reasons[0], !!isGodMode)}&quot;
           </p>
        </div>
        
        {/* Expand Indicator */}
        <div className="mt-6 flex justify-center">
           <div className={`w-8 h-1 rounded-full bg-white/10 transition-all ${expanded ? 'bg-tvGreen/40' : 'group-hover:bg-white/20'}`} />
        </div>
      </div>

      {/* Expanded Logic Screen */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="px-6 pb-8 pt-2 border-t border-white/5 relative z-10 bg-black/10"
          >
            {/* Action Targets */}
            <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
              <div className="glass-panel p-5 rounded-2xl group/item cursor-pointer hover:border-white/20 transition-all">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center">
                  {labels.entry}
                  <HelpBadge title={labels.entry} description="Boundary where indicators alignment is statistically historical." />
                </p>
                <p className="text-xl font-black text-white font-mono tracking-tighter">
                  {formatCurrency(signal.entry.min, selectedMarket)} <span className="text-gray-600 text-sm font-medium">→</span> {formatCurrency(signal.entry.max, selectedMarket)}
                </p>
              </div>
              <div className="glass-panel p-5 rounded-2xl group/item cursor-pointer hover:border-tvRed/30 transition-all">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center">
                  {labels.stopLoss}
                  <HelpBadge title={labels.stopLoss} description="Safety boundary based on ATR volatility readings." />
                </p>
                <p className="text-xl font-black text-tvRed font-mono tracking-tighter">{formatCurrency(signal.stopLoss, selectedMarket)}</p>
              </div>
            </div>

            {/* Educational Purchase Modal Bridge */}
            {isBuy && (
              <div className="mb-8">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowHowToBuy(!showHowToBuy); }}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ripple"
                >
                  < हेल्पिएर className="w-4 h-4 text-tvBlue" />
                  <span>{isGodMode ? 'Execution Plan' : 'Educational Execution Guide'}</span>
                </button>
                
                <AnimatePresence>
                  {showHowToBuy && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, scale: 0.95 }}
                      animate={{ height: "auto", opacity: 1, scale: 1 }}
                      exit={{ height: 0, opacity: 0, scale: 0.95 }}
                      className="overflow-hidden mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-[#111827]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-sm text-gray-300 shadow-2xl">
                        {isGodMode ? (
                          <div className="space-y-4">
                            <p className="font-black text-white uppercase tracking-widest text-xs border-b border-white/5 pb-2">Trading Blueprint</p>
                            <div className="space-y-3">
                               <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-tvGreen/20 text-tvGreen flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                                  <p>Initiate <span className="text-white font-bold">Limit Order</span>. Avoid market orders for boundary slippage control.</p>
                               </div>
                               <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-tvGreen/20 text-tvGreen flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                                  <p>Set Entry around <span className="text-tvGreen font-black">{formatCurrency((signal.entry.min + signal.entry.max)/2, selectedMarket)}</span>.</p>
                               </div>
                               <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-tvGreen/20 text-tvGreen flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                                  <p>Immediate Stop Loss placement at <span className="text-tvRed font-black">{formatCurrency(signal.stopLoss, selectedMarket)}</span>.</p>
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="font-black text-white uppercase tracking-widest text-xs border-b border-white/5 pb-2">Educational Literacy</p>
                            <p className="text-xs text-gray-400 italic">This guide helps beginners understand the mechanics of regulated stock exchanges.</p>
                            <ul className="space-y-3">
                              {['Understand Portfolio Sizing', 'Using Limit Orders vs Market Orders', 'The Importance of Risk Benchmarks', 'Brokerage Compatibility Check'].map((text, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                   <div className="w-1 h-1 rounded-full bg-tvBlue" /> {text}
                                </li>
                              ))}
                            </ul>
                            <div className="pt-2 text-[10px] text-tvAmber font-black uppercase tracking-widest">🛑 NO FINANCIAL ADVICE PROVIDED</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profit Targets Grid */}
            <div className="space-y-4 mb-8">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center">
                <Target className="w-4 h-4 mr-2 text-tvAmber opacity-60" /> {labels.target} LEVELS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {signal.targets.map((t: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-tvGreen/20 transition-all">
                    <span className="text-[10px] text-gray-500 uppercase font-black">Level {i + 1}</span>
                    <span className="text-tvGreen font-black font-mono">{formatCurrency(t, selectedMarket)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Logic Decomposition */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center">
                 <TrendingUp className="w-4 h-4 mr-2 text-tvBlue opacity-60" /> MATHEMATICAL ALIGNMENT
               </h4>
               <div className="space-y-2.5">
                 {signal.indicators.slice(0, experienceLevel === 'beginner' ? 3 : 10).map((ind: any, i: number) => (
                   <div key={i} className="flex flex-col bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-white font-black tracking-tight">{ind.name}</span>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                          ind.verdict === 'bullish' ? 'bg-tvGreen/15 text-tvGreen border border-tvGreen/30' :
                          ind.verdict === 'bearish' ? 'bg-tvRed/15 text-tvRed border border-tvRed/30' :
                          'bg-gray-800 text-gray-500'
                        }`}>
                          {ind.verdict}
                        </div>
                     </div>
                     {experienceLevel !== 'experienced' && (
                       <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                         {getFriendlyIndicatorDescription(ind.name, ind)}
                       </p>
                     )}
                   </div>
                 ))}
                 {experienceLevel === 'beginner' && signal.indicators.length > 3 && (
                   <div className="flex items-center justify-center space-x-2 py-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3 text-tvGreen" />
                      <span>{signal.indicators.length - 3} Additional Secure Math Checks Passed</span>
                   </div>
                 )}
               </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/5 text-center px-4">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] leading-loose">
                {isGodMode ? "STOX_QUANT_ENGINE // VERIFIED_SIGNAL_SOURCE" : "⚠️ STOXPILOT IS AN EDUCATIONAL UTILITY. ALL DATA IS FOR LITERACY PURPOSES ONLY."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function हेल्पिएर({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m11 17 5 5 5-5"/><path d="m18 22V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11"/><path d="M7 11h4"/><path d="M7 15h2"/><path d="M20 9V5a2 2 0 0 0-2-2H5"/></svg>
  )
}

