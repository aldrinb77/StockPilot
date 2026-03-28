"use client"

import { useState } from "react"
import { useStore, Alert } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { 
  Bell, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Clock, 
  ChevronUp, 
  ChevronDown,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function PriceAlerts() {
  const { alerts, addAlert, removeAlert, updateAlert, selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [showForm, setShowForm] = useState(false)
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    symbol: "",
    type: "PRICE_ABOVE",
    targetValue: 0,
    muteSound: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAlert.symbol || !newAlert.targetValue) return
    addAlert(newAlert as any)
    setShowForm(false)
    setNewAlert({ symbol: "", type: "PRICE_ABOVE", targetValue: 0, muteSound: false })
  }

  const activeAlerts = alerts.filter(a => !a.triggered)
  const history = alerts.filter(a => a.triggered).slice(0, 5)

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#00e676]">
               <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Watch Sentinels</h3>
         </div>
         <button 
           onClick={() => setShowForm(!showForm)}
           className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00e676] hover:text-white transition-all flex items-center gap-2"
         >
           {showForm ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
           {showForm ? "Cancel Protocol" : "Initialize Sentinel"}
         </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[3rem] border border-[#00e676]/20 bg-[#00e676]/[0.02] space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Asset</label>
                     <input 
                       required
                       type="text" value={newAlert.symbol}
                       onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value.toUpperCase()})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-xl focus:border-[#00e676] outline-none placeholder:text-white/10"
                       placeholder="RELIANCE.NS"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sentinel Type</label>
                     <select 
                       value={newAlert.type}
                       onChange={(e) => setNewAlert({...newAlert, type: e.target.value as any})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#00e676] outline-none appearance-none"
                     >
                        <option value="PRICE_ABOVE">Price ≥ Target</option>
                        <option value="PRICE_BELOW">Price ≤ Target</option>
                        <option value="PERCENT_UP">Gain ≥ +%</option>
                        <option value="PERCENT_DOWN">Loss ≤ -%</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Numeric Threshold</label>
                     <input 
                       required
                       type="number" step="0.01" value={newAlert.targetValue || ""}
                       onChange={(e) => setNewAlert({...newAlert, targetValue: Number(e.target.value)})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-xl focus:border-[#00e676] outline-none placeholder:text-white/10"
                     />
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <button
                        type="button"
                        onClick={() => setNewAlert({...newAlert, muteSound: !newAlert.muteSound})}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${newAlert.muteSound ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-[#00e67610] border-[#00e67620] text-[#00e676]'}`}
                     >
                        {newAlert.muteSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Audio Execution: {newAlert.muteSound ? 'SILENT' : 'ACTIVE'}</span>
                     </button>
                  </div>
                  <button type="submit" className="px-10 py-4 bg-[#00e676] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00c853] transition-all">
                    Arm Sentinel
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAlerts.map((alert) => (
          <div key={alert.id} className="glass-card p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#00e676] blur-[60px] opacity-[0.05] pointer-events-none" />
             <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                   <h4 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
                     {alert.symbol}
                     <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${alert.type.includes('ABOVE') || alert.type.includes('UP') ? 'bg-[#00e67610] text-[#00e676]' : 'bg-[#ff174410] text-[#ff1744]'}`}>
                        {alert.type.includes('ABOVE') ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />}
                        {alert.type.split('_')[1]}
                     </span>
                   </h4>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Target: {alert.targetValue.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => removeAlert(alert.id)}
                     className="p-3 bg-white/5 hover:bg-[#ff174410] hover:text-[#ff1744] border border-white/5 rounded-xl transition-all"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-2">
                   <Clock className="w-3.5 h-3.5 text-[#8899a6]" />
                   <span>Watching Since {new Date(alert.createdAt).getHours()}:{new Date(alert.createdAt).getMinutes()}</span>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[#00e676] animate-pulse">Monitoring 📡</span>
             </div>
          </div>
        ))}
        {activeAlerts.length === 0 && !showForm && (
          <div className="md:col-span-full py-20 text-center opacity-30">
             <Activity className="w-12 h-12 mx-auto mb-6" />
             <p className="text-[10px] font-black uppercase tracking-widest">No Sentinels Currently Dispatched</p>
          </div>
        )}
      </div>

      {history.length > 0 && (
         <div className="space-y-6">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recent Trigger Protocol Logs</h4>
            <div className="space-y-3">
               {history.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between px-8 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <CheckCircle className="w-4 h-4 text-[#00e676]" />
                        <span className="text-xs font-black text-white">{alert.symbol} Sentinel Triggered: {alert.type} @ {alert.targetValue}</span>
                     </div>
                     <span className="text-[10px] font-black text-[#8899a6]">{new Date(alert.triggerTime!).toLocaleString()}</span>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  )
}
