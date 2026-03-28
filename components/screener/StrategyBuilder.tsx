"use client"

import { useState } from "react"
import { Zap, Target, Shield, LayoutGrid, Layers, ChevronRight, Play, Save, Trash2, Sliders, Activity, Sparkles, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FilterRule {
  id: string;
  indicator: string;
  condition: string;
  value: string;
}

export function StrategyBuilder({ onApply }: { onApply: (rules: FilterRule[]) => void }) {
  const [rules, setRules] = useState<FilterRule[]>([
    { id: '1', indicator: 'RSI', condition: 'LESS_THAN', value: '30' },
    { id: '2', indicator: 'VOLUME_PROXIMITY', condition: 'GREATER_THAN', value: '1.5' },
  ])

  const indicators = [
    { label: 'RSI (14)', value: 'RSI' },
    { label: 'MACD Signal', value: 'MACD' },
    { label: 'SMA (200) Distance', value: 'SMA_200' },
    { label: 'Volume Multiplier', value: 'VOLUME_PROXIMITY' },
    { label: 'Bollinger Bands %B', value: 'BB_PERCENT' },
    { label: 'ATR Volatility', value: 'ATR' },
  ]

  const conditions = [
    { label: 'Less Than (<)', value: 'LESS_THAN' },
    { label: 'Greater Than (>)', value: 'GREATER_THAN' },
    { label: 'Bullish Crossover', value: 'BULLISH_CROSS' },
    { label: 'Bearish Crossover', value: 'BEARISH_CROSS' },
    { label: 'Near Level (±2%)', value: 'NEAR' },
  ]

  const addRule = () => {
    setRules([...rules, { id: Math.random().toString(36).substr(2, 9), indicator: 'RSI', condition: 'LESS_THAN', value: '50' }])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id))
  }

  const updateRule = (id: string, updates: Partial<FilterRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  return (
    <div className="glass-card p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tvAmber blur-[150px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-white/5 pb-10">
         <div className="flex items-center gap-5 text-tvAmber">
            <div className="bg-tvAmber/10 p-4 rounded-3xl border border-tvAmber/20 shadow-xl group-hover:scale-110 transition-transform">
               <Zap className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] leading-tight">Quant Strategy Builder</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  Construct multifaceted algorithmic filters for high-precision entry.
               </p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all shadow-xl">
               <Save className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-tvAmber text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-tvAmber/20 flex items-center gap-3 active:scale-95 transition-all">
               <Play className="w-4 h-4" /> Run Protocol
            </button>
         </div>
      </div>

      <div className="space-y-6 mb-12">
        <AnimatePresence>
          {rules.map((rule, index) => (
            <motion.div 
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-wrap items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group/rule hover:border-tvAmber/30 transition-all relative"
            >
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black font-mono text-gray-600">0{index + 1}</div>
               
               <div className="flex-1 min-w-[200px] space-y-2">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Indicator Matrix</p>
                  <select 
                    value={rule.indicator}
                    onChange={(e) => updateRule(rule.id, { indicator: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-tvAmber appearance-none"
                  >
                     {indicators.map(i => <option key={i.value} value={i.value} className="bg-[#0b1120]">{i.label}</option>)}
                  </select>
               </div>

               <div className="flex-1 min-w-[200px] space-y-2">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Logic Condition</p>
                  <select 
                    value={rule.condition}
                    onChange={(e) => updateRule(rule.id, { condition: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-tvAmber appearance-none"
                  >
                     {conditions.map(c => <option key={c.value} value={c.value} className="bg-[#0b1120]">{c.label}</option>)}
                  </select>
               </div>

               <div className="w-32 space-y-2">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Threshold</p>
                  <input 
                    type="text" 
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-tvAmber"
                  />
               </div>

               <button 
                onClick={() => removeRule(rule.id)}
                className="mt-6 p-3 bg-white/5 border border-white/10 rounded-xl text-gray-700 hover:text-tvRed transition-all"
               >
                  <Trash2 className="w-5 h-5" />
               </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={addRule}
        className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:bg-white/5 hover:border-tvAmber/20 hover:text-white transition-all group/add"
      >
         <div className="p-2 bg-white/5 rounded-lg group-hover/add:scale-110 transition-transform">
            <Sliders className="w-4 h-4" />
         </div>
         Inject New Parametric Filter
      </button>

      {/* Suggested Strategies */}
      <div className="mt-16 pt-10 border-t border-white/5">
        <div className="flex items-center gap-4 text-white mb-10">
           <Brain className="w-6 h-6 text-tvPurple" />
           <h3 className="text-sm font-black uppercase tracking-[0.4em]">Optimized Strategy Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: "Deep Value Recovery", desc: "RSI < 20 + SMA 200 Proximity", icon: <Layers className="w-5 h-5 text-tvGreen" /> },
             { title: "Momentum Breakout", desc: "MACD Cross + Volume 2x", icon: <Sparkles className="w-5 h-5 text-tvBlue" /> },
             { title: "Extreme Volatility", desc: "ATR Expansion + BB Rejection", icon: <Activity className="w-5 h-5 text-tvRed" /> }
           ].map((strat, i) => (
             <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-tvBlue/30 transition-all cursor-pointer group/strat">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-white/5 rounded-xl group-hover/strat:scale-110 transition-transform shadow-lg">{strat.icon}</div>
                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{strat.title}</h4>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{strat.desc}</p>
             </div>
           ))}
        </div>
      </div>

    </div>
  )
}
