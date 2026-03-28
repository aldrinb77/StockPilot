"use client"

import { useEffect, useState, useMemo } from "react"
import { fetchHistoricalData } from "@/lib/api"
import { Signal, OHLCV } from "@/lib/types"
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimeframeSignal {
  timeframe: string;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'STRONG_BUY' | 'STRONG_SELL';
  strength: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
}

export function MultiTimeframe({ symbol }: { symbol: string }) {
  const [signals, setSignals] = useState<TimeframeSignal[]>([])
  const [loading, setLoading] = useState(true)

  const timeframes = [
    { label: "15 min", range: "1d", interval: "15m" },
    { label: "1 hour", range: "1d", interval: "1h" },
    { label: "4 hour", range: "5d", interval: "1h" }, // Yahoo doesn't have 4h in v8 easily, 1h is proxy
    { label: "1 Day", range: "1mo", interval: "1d" },
    { label: "1 Week", range: "6mo", interval: "1wk" },
  ]

  useEffect(() => {
    const loadAllSignals = async () => {
      setLoading(true)
      const results: TimeframeSignal[] = []
      
      for (const tf of timeframes) {
        try {
          const hist = await fetchHistoricalData(symbol, tf.range, tf.interval)
          if (hist.length < 2) continue
          
          const last = hist[hist.length-1]
          const prev = hist[hist.length-2]
          const trend = last.close > prev.close ? 'UP' : last.close < prev.close ? 'DOWN' : 'FLAT'
          
          // Simplified signal logic for demo
          let type: any = 'NEUTRAL'
          let strength = 50
          
          if (trend === 'UP') {
            type = 'BULLISH'
            strength = 60 + Math.random() * 20
          } else if (trend === 'DOWN') {
            type = 'BEARISH'
            strength = 60 + Math.random() * 20
          }
          
          if (strength > 75) type = trend === 'UP' ? 'STRONG_BUY' : 'STRONG_SELL'
          
          results.push({ timeframe: tf.label, type, strength, trend })
        } catch (err) {}
      }
      setSignals(results)
      setLoading(false)
    }
    
    loadAllSignals()
  }, [symbol])

  const agreement = useMemo(() => {
    if (signals.length === 0) return null
    const bulls = signals.filter(s => s.type.includes('BULLISH') || s.type.includes('BUY')).length
    const bears = signals.filter(s => s.type.includes('BEARISH') || s.type.includes('SELL')).length
    const total = signals.length
    
    if (bulls >= 4) return { type: 'BULLISH', count: bulls, total }
    if (bears >= 4) return { type: 'BEARISH', count: bears, total }
    return { type: 'MIXED', count: Math.max(bulls, bears), total }
  }, [signals])

  if (loading) return (
     <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 animate-pulse">
        <div className="h-6 w-48 bg-white/5 rounded-lg mb-8" />
        <div className="space-y-4">
           {[1,2,3,4,5].map(i => <div key={i} className="h-12 w-full bg-white/5 rounded-xl" />)}
        </div>
     </div>
  )

  return (
    <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#2979ff] blur-[100px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-10">
         <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[#2979ff]">
            <Clock className="w-5 h-5" />
         </div>
         <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Temporal Alignment Matrix</h3>
      </div>

      <div className="space-y-2 mb-12">
         {signals.map((s, i) => (
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               key={s.timeframe} 
               className="flex items-center justify-between p-4 px-6 bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl border border-transparent hover:border-white/5 transition-all"
            >
               <span className="text-xs font-black text-[#8899a6] w-20 uppercase tracking-widest">{s.timeframe}</span>
               <div className="flex-1 flex items-center justify-center">
                  <span className={cn(
                    "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                    s.type.includes('BULLISH') || s.type.includes('BUY') ? "bg-[#00e67610] text-[#00e676] border-[#00e67620]" :
                    s.type.includes('BEARISH') || s.type.includes('SELL') ? "bg-[#ff174410] text-[#ff1744] border-[#ff174420]" :
                    "bg-white/5 text-gray-500 border-white/10"
                  )}>
                    {s.type.replace('_', ' ')}
                  </span>
               </div>
               <div className="w-32 flex items-center gap-3">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-white/20" style={{ width: `${s.strength}%` }} />
                  </div>
                  <span className="text-[10px] font-mono font-black text-white w-8 text-right">{Math.round(s.strength)}%</span>
               </div>
               <div className="w-20 flex justify-end">
                  {s.trend === 'UP' ? <TrendingUp className="w-4 h-4 text-[#00e676]" /> : s.trend === 'DOWN' ? <TrendingDown className="w-4 h-4 text-[#ff1744]" /> : <Minus className="w-4 h-4 text-gray-700" />}
               </div>
            </motion.div>
         ))}
      </div>

      <div className={cn(
        "p-8 rounded-[2rem] border relative overflow-hidden",
        agreement?.type === 'BULLISH' ? "bg-[#00e67608] border-[#00e67620]" :
        agreement?.type === 'BEARISH' ? "bg-[#ff174408] border-[#ff174420]" :
        "bg-white/[0.02] border-white/5"
      )}>
         <div className="flex items-start gap-6">
            <div className={cn(
               "p-4 rounded-2xl border bg-white/5",
               agreement?.type === 'BULLISH' ? "text-[#00e676] border-[#00e67610]" :
               agreement?.type === 'BEARISH' ? "text-[#ff1744] border-[#ff174410]" :
               "text-[#8899a6] border-white/5"
            )}>
               {agreement?.type === 'BULLISH' ? <Zap className="w-6 h-6 fill-current" /> : agreement?.type === 'BEARISH' ? <TrendingDown className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
            </div>
            <div className="space-y-2">
               <h4 className="text-sm font-black text-white uppercase tracking-widest">
                  Fractal Convergence: {agreement?.count}/{agreement?.total} {agreement?.type} Alignment
               </h4>
               <p className="text-[11px] text-[#8899a6] font-bold leading-relaxed uppercase tracking-widest">
                 {agreement?.type === 'BULLISH' ? "When multiple timeframes agree, the trend momentum is significantly higher. High probability setup detected." : 
                  agreement?.type === 'BEARISH' ? "Systemic weakness across multiple intervals. Bearish divergence confirms structural breakdown." :
                  "Conflicting temporal data. Market is in an indecisive regime. Exercise extreme caution for new entries."}
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}
