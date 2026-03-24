"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  
  // Hardcoded for MVP Demonstration of the Push System Architecture
  const notifications = [
    { id: 1, type: 'signal', icon: '🟢', message: 'AAPL just turned to STRONG BUY! Entry bounds verified.', time: '2m ago' },
    { id: 2, type: 'alert', icon: '🎯', message: 'NVDA hit Target 1 ($920). Consider allocating gains.', time: '1h ago' },
    { id: 3, type: 'warning', icon: '⚠️', message: 'TSLA dropped near Stop Loss bounds.', time: '3h ago' }
  ]

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-white relative p-2 transition-transform active:scale-95"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-tvRed rounded-full border border-[#131722] animate-pulse"></span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-700/50 animate-in fade-in slide-in-from-top-4">
            <div className="p-4 border-b border-gray-800 bg-[#111827]/80 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Notifications</h3>
              <button className="text-xs text-tvBlue font-medium hover:text-white">Mark Read</button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className="p-4 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer flex items-start space-x-3 transition-colors">
                  <span className="text-lg bg-gray-800 p-1.5 rounded-lg border border-gray-700/50">{n.icon}</span>
                  <div>
                    <p className="text-sm text-gray-300 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-[#111827]/80 text-center">
              <button className="text-xs text-gray-400 hover:text-white font-medium">View Settings</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
