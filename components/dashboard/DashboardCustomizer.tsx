"use client"

import { useState, useRef } from "react"
import { useStore, DashboardSection } from "@/store/store"
import { GripVertical, Eye, EyeOff, RotateCcw, Save, X, Settings2 } from "lucide-react"

export function DashboardCustomizer({ onClose }: { onClose: () => void }) {
  const { dashboardLayout, setDashboardLayout, resetLayout } = useStore()
  const [localLayout, setLocalLayout] = useState([...dashboardLayout])
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    const _layout = [...localLayout]
    const draggedItemContent = _layout.splice(dragItem.current, 1)[0]
    _layout.splice(dragOverItem.current, 0, draggedItemContent)
    dragItem.current = null
    dragOverItem.current = null
    setLocalLayout(_layout)
  }

  const toggleVisibility = (id: string) => {
    setLocalLayout(localLayout.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ))
  }

  const onSave = () => {
    setDashboardLayout(localLayout)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#111827] border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden shadow-tvGreen/10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#131722]/80">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-tvGreen" />
            <h2 className="text-xl font-bold text-white font-heading">Customize Dashboard</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          <p className="text-sm text-gray-400">Drag to reorder sections. Toggle visibility using the icon.</p>
          
          <div className="space-y-2">
            {localLayout.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-move bg-black/20 ${
                  section.visible ? 'border-gray-700/50' : 'border-gray-800 opacity-60'
                } hover:border-tvGreen/30 group`}
              >
                <div className="flex items-center space-x-4">
                  <GripVertical className="w-5 h-5 text-gray-600 group-hover:text-tvGreen" />
                  <span className={`font-bold ${section.visible ? 'text-white' : 'text-gray-500 line-through'}`}>
                    {section.label}
                  </span>
                </div>
                
                <button 
                  onClick={() => toggleVisibility(section.id)}
                  className={`p-2 rounded-lg transition-all ${
                    section.visible ? 'bg-tvGreen/10 text-tvGreen' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-[#131722]/80 flex flex-wrap gap-3 justify-between">
          <button 
            onClick={() => { resetLayout(); setLocalLayout([...DEFAULT_LAYOUT]); }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Default</span>
          </button>
          
          <div className="flex space-x-3">
             <button 
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onSave}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-tvGreen text-white shadow-lg shadow-tvGreen/20 hover:scale-105 transition-all"
              >
                Save Layout
              </button>
          </div>
        </div>

      </div>
    </div>
  )
}

const DEFAULT_LAYOUT: DashboardSection[] = [
  { id: 'MARKET_OVERVIEW', label: 'Market Overview', visible: true },
  { id: 'WATCHLIST', label: 'Your Watchlist', visible: true },
  { id: 'ALERTS_SENTINEL', label: 'Active Alerts', visible: true },
  { id: 'BULLISH_SIGNALS', label: 'Top Bullish Readings', visible: true },
  { id: 'BEARISH_SIGNALS', label: 'Top Bearish Readings', visible: true },
  { id: 'TOP_MOVERS', label: 'Top Movers', visible: true },
  { id: 'RECENTLY_VIEWED', label: 'Recently Viewed', visible: true },
  { id: 'TOOLS_CALCULATOR', label: 'ROE Calculator', visible: true },
  { id: 'SECTOR_HEATMAP', label: 'Sector Heatmap', visible: true },
  { id: 'MARKET_CALENDAR', label: 'Market Calendar', visible: true },
  { id: 'LEARNING_TIPS', label: 'Learning Tips', visible: true },
  { id: 'PORTFOLIO_SUMMARY', label: 'Your Portfolio Summary', visible: true },
]
