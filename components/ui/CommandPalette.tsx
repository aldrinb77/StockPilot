"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Compass, BookOpen, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!open) return null

  const handleSelect = (route: string) => {
    setOpen(false)
    setSearch('')
    router.push(route)
  }

  const handleStockSelect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    setOpen(false)
    router.push(`/stock/${search.toUpperCase()}`)
    setSearch('')
  }

  const results = [
    { name: 'Go to Dashboard', route: '/dashboard', icon: Compass },
    { name: 'View Matrix Compare', route: '/compare', icon: Search },
    { name: 'Read Daily Briefing', route: '/briefing', icon: BookOpen },
    { name: 'Update System Preferences', route: '/settings', icon: Settings },
  ].filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-[#131722]/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden relative z-10 mx-4"
        >
          <form onSubmit={handleStockSelect} className="flex items-center px-4 py-4 border-b border-gray-800">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search ticker (e.g. AAPL) or type a command..."
              className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-gray-500 font-sans"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono font-bold tracking-widest hidden sm:block">
              ESC
            </div>
          </form>

          <div className="max-h-[300px] overflow-y-auto px-2 py-4">
            {search.length > 0 && search.length <= 5 && !results.some(r => r.name.toLowerCase().includes(search.toLowerCase())) && (
              <button 
                onClick={() => handleSelect(`/stock/${search.toUpperCase()}`)}
                className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-tvBlue/10 hover:text-tvBlue text-gray-300 rounded-xl transition-colors group mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-tvBlue/20 flex items-center justify-center border border-gray-700/50 group-hover:border-tvBlue/30 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                   <p className="font-bold text-white">Search Stock: <span className="text-tvBlue">{search.toUpperCase()}</span></p>
                   <p className="text-xs text-gray-500">Press Enter to analyze algorithmic boundaries natively.</p>
                </div>
              </button>
            )}

            <div className="px-3 pb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              Available Commands
            </div>
            
            <div className="space-y-1">
              {results.map((r, i) => (
                <button 
                  key={i}
                  onClick={() => handleSelect(r.route)}
                  className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-white/5 text-gray-300 rounded-xl transition-colors group"
                >
                  <r.icon className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  <span className="font-medium group-hover:text-white transition-colors">{r.name}</span>
                </button>
              ))}
              {results.length === 0 && search.length > 5 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No matching commands found.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
