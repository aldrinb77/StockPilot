"use client"

import { useState, useEffect } from "react"
import { Calculator, Target, Shield, Zap, TrendingUp, TrendingDown, RefreshCw, ChevronRight, BarChart3, PieChart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"

export default function TradeCalculator() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  
  const [balance, setBalance] = useState(100000)
  const [riskPercent, setRiskPercent] = useState(2)
  const [entry, setEntry] = useState(100)
  const [stopLoss, setStopLoss] = useState(95)
  const [target, setTarget] = useState(115)

  // Calculations
  const riskAmount = (balance * riskPercent) / 100
  const riskPerShare = Math.abs(entry - stopLoss)
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0
  const totalInvestment = shares * entry
  const potentialProfitPerShare = Math.abs(target - entry)
  const potentialProfit = shares * potentialProfitPerShare
  const rewardRiskRatio = riskPerShare > 0 ? (potentialProfitPerShare / riskPerShare).toFixed(2) : "0.00"

  const leverage = balance > 0 ? (totalInvestment / balance).toFixed(2) : "0.00"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
       
       {/* Input Section */}
       <div className="lg:col-span-12">
          <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group shadow-2xl shadow-black h-fit">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tvBlue blur-[150px] opacity-[0.03] pointer-events-none" />
             
             <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                <div className="bg-tvBlue/10 p-5 rounded-3xl border border-tvBlue/20 shadow-xl group-hover:scale-110 transition-transform">
                   <Target className="w-10 h-10 text-tvBlue" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Institutional Risk Protocol</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      Precision position sizing based on {marketConfig.name} dynamics.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                <InputGroup label="Account Balance" icon={<Shield className="w-4 h-4" />} value={balance} onChange={setBalance} suffix={marketConfig.currencySymbol} />
                <InputGroup label="Risk per Trade (%)" icon={<Zap className="w-4 h-4" />} value={riskPercent} onChange={setRiskPercent} suffix="%" />
                <InputGroup label="Entry Strategy Price" icon={<Target className="w-4 h-4" />} value={entry} onChange={setEntry} suffix={marketConfig.currencySymbol} />
                <InputGroup label="Hard Stop Loss" icon={<TrendingDown className="w-4 h-4" />} value={stopLoss} onChange={setStopLoss} suffix={marketConfig.currencySymbol} />
                <InputGroup label="Primary Target" icon={<TrendingUp className="w-4 h-4" />} value={target} onChange={setTarget} suffix={marketConfig.currencySymbol} />
             </div>
          </div>
       </div>

       {/* Results Matrix */}
       <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <ResultCard title="Units to Acquire" value={shares} label="Position Count" icon={<Target className="w-5 h-5 text-tvGreen" />} />
             <ResultCard title="Risk Amount" value={formatCurrency(riskAmount)} label="Portfolio Liability" icon={<Shield className="w-5 h-5 text-tvRed" />} isText />
             <ResultCard title="Potential Alpha" value={formatCurrency(potentialProfit)} label="Profit Target" icon={<TrendingUp className="w-5 h-5 text-tvGreen" />} isText />
          </div>

          <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tvPurple blur-[150px] opacity-[0.03] pointer-events-none" />
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4 text-white">
                   <BarChart3 className="w-6 h-6 text-tvPurple" />
                   <h3 className="text-sm font-black uppercase tracking-[0.4em]">Operational Metrics Matrix</h3>
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">Algorithm Version 2.1</div>
             </div>

             <div className="space-y-12">
                <MetricRow label="Risk:Reward Ratio" value={`1:${rewardRiskRatio}`} weight={Number(rewardRiskRatio) >= 2 ? 'STRONG' : 'WEAK'} color={Number(rewardRiskRatio) >= 2 ? 'text-tvGreen' : 'text-tvAmber'} />
                <MetricRow label="Total Required Capital" value={formatCurrency(totalInvestment)} weight={`${(((totalInvestment) / balance) * 100).toFixed(1)}% OF BALANCE`} color="text-tvBlue" />
                <MetricRow label="Projected P&L Ratio" value={((potentialProfit / totalInvestment) * 100).toFixed(2) + "%"} weight="ROI AT TARGET" color="text-tvPurple" />
                <MetricRow label="Leverage Exposure" value={`${leverage}x`} weight={Number(leverage) > 1 ? 'LEVERAGED' : 'CONSERVATIVE'} color={Number(leverage) > 1 ? 'text-tvRed' : 'text-tvGreen'} />
             </div>
          </div>
       </div>

       {/* Visual Risk Chart */}
       <div className="lg:col-span-4 space-y-10">
          <div className="glass-card p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl shadow-[#00e67605]">
             <div className="flex items-center gap-4 text-white mb-10 relative z-10">
                <PieChart className="w-6 h-6 text-tvGreen" />
                <h3 className="text-sm font-black uppercase tracking-[0.4em]">Tactical Visualization</h3>
             </div>
             
             {/* Visual Vertical Chart (Entry, SL, Target) */}
             <div className="relative h-[400px] flex items-center justify-center p-12 z-10">
                <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-white/5 -translate-x-1/2" />
                
                <div className="flex flex-col justify-between h-full w-full">
                   <ChartLevel label="Primary Target" value={target} color="bg-tvGreen" position="top" />
                   <ChartLevel label="Entry Strategy" value={entry} color="bg-tvBlue" position="center" />
                   <ChartLevel label="Hard Stop Loss" value={stopLoss} color="bg-tvRed" position="bottom" />
                </div>
             </div>

             <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 mt-10 relative z-10 hover:bg-white/10 transition-all">
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest italic mb-6">
                   "Never risk more than 2% on a single command. Survival is the only path to elite performance."
                </p>
                <button className="w-full py-4 bg-tvGreen text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-tvGreen/30 active:scale-95 transition-all">
                   Export Trade Command PNG
                </button>
             </div>
          </div>
       </div>

    </div>
  )
}

