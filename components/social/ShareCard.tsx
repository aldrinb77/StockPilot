"use client"

import { useState } from "react"
import { Share2, ArrowUpRight } from "lucide-react"

export function ShareCard({ symbol, signal, price }: any) {
  const [copied, setCopied] = useState(false)

  const isBuy = signal.type.includes('BUY')

  // Generate the plain text copy wrapper format
  const copyText = `🚀 StoxPilot Alert: ${symbol} is a ${signal.type.replace('_', ' ')}!
💰 Entry: ${signal.entry.min}-${signal.entry.max} | 🛡️ Risk Level: ${signal.stopLoss}
Find explicit algorithmic breakdowns without the AI guessing at: https://stoxpilot.vercel.app/stock/${symbol}`

  const handleShare = () => {
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-sm">
      {/* Visual Canvas Element (Simulated via pure CSS for MVP fast rendering) */}
      <div className="relative bg-gradient-to-br from-[#1E222D] to-[#111827] p-6 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full ${isBuy ? 'bg-tvGreen/20' : 'bg-tvRed/20'} -z-10 transition-opacity opacity-50`} />
        
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-black font-heading text-white tracking-tighter">StoxPilot</h1>
          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${isBuy ? 'bg-tvGreen/20 text-tvGreen' : 'bg-tvRed/20 text-tvRed'}`}>
            {signal.type.replace('_', ' ')}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-black text-white">{symbol} <span className="text-xl text-gray-500 font-mono font-medium">${price.toFixed(2)}</span></div>
        </div>

        <div className="space-y-2 mb-6 text-sm font-mono bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="flex justify-between"><span className="text-gray-400">Entry</span><span className="text-white">${signal.entry.min}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Stop Loss</span><span className="text-tvRed">${signal.stopLoss}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Target 1</span><span className="text-tvGreen">${signal.targets[0]}</span></div>
        </div>
      </div>

      <button 
        onClick={handleShare}
        className="mt-4 w-full bg-tvBlue text-white font-bold py-3 rounded-xl hover:bg-tvBlue/90 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-tvBlue/20"
      >
        <Share2 className="w-4 h-4 mr-2" />
        {copied ? 'Copied to Clipboard!' : 'Copy Social Output Format'}
      </button>
    </div>
  )
}
