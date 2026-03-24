"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { MOCK_STOCKS } from "@/lib/mockData"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Calculator, Search, History, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

export function WhatIfCalculator() {
  const { selectedMarket } = useStore()
  const [symbol, setSymbol] = useState("AAPL")
  const [amount, setAmount] = useState<number>(1000)
  const [period, setPeriod] = useState<string>("1Y")
  const [search, setSearch] = useState("")

  const stock = MOCK_STOCKS.find(s => s.symbol === symbol) || MOCK_STOCKS[0]
  const currentPrice = stock.price
  
  // Mock historical variance
  const multipliers: Record<string, number> = {
    "1M": 1.05,
    "3M": 1.12,
    "6M": 1.25,
    "1Y": 1.45,
    "2Y": 1.80,
    "5Y": 3.20
  }
  
  const multiplier = multipliers[period] || 1
  const entryPrice = currentPrice / multiplier
  const shares = amount / entryPrice
  const currentValue = shares * currentPrice
  const profit = currentValue - amount
  const profitPercent = (profit / amount) * 100

  const suggestions = search ? MOCK_STOCKS.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : []

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border-tvBlue/30 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-tvBlue/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-tvBlue/10 transition-all"></div>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-tvBlue/10 text-tvBlue rounded-xl border border-tvBlue/20">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-heading">Historical ROE Calculator</h2>
          <p className="text-sm text-gray-500">Calculate the &quot;What If&quot; growth of your capital.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Target Asset</label>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={search || symbol} 
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-white focus:border-tvBlue outline-none"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#111827] border border-gray-700 rounded-xl overflow-hidden z-[50] shadow-2xl">
                   {suggestions.map(s => (
                      <button key={s.symbol} onClick={() => { setSymbol(s.symbol); setSearch(""); }} className="w-full p-4 hover:bg-white/5 text-left border-b border-gray-800 last:border-0 font-bold text-white">
                         {s.symbol} <span className="text-xs text-gray-500 ml-2">{s.name}</span>
                      </button>
                   ))}
                </div>
              )}
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Initial Amount</label>
           <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 pl-8 pr-4 text-white focus:border-tvBlue outline-none"
              />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Time Horizon</label>
           <select 
             value={period}
             onChange={e => setPeriod(e.target.value)}
             className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:border-tvBlue outline-none"
           >
              <option value="1M">1 Month Ago</option>
              <option value="3M">3 Months Ago</option>
              <option value="6M">6 Months Ago</option>
              <option value="1Y">1 Year Ago</option>
              <option value="2Y">2 Years Ago</option>
              <option value="5Y">5 Years Ago</option>
           </select>
        </div>
      </div>

      <div className="bg-black/30 p-8 rounded-2xl border border-white/5 text-center relative overflow-hidden group/result">
        <div className="absolute inset-0 bg-tvBlue/5 opacity-0 group-hover/result:opacity-100 transition-opacity"></div>
        
        <p className="text-gray-400 font-medium mb-1">If you invested {formatCurrency(amount, selectedMarket)} in {symbol} {period} ago:</p>
        <p className="text-4xl font-black text-white mb-2 font-heading tracking-tight">{formatCurrency(currentValue, selectedMarket)}</p>
        <div className="flex items-center justify-center space-x-3">
           <span className={`flex items-center text-lg font-bold ${profit > 0 ? 'text-tvGreen' : 'text-tvRed'}`}>
              {profit > 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
              {formatCurrency(profit, selectedMarket)} ({profitPercent.toFixed(2)}%)
           </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-800">
           <div className="text-left">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Past Price</p>
              <p className="text-sm font-bold text-white">{formatCurrency(entryPrice, selectedMarket)}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center justify-end"><DollarSign className="w-3 h-3 mr-1" /> Now</p>
              <p className="text-sm font-bold text-white">{formatCurrency(currentPrice, selectedMarket)}</p>
           </div>
        </div>
      </div>

      <div className="mt-6 flex items-start space-x-3 px-2">
         <div className="p-1 rounded bg-tvAmber/10 text-tvAmber mt-0.5">
            <Calendar className="w-3 h-3" />
         </div>
         <p className="text-[10px] text-gray-500 leading-relaxed italic">
           Educational Tool: Past performance is simulated using rule-based backtesting and does not guarantee future indicators alignment. Market data is for strictly educational readings only.
         </p>
      </div>
    </div>
  )
}