function InputGroup({ label, icon, value, onChange, suffix }: any) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">
          {icon} {label}
       </div>
       <div className="relative group/in">
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-lg font-black focus:outline-none focus:ring-2 focus:ring-tvBlue transition-all group-hover/in:border-tvBlue/30" 
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500 uppercase tracking-widest">{suffix}</div>
       </div>
    </div>
  )
}

function ResultCard({ title, value, label, icon, isText = false }: any) {
  return (
    <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:scale-[1.05] transition-transform">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] opacity-[0.05] pointer-events-none" />
        <div className="flex items-center gap-4 text-white mb-8">
           <div className="p-3 bg-white/5 border border-white/10 rounded-xl shadow-lg">
              {icon}
           </div>
           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8899a6]">{title}</h4>
        </div>
        <div className="text-3xl font-black text-white font-mono tracking-tighter mb-4">
           {value}
        </div>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-tvGreen" />
           <p className="text-[9px] text-[#5c6b7a] font-black uppercase tracking-widest leading-none">
              {label}
           </p>
        </div>
    </div>
  )
}

function MetricRow({ label, value, weight, color }: any) {
  return (
    <div className="flex items-center justify-between group/row">
       <div className="space-y-1">
          <p className="text-xs font-black text-white uppercase tracking-widest group-hover/row:text-tvBlue transition-colors">{label}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{weight}</p>
       </div>
       <div className={cn("text-3xl font-black font-mono tracking-tighter", color)}>
          {value}
       </div>
    </div>
  )
}

function ChartLevel({ label, value, color, position }: any) {
  return (
    <div className="flex items-center gap-6 relative group">
       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-[10px] border shadow-2xl relative z-10 group-hover:scale-120 transition-transform", color, color.replace('bg-', 'border-'))}>
          {position === 'top' ? 'TP' : position === 'center' ? 'EP' : 'SL'}
       </div>
       <div className="space-y-1 relative z-10">
          <p className="text-[9px] font-black text-[#5c6b7a] uppercase tracking-widest">{label}</p>
          <p className="text-xl font-black text-white font-mono tracking-tighter">{value}</p>
       </div>
       <div className={cn("absolute left-0 right-[-100px] h-[1px] opacity-[0.02]", color)} />
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
