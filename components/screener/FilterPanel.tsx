"use client"

import * as React from "react"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"

interface FilterPanelProps {
  onFilterChange: (filters: any) => void
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [signal, setSignal] = React.useState('ALL')
  const [sector, setSector] = React.useState('ALL')
  const [price, setPrice] = React.useState('ALL')

  const handleApply = () => {
    onFilterChange({ signal, sector, price })
  }

  const handleReset = () => {
    setSignal('ALL')
    setSector('ALL')
    setPrice('ALL')
    onFilterChange({ signal: 'ALL', sector: 'ALL', price: 'ALL' })
  }

  React.useEffect(() => {
    handleApply()
  }, [signal, sector, price])

  return (
    <div className="bg-[#1E222D] border border-gray-700/50 rounded-xl p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-2 text-tvGreen" />
          Screener Filters
        </h2>
        <button 
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-white flex items-center font-medium bg-gray-800 px-3 py-1.5 rounded-md transition-colors"
        >
          <RotateCcw className="w-3 h-3 mr-1.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Signal */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signal Type</label>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'STRONG_BULLISH', 'BULLISH', 'NEUTRAL', 'BEARISH'].map(s => (
              <button
                key={s}
                onClick={() => setSignal(s)}
                className={`px-3 py-1.5 text-xs font-semibold flex-shrink-0 rounded-md transition-all ${
                  signal === s 
                    ? s.includes('BULLISH') ? 'bg-tvGreen text-white' : s.includes('BEARISH') ? 'bg-tvRed text-white' : s === 'ALL' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'
                    : 'bg-[#131722] text-gray-400 border border-gray-700/50 hover:border-gray-500'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</label>
          <select 
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full bg-[#131722] border border-gray-700/50 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-tvGreen"
          >
            <option value="ALL">All Sectors</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Consumer Cyclical">Consumer Cyclical</option>
            <option value="Communication">Communication</option>
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</label>
          <select 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#131722] border border-gray-700/50 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-tvGreen"
          >
            <option value="ALL">Any Price</option>
            <option value="UNDER_50">Under $50</option>
            <option value="50_TO_100">$50 - $100</option>
            <option value="100_TO_500">$100 - $500</option>
            <option value="OVER_500">Over $500</option>
          </select>
        </div>

      </div>
    </div>
  )
}
