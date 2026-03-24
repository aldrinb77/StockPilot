"use client"

import { useState } from "react"
import { Search, Plus, X, ArrowLeftRight, TrendingUp } from "lucide-react"
import { MOCK_STOCKS } from "@/lib/mockData"
import { generateSignal } from "@/lib/signals"

export default function ComparePage() {
  const [symbolsToCompare, setSymbolsToCompare] = useState<string[]>(['AAPL', 'MSFT'])
  const [search, setSearch] = useState('')

  // Generate simulated signals
  const comparedData = symbolsToCompare.map(sym => {
    const s = MOCK_STOCKS.find(m => m.symbol === sym) || MOCK_STOCKS[0]
    const mockOHLCV = []
    let p = s.price * 0.8
    for(let i=0; i<250; i++) {
        p = p * (1 + (Math.random() - 0.45) * 0.05)
        mockOHLCV.push({ time: i, open: p, high: p*1.02, low: p*0.98, close: p, volume: 10000 })
    }
    return { ...s, symbol: sym, signal: generateSignal(mockOHLCV) }
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim() || symbolsToCompare.length >= 4) return
    const sym = search.trim().toUpperCase()
    if (!symbolsToCompare.includes(sym)) {
      setSymbolsToCompare([...symbolsToCompare, sym])
    }
    setSearch('')
  }

  const handleRemove = (sym: string) => {
    setSymbolsToCompare(symbolsToCompare.filter(s => s !== sym))
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center font-heading">
            <ArrowLeftRight className="w-8 h-8 text-tvBlue mr-3" /> Matrix Compare
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Cross-reference up to 4 assets visualizing signals boundaries explicitly side-by-side.</p>
        </div>
        
        {symbolsToCompare.length < 4 && (
          <form onSubmit={handleAdd} className="mt-4 md:mt-0 relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Add symbol (e.g. NVDA)" 
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-gray-700 focus:border-tvBlue focus:ring-1 focus:ring-tvBlue rounded-lg pl-10 pr-12 py-3 text-sm text-foreground transition-all outline-none shadow-lg"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-tvBlue text-white p-1.5 rounded-md hover:bg-tvBlue/90">
              <Plus className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {comparedData.map(data => {
            const isBuy = data.signal.type.includes('BUY')
            const isSell = data.signal.type.includes('SELL')
            return (
              <div key={data.symbol} className="w-[300px] glass-card rounded-2xl relative overflow-hidden group">
                <button onClick={() => handleRemove(data.symbol)} className="absolute top-2 right-2 p-1.5 bg-black/40 text-gray-400 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <X className="w-4 h-4" />
                </button>
                
                {/* Header Block */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                  <h2 className="text-3xl font-bold text-white font-heading">{data.symbol}</h2>
                  <p className="text-xs text-gray-400 truncate mb-4">{data.name}</p>
                  <p className="text-2xl font-mono text-white mb-1">${data.price.toFixed(2)}</p>
                  
                  <div className={`mt-4 px-3 py-1.5 rounded-lg border flex items-center justify-center font-bold tracking-widest text-sm shadow-xl ${
                    isBuy ? 'bg-tvGreen/10 text-tvGreen border-tvGreen/30' : 
                    isSell ? 'bg-tvRed/10 text-tvRed border-tvRed/30' : 
                    'bg-tvAmber/10 text-tvAmber border-tvAmber/30'
                  }`}>
                    {data.signal.type.replace('_', ' ')}
                  </div>
                </div>

                {/* Attributes Block */}
                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                     <span className="text-gray-400">Signal Strength</span>
                     <span className="font-mono text-white bg-[#111827] px-2 py-0.5 rounded">{Math.round(data.signal.strength)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                     <span className="text-gray-400">P/E Ratio</span>
                     <span className="font-mono text-white">{data.pe}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                     <span className="text-gray-400">Stop Loss</span>
                     <span className="font-mono text-tvRed">${data.signal.stopLoss}</span>
                  </div>

                  <div>
                     <span className="text-gray-400 block mb-2 mt-2 font-bold uppercase text-xs">Primary Logic Arrays</span>
                     <div className="space-y-1">
                       {data.signal.indicators.slice(0, 3).map((ind, i) => (
                         <div key={i} className="flex justify-between items-center bg-[#111827] p-2 rounded border border-gray-800">
                           <span className="text-gray-300 text-xs">{ind.name}</span>
                           <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${ind.verdict === 'bullish' ? 'bg-tvGreen/10 text-tvGreen' : ind.verdict === 'bearish' ? 'bg-tvRed/10 text-tvRed' : 'bg-gray-800 text-gray-400'}`}>
                             {ind.verdict}
                           </span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {symbolsToCompare.length === 0 && (
             <div className="w-full min-h-[400px] border-2 border-dashed border-gray-700/50 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-[#111827]/50">
                <ArrowLeftRight className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">Empty Matrix</h3>
                <p className="text-gray-400 max-w-sm">Use the search bar above to add assets. Map signals sequentially to determine the absolute supreme algorithmic entry dynamically.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
