"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { StockData } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { Wallet, TrendingUp, ArrowRight, Zap, Target, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function PaperTradeCard({ stock }: { stock: StockData }) {
  const { paperBalance, buyStock, portfolio, sellStock, selectedMarket } = useStore()
  const [quantity, setQuantity] = useState<number>(1)
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY')
  const [success, setSuccess] = useState(false)

  const existingPosition = portfolio.find(p => p.symbol === stock.symbol)
  const canSell = !!existingPosition
  
  const handleExecute = () => {
    if (mode === 'BUY') {
      const cost = stock.price * quantity
      if (paperBalance >= cost) {
        buyStock(stock.symbol, stock.name || stock.symbol, stock.price, quantity)
        triggerSuccess()
      } else {
        alert("Insufficient capital in Virtual Vault.")
      }
    } else if (canSell) {
      sellStock(existingPosition.id, stock.price)
      triggerSuccess()
    }
  }

  const triggerSuccess = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const totalCost = stock.price * quantity

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/40">
      <div className="absolute top-0 right-0 w-32 h-32 bg-tvBlue blur-[60px] opacity-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-tvBlue/10 text-tvBlue rounded-2xl border border-tvBlue/20 shadow-xl shadow-tvBlue/5">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Virtual Vault</h3>
            <p className="text-[10px] text-tvBlue font-black font-mono tracking-wider">{formatCurrency(paperBalance, selectedMarket)}</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
           <button 
             onClick={() => setMode('BUY')}
             className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'BUY' ? 'bg-tvGreen text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
           >
             Buy
           </button>
           <button 
             onClick={() => setMode('SELL')}
             disabled={!canSell}
             className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'SELL' ? 'bg-tvRed text-white shadow-lg' : 'text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white'}`}
           >
             Sell
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="py-10 flex flex-col items-center justify-center text-center space-y-4"
          >
             <div className="w-16 h-16 bg-tvGreen/20 text-tvGreen rounded-full flex items-center justify-center border-2 border-tvGreen/30 shadow-2xl shadow-tvGreen/20 animate-pulse">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <p className="text-white font-black uppercase tracking-[0.3em] text-sm">Execution Successful</p>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Protocol updated. Verify within Virtual Vault.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {mode === 'BUY' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Ask Price</p>
                      <p className="text-sm font-black text-white font-mono">{formatCurrency(stock.price, selectedMarket)}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Max Shares</p>
                      <p className="text-sm font-black text-white font-mono">{Math.floor(paperBalance / stock.price)}</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quantity</label>
                      <span className="text-[9px] font-black text-tvGreen uppercase tracking-widest">Available liquidity: Normal</span>
                   </div>
                   <div className="relative">
                      <input 
                        type="number" 
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-black text-lg focus:outline-none focus:border-tvGreen focus:ring-4 focus:ring-tvGreen/5 transition-all font-mono"
                      />
                      <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                   </div>
                   <div className="flex flex-wrap gap-2 pt-1 px-1">
                      {[10, 50, 100].map(v => (
                         <button key={v} onClick={() => setQuantity(v)} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                            {v} Shares
                         </button>
                      ))}
                      <button onClick={() => setQuantity(Math.floor(paperBalance / stock.price))} className="px-3 py-1 bg-tvBlue/10 hover:bg-tvBlue/20 border border-tvBlue/20 rounded-lg text-[8px] font-black text-tvBlue transition-all uppercase tracking-widest">
                        Max Account
                      </button>
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                   <div className="flex justify-between items-center mb-6">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Estimated Cost</p>
                      <p className="text-xl font-black text-white font-mono tracking-tighter">{formatCurrency(totalCost, selectedMarket)}</p>
                   </div>
                   <button 
                     onClick={handleExecute}
                     className="w-full py-5 bg-tvGreen text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-2xl shadow-tvGreen/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                   >
                     Deploy Capital <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-6">
                <div className="bg-tvRed/5 p-6 rounded-[2rem] border border-tvRed/10 space-y-4">
                   <div className="flex items-center gap-3 text-tvRed">
                      <Target className="w-5 h-5" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Liquidate Position</h4>
                   </div>
                   <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                      Currently holding <span className="text-white">{existingPosition?.quantity}</span> shares at average <span className="text-white">{formatCurrency(existingPosition!.buyPrice, selectedMarket)}</span>.
                   </p>
                   <div className="pt-4 border-t border-tvRed/10">
                      <div className="flex justify-between items-center">
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Exit Proceeds</p>
                         <p className="text-lg font-black text-tvRed font-mono">{formatCurrency(existingPosition!.quantity * stock.price, selectedMarket)}</p>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={handleExecute}
                  className="w-full py-5 bg-tvRed text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-2xl shadow-tvRed/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Confirm Liquidation
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-start gap-3 px-2">
         <div className="p-1 rounded-lg bg-gray-500/10 text-gray-400 mt-0.5">
            <Zap className="w-3 h-3" />
         </div>
         <p className="text-[9px] text-[#5c6b7a] font-bold uppercase leading-relaxed tracking-widest">
            Slippage simulated at ~0.05% for {stock.symbol} relative to average order depth in {selectedMarket} zone.
         </p>
      </div>
    </div>
  )
}
