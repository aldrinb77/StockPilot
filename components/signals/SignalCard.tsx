"use client"

import { Signal, IndicatorVerdict } from "@/lib/types"
import { Battery, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { STAGGER_CONTAINER, FADE_IN } from "@/lib/animations"
import { useStore } from "@/store/store"
import { getFriendlyIndicatorDescription } from "@/lib/friendly"
import { HelpBadge } from "@/components/guidance/HelpBadge"
import { useAppMode } from "@/hooks/useAppMode"
import { getLabel, getSignalLabel, getFriendlySignalReasonWithMode } from "@/lib/legal"

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
  const { addToWatchlist, watchlist, removeFromWatchlist, experienceLevel } = useStore()
  const { isGodMode } = useAppMode()
  const labels = getLabel(!!isGodMode)

  const isWatched = watchlist.some((w: any) => w.symbol === symbol)
  
  const toggleWatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isWatched) removeFromWatchlist(symbol)
    else addToWatchlist({ symbol, name, addedAt: Date.now() })
  }

  const isBuy = signal.type.includes('BULLISH') || signal.type.includes('BUY')
  const isSell = signal.type.includes('BEARISH') || signal.type.includes('SELL')
  
  // Strict mode colors
  const borderColor = isGodMode 
    ? (isBuy ? 'border-tvGreen' : isSell ? 'border-tvRed' : 'border-gray-500')
    : (isBuy ? 'border-tvGreen/30' : isSell ? 'border-tvRed/30' : 'border-tvAmber/30')
    
  const glowClass = isBuy ? 'glow-green' : isSell ? 'glow-red' : ''
  const bgColors = isGodMode
    ? (isBuy ? 'bg-tvGreen text-white' : isSell ? 'bg-tvRed text-white' : 'bg-gray-600 text-white')
    : (isBuy ? 'bg-tvGreen/10 text-tvGreen' : isSell ? 'bg-tvRed/10 text-tvRed' : 'bg-tvAmber/10 text-tvAmber')

  const signalLabel = getSignalLabel(signal.type, !!isGodMode)

  return (
    <motion.div 
      layout
      variants={FADE_IN}
      initial="hidden"
      animate="visible"
      className={`glass-card rounded-2xl border-l-[6px] ${borderColor} ${glowClass} overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-xl cursor-default group relative`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div 
        className="p-5 cursor-pointer relative z-10"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold font-heading text-white">{symbol}</h3>
              <span className="text-sm text-gray-400 font-medium truncate max-w-[120px]">{name}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-1">${price.toFixed(2)}</div>
          </div>
          <button 
            onClick={toggleWatch}
            className={`p-2 rounded-full transition-all hover:scale-110 active:scale-90 ${isWatched ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            {isWatched ? '★' : '☆'}
          </button>
        </div>

        {/* Signal Badge */}
        <div className="flex items-center justify-between">
          <div className={`px-4 py-1.5 rounded-lg border flex items-center shadow-lg ${bgColors} ${borderColor}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isBuy ? 'bg-white animate-pulse' : isSell ? 'bg-white animate-pulse' : 'bg-white/50'}`} />
            <span className="font-bold tracking-wide">{signalLabel}</span>
          </div>
          <div className="flex items-center text-sm font-medium glass-panel px-3 py-1.5 rounded-lg">
            <Battery className={`w-4 h-4 mr-1.5 ${isBuy ? 'text-tvGreen' : 'text-tvRed'}`} />
            <span className="text-white">{Math.round(signal.strength)}% Alignment</span>
          </div>
        </div>
        
        {/* Friendly Reason */}
        <p className="mt-4 text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5 leading-relaxed">
          {getFriendlySignalReasonWithMode(signal, signal.reasons[0], !!isGodMode)}
        </p>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 pt-2 border-t border-gray-800/50 relative z-10"
          >
            {/* Trading Plan */}
            <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center">
                  {labels.entry}
                  <HelpBadge title={labels.entry} description="The mathematically generated boundary for tracking." />
                </p>
                <p className="text-lg font-bold text-white font-mono">${signal.entry.min} - ${signal.entry.max}</p>
              </div>
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center">
                  {labels.stopLoss}
                  <HelpBadge title={labels.stopLoss} description="The ATR-derived safety net boundary." />
                </p>
                <p className="text-lg font-bold text-tvRed font-mono">${signal.stopLoss}</p>
              </div>
            </div>

            {/* Purchase Guidance Wrapper (Beginner Only for visibility, toggleable) */}
            {isBuy && (
              <div className="mb-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowHowToBuy(!showHowToBuy); }}
                  className="w-full bg-tvBlue/10 hover:bg-tvBlue/20 text-tvBlue border border-tvBlue/30 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center"
                >
                  {isGodMode ? '💡 How to trade this stock' : '📚 Educational Guide: How Stock Purchasing Works'}
                </button>
                
                <AnimatePresence>
                  {showHowToBuy && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-[#111827] p-4 rounded-xl border border-gray-700/50 text-sm text-gray-300">
                        {isGodMode ? (
                          <>
                            <p className="font-bold text-white mb-2">📝 To buy {symbol}:</p>
                            <ol className="list-decimal pl-5 space-y-1 mb-4">
                              <li>Open your brokerage app.</li>
                              <li>Select &quot;Limit Order&quot; (do not use Market).</li>
                              <li>Set your buy price around <strong className="text-tvGreen font-mono">${((signal.entry.min + signal.entry.max)/2).toFixed(2)}</strong>.</li>
                              <li>Set a Stop Loss order at <strong className="text-tvRed font-mono">${signal.stopLoss}</strong>.</li>
                            </ol>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-white mb-2">📚 How Stock Purchasing Generally Works (Educational):</p>
                            <p className="text-xs text-gray-400 mb-2 italic">This is a general educational guide. This is NOT a recommendation to buy this or any stock.</p>
                            <ol className="list-decimal pl-5 space-y-1 mb-4 text-xs">
                              <li>Choose a licensed brokerage.</li>
                              <li>Research the stock thoroughly.</li>
                              <li>Decide YOUR OWN entry point based on YOUR risk tolerance.</li>
                              <li>Consider using a &quot;Limit Order&quot;.</li>
                              <li>Only invest money you can afford to lose.</li>
                              <li>Consider setting a stop-loss to manage your risk.</li>
                            </ol>
                            <div className="text-xs text-tvAmber font-bold mt-2">⚠️ StoxPilot is an educational platform. We are NOT financial advisors.</div>
                          </>
                        )}
                        {isGodMode && (
                          <>
                            <p className="font-bold text-white mb-2">🎯 When to sell:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Target 1 (<strong className="text-tvAmber font-mono">${signal.targets[0]}</strong>): Sell 50%</li>
                              <li>Target 2 (<strong className="text-tvAmber font-mono">${signal.targets[1]}</strong>): Sell 25%</li>
                            </ul>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Targets */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center">
                <Target className="w-4 h-4 mr-1 text-gray-400" /> {labels.target}
              </h4>
              {signal.targets.map((t: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm p-3 bg-black/20 rounded-lg border border-gray-800">
                  <span className="text-gray-400 font-medium">Level {i + 1}</span>
                  <span className="text-tvGreen font-bold font-mono">${t}</span>
                </div>
              ))}
            </div>

            {/* Indicator Breakdowns */}
            <div>
               <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                 <TrendingUp className="w-4 h-4 mr-1 text-gray-400" /> 
                 Technical Logic
                 <HelpBadge title="Technical Logic" description="These are the exact math formulas creating the signal. No magic, just tracking past behavior safely." />
               </h4>
               <div className="space-y-2">
                 {signal.indicators.slice(0, experienceLevel === 'beginner' ? 3 : 10).map((ind: any, i: number) => (
                   <div key={i} className="flex flex-col text-xs bg-[#111827]/80 p-3 rounded-lg border border-gray-800/50">
                     <div className="flex justify-between mb-1">
                        <span className="text-gray-300 font-bold">{ind.name}</span>
                        <span className={`${
                          ind.verdict === 'bullish' ? 'text-tvGreen' :
                          ind.verdict === 'bearish' ? 'text-tvRed' :
                          'text-gray-500'
                        } font-bold uppercase`}>{ind.verdict}</span>
                     </div>
                     {experienceLevel !== 'experienced' && (
                       <span className="text-gray-400 italic font-medium leading-relaxed mt-1">
                         {getFriendlyIndicatorDescription(ind.name, ind)}
                       </span>
                     )}
                   </div>
                 ))}
                 {experienceLevel === 'beginner' && signal.indicators.length > 3 && (
                   <div className="text-center text-xs text-gray-500 mt-2 font-medium">
                     + {signal.indicators.length - 3} more technical checks passed securely
                   </div>
                 )}
               </div>
            </div>
            
            {!isGodMode && (
              <div className="mt-8 pt-4 border-t border-gray-800/50 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{labels.disclaimer}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
