"use client"

import { useState, useEffect } from "react"
import { useStore, Alert } from "@/store/store"
import { Bell, Plus, Search, Trash2, Clock, CheckCircle, AlertTriangle, X } from "lucide-react"
import { MOCK_STOCKS } from "@/lib/mockData"
import { formatCurrency } from "@/lib/utils"

export function AlertSetup() {
  const { alerts, addAlert, removeAlert, selectedMarket } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [symbol, setSymbol] = useState("")
  const [type, setType] = useState<Alert['type']>("PRICE_ABOVE")
  const [value, setValue] = useState("")

  const results = symbol ? MOCK_STOCKS.filter(s => s.symbol.toLowerCase().includes(symbol.toLowerCase())).slice(0, 5) : []

  const handleCreate = (selectedSymbol: string) => {
    addAlert({
      symbol: selectedSymbol,
      type,
      value: value ? parseFloat(value) : undefined
    })
    setShowForm(false)
    setSymbol("")
    setValue("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Bell className="w-5 h-5 mr-4 text-tvAmber" /> Price & Signal Alerts
          </h2>
          <p className="text-sm text-gray-400 mt-1">Get notified when stocks match your criteria.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-tvGreen hover:bg-tvGreen/90 text-white p-3 rounded-full shadow-lg shadow-tvGreen/20 transition-all hover:scale-110"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 rounded-2xl border-tvGreen/30 animate-in zoom-in-95 backdrop-blur-xl relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
          
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Create New Alert</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">1. Select Stock</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. AAPL"
                  className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-tvGreen outline-none transition-colors"
                />
                {results.length > 0 && (
                   <div className="absolute top-full left-0 w-full mt-2 bg-[#111827] border border-gray-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                     {results.map(s => (
                        <button key={s.symbol} onClick={() => { setSymbol(s.symbol); }} className="w-full flex items-center justify-between p-3 hover:bg-white/5 text-left">
                           <span className="font-bold text-white">{s.symbol}</span>
                           <span className="text-xs text-gray-500">{s.name}</span>
                        </button>
                     ))}
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">2. Notification Logic</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as Alert['type'])}
                className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-sm text-white focus:border-tvGreen outline-none"
              >
                <option value="PRICE_ABOVE">Price Above</option>
                <option value="PRICE_BELOW">Price Below</option>
                <option value="SIGNAL_BULLISH">Signal Turns Bullish</option>
                <option value="SIGNAL_BEARISH">Signal Turns Bearish</option>
                <option value="RSI_OVERSOLD">RSI Below 30 (Oversold)</option>
                <option value="RSI_OVERBOUGHT">RSI Above 70 (Overbought)</option>
                <option value="VOLUME_SPIKE">Volume Spike {">"} 2x Avg</option>
              </select>
            </div>

            {(type === 'PRICE_ABOVE' || type === 'PRICE_BELOW') && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">3. Target Price</label>
                <input 
                  type="number" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter Price"
                  className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-sm text-white focus:border-tvGreen outline-none"
                />
              </div>
            )}
            
            <div className="md:col-span-2 pt-4">
               <button 
                  onClick={() => handleCreate(symbol)}
                  disabled={!symbol}
                  className="w-full py-4 bg-tvGreen disabled:bg-gray-700 text-white font-bold rounded-xl text-lg hover:scale-[1.01] transition-all shadow-lg shadow-tvGreen/20"
               >
                 Create Digital Sentinel
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map(alert => (
          <div key={alert.id} className={`glass-card p-5 rounded-2xl border-l-[6px] ${alert.triggered ? 'border-tvGreen' : 'border-tvAmber'} animate-in fade-in transition-all relative group`}>
             <button onClick={() => removeAlert(alert.id)} className="absolute top-4 right-4 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-tvRed/10 text-gray-600 hover:text-tvRed transition-all"><Trash2 className="w-4 h-4"/></button>
             
             <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${alert.triggered ? 'bg-tvGreen/10 text-tvGreen' : 'bg-tvAmber/10 text-tvAmber'}`}>
                  {alert.triggered ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                   <h4 className="font-bold text-white text-lg leading-tight">{alert.symbol}</h4>
                   <p className="text-[10px] text-gray-500 uppercase font-bold">Created {new Date(alert.createdAt).toLocaleDateString()}</p>
                </div>
             </div>

             <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <p className="text-sm font-medium text-gray-300">
                  {alert.type === 'PRICE_ABOVE' ? `Price above ${formatCurrency(alert.value!, selectedMarket)}` : 
                   alert.type === 'PRICE_BELOW' ? `Price below ${formatCurrency(alert.value!, selectedMarket)}` :
                   alert.type.replace('_', ' ')}
                </p>
             </div>

             <div className="mt-4 flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${alert.triggered ? 'bg-tvGreen/20 text-tvGreen' : 'bg-gray-800 text-gray-500'}`}>
                  {alert.triggered ? 'Triggered ✓' : 'Monitoring'}
                </span>
                {alert.triggered && <span className="text-xs font-mono text-gray-400">{new Date(alert.triggerTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
