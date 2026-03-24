"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { Briefcase, Pickaxe, ArrowRight } from "lucide-react"

export function PaperTrading({ symbol, currentPrice }: { symbol: string, currentPrice: number }) {
  const { addToPortfolio } = useStore()
  const [quantity, setQuantity] = useState(10)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleTrade = () => {
    if (quantity <= 0) return
    addToPortfolio({
      id: Math.random().toString(36).substring(7),
      symbol,
      name: symbol, // In a real app we'd pass the full name down
      quantity,
      buyPrice: currentPrice,
      buyDate: Date.now()
    })
    
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
    setQuantity(10)
  }

  const cost = quantity * currentPrice

  return (
    <div className="glass-panel p-5 rounded-2xl border border-tvBlue/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-tvBlue/10 rounded-full blur-2xl" />
      
      <h3 className="font-bold text-white mb-2 flex items-center font-heading">
        <Briefcase className="w-4 h-4 mr-2 text-tvBlue" /> Virtual Trading Sandbox
      </h3>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Test the mathematical boundaries explicitly without leveraging real capital. Position sizes track securely entirely locally.
      </p>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-300">Quantity (Shares)</label>
          <input 
            type="number" 
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 bg-[#111827] border border-gray-700 rounded-lg p-2 text-white text-right font-mono focus:border-tvBlue outline-none"
          />
        </div>

        <div className="flex justify-between items-center text-sm p-3 bg-black/20 rounded-lg border border-gray-800">
          <span className="text-gray-400 font-medium">Estimated Cost</span>
          <span className="font-mono text-white font-bold">${cost.toFixed(2)}</span>
        </div>

        <button 
          onClick={handleTrade}
          disabled={showSuccess}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
            showSuccess 
              ? 'bg-tvGreen text-white border border-tvGreen' 
              : 'bg-tvBlue hover:bg-tvBlue/90 text-white shadow-lg shadow-tvBlue/20 active:scale-95'
          }`}
        >
          {showSuccess ? 'Position Opened! 🎉' : 'Execute Paper Trade'}
          {!showSuccess && <ArrowRight className="w-4 h-4 ml-2" />}
        </button>
      </div>
    </div>
  )
}
