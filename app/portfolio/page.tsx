"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { PortfolioTable } from "@/components/portfolio/PortfolioTable"
import { MOCK_STOCKS } from "@/lib/mockData"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Plus, PieChart, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export default function PortfolioPage() {
  const { portfolio, addToPortfolio } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ symbol: '', quantity: '', price: '' })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.symbol || !form.quantity || !form.price) return
    
    addToPortfolio({
      id: Date.now().toString(),
      symbol: form.symbol.toUpperCase(),
      name: `${form.symbol.toUpperCase()} Stock`,
      quantity: Number(form.quantity),
      buyPrice: Number(form.price),
      buyDate: Date.now()
    })
    
    setForm({ symbol: '', quantity: '', price: '' })
    setShowAdd(false)
  }

  // Calculate top line stats
  let totalInvested = 0
  let currentValue = 0
  
  const chartData = portfolio.map(p => {
    const livePrice = MOCK_STOCKS.find(s => s.symbol === p.symbol)?.price || p.buyPrice
    const invested = p.quantity * p.buyPrice
    const current = p.quantity * livePrice
    
    totalInvested += invested
    currentValue += current
    return { symbol: p.symbol, current }
  })

  const totalPnl = currentValue - totalInvested
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const isProfit = totalPnl >= 0

  return (
    <div className="space-y-8 animate-in fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center"><PieChart className="w-8 h-8 text-blue-500 mr-3" /> My Portfolio</h1>
          <p className="text-gray-400 mt-2 text-sm">Simulate active holdings tracking natively against LIVE variations seamlessly without external accounts.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-tvGreen text-white font-bold rounded-lg hover:bg-tvGreen/90 transition-colors flex items-center shadow-lg shadow-tvGreen/20"
        >
          <Plus className="w-5 h-5 mr-1" /> Add Position
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-tvGreen" />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Symbol</label>
            <input 
              type="text" required placeholder="e.g. AAPL" 
              value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})}
              className="w-full bg-[#131722] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tvGreen focus:ring-1 focus:ring-tvGreen" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Shares</label>
            <input 
              type="number" required min="0.1" step="0.1" placeholder="e.g. 10"
              value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
              className="w-full bg-[#131722] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tvGreen focus:ring-1 focus:ring-tvGreen" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Avg Buy Price</label>
            <input 
              type="number" required min="1" step="0.01" placeholder="e.g. 150.50"
              value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="w-full bg-[#131722] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tvGreen focus:ring-1 focus:ring-tvGreen" 
            />
          </div>
          <button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
            Confirm Trade
          </button>
        </form>
      )}

      {portfolio.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center border border-dashed border-gray-700/50 rounded-2xl bg-[#131722]/50">
          <DollarSign className="w-16 h-16 text-gray-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Portfolio Empty</h2>
          <p className="text-gray-400 mb-6 max-w-sm">Add your very first stock above to start tracking gains & tracking allocation seamlessly.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50 flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Value</p>
              <h2 className="text-4xl font-bold text-white">{formatCurrency(currentValue)}</h2>
              <p className="text-sm text-gray-500 mt-2">Invested: {formatCurrency(totalInvested)}</p>
            </div>
            
            <div className={`bg-[#1E222D] p-6 rounded-xl border ${isProfit ? 'border-tvGreen/30 bg-tvGreen/5' : 'border-tvRed/30 bg-tvRed/5'} flex flex-col justify-center relative overflow-hidden`}>
              {isProfit ? <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-tvGreen/10" /> : <TrendingDown className="absolute -right-4 -bottom-4 w-32 h-32 text-tvRed/10" />}
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total P&L</p>
              <h2 className={`text-4xl font-bold ${isProfit ? 'text-tvGreen' : 'text-tvRed'}`}>
                {isProfit ? '+' : ''}{formatCurrency(totalPnl)}
              </h2>
              <p className={`text-sm font-bold mt-2 inline-flex ${isProfit ? 'text-tvGreen' : 'text-tvRed'}`}>
                {isProfit ? '+' : ''}{totalPnlPercent.toFixed(2)}% All-time
              </p>
            </div>

            <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50 flex items-center justify-center">
              <div className="w-full max-w-[200px] h-[120px] rounded-full border-[16px] border-[#131722] relative flex items-center justify-center aspect-square"
               style={{ 
                 background: `conic-gradient(#26A69A 0% 35%, #2962FF 35% 85%, #9C27B0 85% 100%)` 
               }}>
                 <div className="w-full h-full bg-[#1E222D] rounded-full flex items-center justify-center absolute scale-75">
                   <span className="text-xs font-bold text-gray-400">ALLOCATION</span>
                 </div>
              </div>
            </div>
          </div>

          <PortfolioTable />
        </>
      )}
    </div>
  )
}
