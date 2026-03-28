"use client"

import { useState, useRef } from "react"
import { StockData, Signal } from "@/lib/types"
import { MARKETS } from "@/lib/markets"
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  TrendingUp, 
  Zap, 
  Terminal,
  Clock,
  ShieldCheck,
  Target,
  ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function TradeCard({ stock, signal }: { stock: StockData, signal: Signal }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    setIsGenerating(true)
    // Dynamic import to avoid SSR issues and potential install failures
    try {
      // @ts-ignore
      const html2canvas = (await import('html2canvas')).default
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#060a13',
          scale: 2,
          logging: false,
          useCORS: true
        })
        const link = document.createElement('a')
        link.download = `StoxPilot_${stock.symbol}_Trade.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    } catch (err) {
      console.error("Image generation failed. Protocol error.", err)
      alert("Image generation failed. Please use manual screenshot for protocol sharing.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    const text = `StoxPilot Trade Alert 📈: ${stock.symbol}
Type: ${signal.type}
Price: ${stock.price.toFixed(2)}
Target: ${signal.targets.join(' / ')}
Stop Loss: ${signal.stopLoss}
Confidence: ${signal.strength}%`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* The Visual Card */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-sm mx-auto aspect-[4/5] bg-[#060a13] border-2 border-white/10 rounded-[2.5rem] p-10 overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e676] blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2979ff] blur-[80px] opacity-[0.05] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e676] to-[#00e5ff] flex items-center justify-center text-xl">📈</div>
              <div className="space-y-0.5">
                 <h2 className="text-lg font-black text-white tracking-tighter leading-none">StoxPilot</h2>
                 <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Intelligence Protocol</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest leading-none">Session Date</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">{new Date().toLocaleDateString()}</p>
           </div>
        </div>

        {/* Signal Body */}
        <div className="flex-1 flex flex-col justify-center space-y-12">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00e676]/10 border border-[#00e676]/20 rounded-lg">
                 <Zap className="w-3 h-3 text-[#00e676] fill-[#00e676]" />
                 <span className="text-[10px] font-black text-[#00e676] uppercase tracking-widest">{signal.type.replace('_', ' ')}</span>
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter break-all">{stock.symbol}</h3>
              <p className="text-2xl font-black text-white/60 tracking-tighter">Current: {stock.price.toFixed(2)}</p>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Execution Zone</p>
                    <p className="text-lg font-black text-white tracking-tighter">{signal.entry.min.toFixed(1)} - {signal.entry.max.toFixed(1)}</p>
                 </div>
                 <ArrowRight className="w-4 h-4 text-[#5c6b7a] mb-2" />
                 <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-[#00e676] uppercase tracking-widest">Target Objective</p>
                    <p className="text-lg font-black text-[#00e676] tracking-tighter">{signal.targets[0]}</p>
                 </div>
              </div>

              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#ff1744] uppercase tracking-widest">Invalidation Node</p>
                    <p className="text-lg font-black text-[#ff1744] tracking-tighter">{signal.stopLoss}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Alpha Confidence</p>
                    <p className="text-lg font-black text-white tracking-tighter">{signal.strength}%</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
           <div className="flex items-center gap-4 text-[#8899a6]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Verified Institutional Data</span>
           </div>
           <p className="text-[9px] font-black text-[#5c6b7a] uppercase tracking-widest">StoxPilot Engine V2.4</p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-4">
         <button 
           onClick={handleDownload}
           disabled={isGenerating}
           className="flex-1 px-8 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00e676] hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
         >
           {isGenerating ? <Terminal className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
           {isGenerating ? 'Synthesizing Image...' : 'Export Asset Card'}
         </button>
         <button 
           onClick={handleCopy}
           className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all"
           title="Copy Text Logic"
         >
           {copied ? <Check className="w-5 h-5 text-[#00e676]" /> : <Copy className="w-5 h-5" />}
         </button>
      </div>
    </div>
  )
}
