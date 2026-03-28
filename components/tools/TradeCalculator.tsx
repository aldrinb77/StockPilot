"use client"

import { useState, useEffect, useMemo } from "react"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  Target,
  AlertTriangle
} from "lucide-react"

export function TradeCalculator() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  
  const [balance, setBalance] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("trade_balance")) || 1000000
    }
    return 1000000
  })
  
  const [riskPercent, setRiskPercent] = useState(2)
  const [entryPrice, setEntryPrice] = useState<string>("")
  const [stopLoss, setStopLoss] = useState<string>("")
  const [targetPrice, setTargetPrice] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    localStorage.setItem("trade_balance", balance.toString())
  }, [balance])

  const entry = parseFloat(entryPrice) || 0
  const sl = parseFloat(stopLoss) || 0
  const tp = parseFloat(targetPrice) || 0
  
  const plan = useMemo(() => {
    if (!entry || !sl || !balance) return null
    
    const riskAmount = (balance * riskPercent) / 100
    const perShareRisk = Math.abs(entry - sl)
    if (perShareRisk === 0) return null
    
    const shares = Math.floor(riskAmount / perShareRisk)
    const investment = shares * entry
    const potentialProfit = tp ? Math.abs(tp - entry) * shares : 0
    const rr = potentialProfit / riskAmount
    
    return {
      shares,
      investment,
      riskAmount,
      potentialProfit,
      rr,
      isRiskValid: riskPercent <= 2,
      isRRValid: tp ? rr >= 2 : true
    }
  }, [balance, riskPercent, entry, sl, tp])

  const handleCopy = () => {
    if (!plan) return
    const text = `TRADE PLAN:
Asset Price: ${marketConfig.currencySymbol}${entry}
Entry: ${marketConfig.currencySymbol}${entry}
Stop Loss: ${marketConfig.currencySymbol}${sl}
Target: ${tp ? `${marketConfig.currencySymbol}${tp}` : 'N/A'}
Position Size: ${plan.shares} shares
Investment: ${marketConfig.currencySymbol}${plan.investment.toLocaleString()}
Risk: ${marketConfig.currencySymbol}${plan.riskAmount.toLocaleString()} (${riskPercent}%)
R:R Ratio: 1:${plan.rr.toFixed(2)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-8 glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-48 h-48 bg-[#2979ff] blur-[100px] opacity-[0.03]" />
         <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#2979ff]">
               <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Risk Management Input</h3>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Operational Balance ({marketConfig.currencySymbol})</label>
               <input 
                 type="number" 
                 value={balance}
                 onChange={(e) => setBalance(Number(e.target.value))}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black text-xl focus:border-[#2979ff] outline-none transition-all placeholder:text-[#5c6b7a]"
                 placeholder="0.00"
               />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Risk Allocation per Execution: {riskPercent}%</label>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${riskPercent <= 2 ? 'bg-[#00e67610] text-[#00e676]' : 'bg-[#ffab0010] text-[#ffab00]'}`}>
                    {riskPercent <= 2 ? 'Conservative' : 'Aggressive'}
                  </span>
               </div>
               <input 
                 type="range" min="1" max="10" step="0.5"
                 value={riskPercent}
                 onChange={(e) => setRiskPercent(Number(e.target.value))}
                 className="w-full h-1 bg-[#1a2332] rounded-lg appearance-none cursor-pointer accent-[#2979ff]"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Entry Target</label>
                  <input 
                    type="number" value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#2979ff] outline-none placeholder:text-[#5c6b7a]"
                    placeholder="2450.00"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#ff1744] uppercase tracking-widest">Stop Loss Node</label>
                  <input 
                    type="number" value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-[#ff174410] border border-[#ff174420] rounded-2xl p-4 text-[#ff1744] font-black text-lg focus:border-[#ff1744] outline-none placeholder:text-[#ff174440]"
                    placeholder="2400.00"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#00e676] uppercase tracking-widest">Profit Objective</label>
                  <input 
                    type="number" value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full bg-[#00e67610] border border-[#00e67620] rounded-2xl p-4 text-[#00e676] font-black text-lg focus:border-[#00e676] outline-none placeholder:text-[#00e67640]"
                    placeholder="2600.00"
                  />
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-8 glass-card p-10 rounded-[3rem] border border-white/5 bg-[#2979ff]/[0.02] flex flex-col relative">
         <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00e676]" />
              Strategic Trade Plan
            </h4>
            <div className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">
               Formula: Model Alpha 1
            </div>
         </div>

         {!plan ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-30 py-20">
               <Calculator className="w-12 h-12" />
               <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Parameter Alignment</p>
            </div>
         ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Execution Quantity</p>
                     <p className="text-4xl font-black text-white tracking-tighter">{plan.shares} <span className="text-xl text-[#8899a6]">Shares</span></p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Capital Exposure</p>
                     <p className="text-4xl font-black text-white tracking-tighter">{marketConfig.currencySymbol}{Math.floor(plan.investment).toLocaleString()}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-10 py-6 border-y border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-[#ff1744] uppercase tracking-widest">Hard Risk Node</p>
                     <p className="text-2xl font-black text-[#ff1744] tracking-tighter">-{marketConfig.currencySymbol}{plan.riskAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-[#00e676] uppercase tracking-widest">Objective Outcome</p>
                     <p className="text-2xl font-black text-[#00e676] tracking-tighter">+{marketConfig.currencySymbol}{plan.potentialProfit.toLocaleString()}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div>
                     <p className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest mb-1">Risk:Reward Architecture</p>
                     <div className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                        1 : {plan.rr.toFixed(2)}
                        {plan.isRRValid ? (
                           <span className="text-[10px] px-3 py-1 bg-[#00e676] text-black rounded-lg">Elite Alpha</span>
                        ) : (
                           <span className="text-[10px] px-3 py-1 bg-[#ff1744] text-white rounded-lg">Sub-Optimal</span>
                        )}
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676] blur-[50px] opacity-10 pointer-events-none" />
               </div>

               <div className="space-y-4">
                  <div className="bg-white/5 p-6 rounded-2xl space-y-6 relative border border-white/5">
                     <div className="flex justify-between items-center text-[10px] font-black text-[#00e676] uppercase tracking-widest">
                        <span>Profit Territory</span>
                        <span>+{marketConfig.currencySymbol}{Math.floor(plan.potentialProfit).toLocaleString()}</span>
                     </div>
                     <div className="relative h-2 bg-[#ff174420] rounded-full overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 bg-[#ff1744] w-1/3" />
                        <div className="absolute top-0 bottom-0 left-1/3 right-0 bg-[#00e676]" />
                        <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white shadow-[0_0_10px_white]" title="Entry" />
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black text-[#ff1744] uppercase tracking-widest">
                        <span>Risk Territory</span>
                        <span>-{marketConfig.currencySymbol}{Math.floor(plan.riskAmount).toLocaleString()}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 px-8 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#2979ff] hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied Protocol' : 'Export Execution Plan'}
                  </button>
                  <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group">
                     <Target className="w-5 h-5 group-hover:scale-125 transition-transform text-[#00e676]" />
                  </button>
               </div>

               <div className="space-y-2">
                  {plan.isRiskValid && plan.isRRValid ? (
                     <div className="flex items-center gap-3 text-[#00e676]">
                        <Check className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">PROTOCOL VALIDATED: EXECUTE WITH CONFIDENCE</span>
                     </div>
                  ) : (
                     <div className="flex items-center gap-3 text-[#ffab00]">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">STRATEGIC WARNING: NON-IDEAL PARAMETERS DETECTED</span>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  )
}
