"use client"

import { useState } from "react"
import { Bell, Trash2, Zap, Target, AlertTriangle, Eye, Settings, X, ExternalLink } from "lucide-react"
import { useStore } from "@/store/store"
import { useAlertSystem } from "@/hooks/useAlertSystem"
import Link from "next/link"

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { alerts, removeAlert, updateAlert } = useStore()
  
  // Activate polling system
  useAlertSystem()

  const triggeredAlerts = alerts.filter(a => a.triggered)
  const badgeCount = triggeredAlerts.length

  // System educational signals
  const systemSignals = [
    { id: 's1', type: 'system', icon: <Zap className="w-4 h-4 text-tvGreen" />, title: 'Market Sentiment', message: 'Current reading indicates bullish divergence across major indices.', time: 'System Ready' },
    { id: 's2', type: 'system', icon: <Target className="w-4 h-4 text-tvAmber" />, title: 'Signal Update', message: 'Entry parameters for BTC have been mathematically verified.', time: 'System Ready' }
  ]

  const handleDismiss = (id: string) => {
    // If it's a store alert, remove it or update its status. Prompt says [Dismiss] for triggered.
    // I'll remove it to clear the notification.
    removeAlert(id)
  }

  const clearAll = () => {
    triggeredAlerts.forEach(a => removeAlert(a.id))
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-white relative p-2 transition-transform active:scale-95 group"
      >
        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {badgeCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-tvRed text-white text-[10px] font-black rounded-full border-2 border-[#131722] flex items-center justify-center shadow-lg shadow-tvRed/20 animate-pulse">
            {badgeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-3 w-[360px] glass-panel rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-700/50 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl">
            
            <div className="p-4 border-b border-gray-800 bg-[#111827]/80 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <Bell className="w-4 h-4 text-tvGreen" />
                 <h3 className="font-bold text-white text-xs uppercase tracking-widest">Digital Watchtower</h3>
              </div>
              <button 
                onClick={clearAll}
                className="text-[10px] text-gray-400 font-bold uppercase hover:text-white transition-colors"
                disabled={badgeCount === 0}
              >
                Clear Active
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-gray-800/50">
              
              {/* Triggered Store Alerts */}
              {triggeredAlerts.map(alert => (
                <div key={alert.id} className="p-4 bg-tvGreen/5 border-l-4 border-tvGreen group relative transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-tvGreen/20 text-tvGreen">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-white">{alert.symbol} — {alert.type.replace('_', ' ')} ✅</p>
                        <span className="text-[10px] font-mono text-gray-500">{new Date(alert.triggerTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">
                        Triggered at <span className="text-white font-bold">${alert.value}</span>. 
                        Current price: <span className="text-tvGreen font-bold">${alert.currentPrice?.toFixed(2) || alert.value}</span>
                      </p>
                      
                      <div className="flex space-x-3 mt-3">
                         <Link 
                            href={`/stock/${alert.symbol}`} 
                            onClick={() => setOpen(false)}
                            className="text-[10px] font-bold text-tvGreen uppercase flex items-center hover:underline"
                         >
                            <ExternalLink className="w-3 h-3 mr-1" /> View Asset
                         </Link>
                         <button 
                            onClick={() => handleDismiss(alert.id)}
                            className="text-[10px] font-bold text-gray-500 uppercase flex items-center hover:text-white"
                         >
                            <X className="w-3 h-3 mr-1" /> Dismiss
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting Store Alerts (as subtle reminders) */}
              {alerts.filter(a => !a.triggered).slice(0, 2).map(alert => (
                 <div key={alert.id} className="p-4 hover:bg-white/5 transition-colors opacity-70">
                    <div className="flex items-center space-x-3">
                       <Clock className="w-4 h-4 text-gray-600" />
                       <p className="text-xs text-gray-500 italic">Sentinel monitoring {alert.symbol} {alert.type.replace('_', ' ')}...</p>
                    </div>
                 </div>
              ))}

              {/* System Educational Signals */}
              {systemSignals.map(n => (
                <div key={n.id} className="p-4 hover:bg-white/5 cursor-default flex items-start space-x-3 transition-colors">
                  <span className="text-lg bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">{n.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight mb-1">{n.title}</p>
                    <p className="text-xs text-gray-400 leading-snug">{n.message}</p>
                    <p className="text-[10px] font-bold text-gray-600 uppercase mt-2 tracking-widest">{n.time}</p>
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                 <div className="p-12 text-center">
                    <Bell className="w-8 h-8 text-gray-800 mx-auto mb-3" />
                    <p className="text-xs text-gray-600 font-medium">No signals or active sentinels identified.</p>
                 </div>
              )}
            </div>
            
            <div className="p-4 bg-[#111827]/80 border-t border-gray-800 flex justify-center space-x-4">
              <Link 
                href="/dashboard" 
                onClick={() => setOpen(false)}
                className="text-[10px] font-bold text-gray-400 hover:text-tvGreen uppercase transition-all flex items-center"
              >
                <Settings className="w-3 h-3 mr-1" /> Manage Sentinels
              </Link>
              <div className="w-px h-3 bg-gray-800"></div>
              <button 
                onClick={() => setOpen(false)}
                className="text-[10px] font-bold text-gray-400 hover:text-white uppercase transition-all"
              >
                Close Bridge
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )
}

