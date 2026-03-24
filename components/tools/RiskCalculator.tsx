"use client"

import { useState } from "react"
import { Calculator, DollarSign, Percent, AlertTriangle } from "lucide-react"

export function RiskCalculator() {
  const [capital, setCapital] = useState(1000)
  const [riskPercent, setRiskPercent] = useState(2)
  const [entryPrice, setEntryPrice] = useState(150)
  const [stopLoss, setStopLoss] = useState(140)

  // Explicit mathematical safety bounds
  const riskAmount = capital * (riskPercent / 100)
  const riskPerShare = entryPrice - stopLoss
  
  const sharesSafe = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0
  const positionSize = sharesSafe * entryPrice
  const RMultiplier = riskPerShare > 0 ? (entryPrice * 1.1 - entryPrice) / riskPerShare : 0 // Assuming 10% average target

  return (
    <div className="glass-panel p-6 rounded-2xl max-w-lg w-full">
      <h3 className="text-xl font-bold font-heading text-white mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-tvPurple" /> Position Risk Matrix
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase">Account Size ($)</label>
          <input 
            type="number" value={capital} onChange={e => setCapital(Number(e.target.value))}
            className="w-full bg-[#111827] border border-gray-700/50 rounded-lg p-2 text-white outline-none focus:border-tvPurple"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase">Risk Limit (%)</label>
          <input 
            type="number" value={riskPercent} onChange={e => setRiskPercent(Number(e.target.value))}
            className="w-full bg-[#111827] border border-gray-700/50 rounded-lg p-2 text-white outline-none focus:border-tvPurple"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase">Entry Price ($)</label>
          <input 
            type="number" value={entryPrice} onChange={e => setEntryPrice(Number(e.target.value))}
            className="w-full bg-[#111827] border border-gray-700/50 rounded-lg p-2 text-white outline-none focus:border-tvPurple"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase">Stop Loss ($)</label>
          <input 
            type="number" value={stopLoss} onChange={e => setStopLoss(Number(e.target.value))}
            className="w-full bg-[#111827] border border-gray-700/50 rounded-lg p-2 text-white outline-none focus:border-tvPurple"
          />
        </div>
      </div>

      <div className="bg-[#111827]/80 p-4 rounded-xl border border-tvPurple/30">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Max Risk Capital</span>
          <span className="text-tvRed font-mono font-bold">${riskAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Recommended Shares</span>
          <span className="text-white font-mono font-bold text-lg">{sharesSafe}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-800">
          <span className="text-sm text-gray-400">Total Position Size</span>
          <span className="text-tvBlue font-mono font-bold">${positionSize.toFixed(2)}</span>
        </div>
      </div>

      {positionSize > capital && (
        <div className="mt-4 bg-tvRed/10 border border-tvRed/30 p-3 rounded-lg flex items-start text-xs text-tvRed">
          <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
          <span>Calculated position size (${positionSize.toFixed(2)}) exceeds your account capital (${capital.toFixed(2)}). Consider using leverage carefully or widening your stop loss.</span>
        </div>
      )}
    </div>
  )
}
