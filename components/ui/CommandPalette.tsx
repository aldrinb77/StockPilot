"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { 
  Search, 
  LayoutDashboard, 
  Zap, 
  Star, 
  PieChart, 
  Calculator, 
  Calendar, 
  History, 
  Settings,
  Grid3X3,
  Moon,
  TrendingUp,
  Terminal,
  Command,
  HelpCircle,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]

  const toggle = useCallback(() => setIsOpen(open => !open), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
      if (e.key === "Escape") setIsOpen(false)
      if (e.key === "/" && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Global Page Shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'd') { e.preventDefault(); router.push('/dashboard') }
        if (e.key === 's') { e.preventDefault(); router.push('/signals') }
        if (e.key === 'w') { e.preventDefault(); router.push('/watchlist') }
        if (e.key === 'p') { e.preventDefault(); router.push('/portfolio') }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle, router, isOpen])

  const commands = useMemo(() => [
    { name: "Terminal Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation", shortcut: "⌘+D" },
    { name: "Live Signals Engine", href: "/signals", icon: Zap, category: "Intelligence", shortcut: "⌘+S" },
    { name: "Screener Protocol", href: "/screener", icon: Search, category: "Intelligence" },
    { name: "Asset Watchlist", href: "/watchlist", icon: Star, category: "Personal", shortcut: "⌘+W" },
    { name: "Portfolio Vault", href: "/portfolio", icon: PieChart, category: "Personal", shortcut: "⌘+P" },
    { name: "Execution Journal", href: "/history", icon: History, category: "Personal" },
    { name: "Risk Calculator", href: "/calculator", icon: Calculator, category: "Tools" },
    { name: "Event Calendar", href: "/calendar", icon: Calendar, category: "Tools" },
    { name: "Market Heatmap", href: "/heatmap", icon: Grid3X3, category: "Tools" },
    { name: "Engine Settings", href: "/settings", icon: Settings, category: "System", shortcut: "⌘+," },
  ], [])

  const stocks = useMemo(() => marketConfig.popularStocks.map(s => ({
    name: s.name,
    symbol: s.symbol,
    href: `/stock/${s.symbol}`,
    category: "Stocks",
    icon: TrendingUp
  })), [marketConfig])

  const filtered = useMemo(() => {
    const all = [...commands, ...stocks]
    if (!query) return all
    const q = query.toLowerCase()
    return all.filter(i => 
      i.name.toLowerCase().includes(q) || 
      (i.symbol?.toLowerCase().includes(q))
    )
  }, [query, commands, stocks])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const onSelect = useCallback((item: any) => {
    router.push(item.href)
    setIsOpen(false)
    setQuery("")
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(i => (i + 1) % filtered.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(i => (i - 1 + filtered.length) % filtered.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filtered[activeIndex]) onSelect(filtered[activeIndex])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#060a13]/80 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[1000] px-4"
          >
            <div className="bg-[#0b1120] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[60vh]">
               <div className="flex items-center px-10 py-8 border-b border-white/5 bg-white/[0.02]">
                  <Search className="w-6 h-6 text-[#8899a6] mr-6" />
                  <input 
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search terminal commands or assets..."
                    className="flex-1 bg-transparent border-none outline-none text-xl font-black text-white placeholder:text-[#5c6b7a]"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                     <span className="text-[10px] font-black text-[#8899a6]">ESC TO EXIT</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {filtered.length > 0 ? (
                    <div className="space-y-6">
                       {/* Groups by Category */}
                       {["Navigation", "Intelligence", "Personal", "Tools", "Stocks", "System"].map(cat => {
                          const items = filtered.filter(i => i.category === cat)
                          if (items.length === 0) return null
                          return (
                            <div key={cat} className="space-y-2">
                               <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#5c6b7a] mb-2">{cat}</p>
                               {items.map((item) => {
                                  const isSelected = filtered[activeIndex] === item
                                  return (
                                    <button
                                      key={item.href}
                                      onClick={() => onSelect(item)}
                                      onMouseEnter={() => setActiveIndex(filtered.indexOf(item))}
                                      className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border",
                                        isSelected ? "bg-[#2979ff10] border-[#2979ff10] text-white" : "border-transparent text-[#8899a6] hover:bg-white/5 hover:text-white"
                                      )}
                                    >
                                       <div className="flex items-center gap-6">
                                          <div className={cn("p-2.5 rounded-xl border", isSelected ? "bg-[#2979ff] text-white border-transparent" : "bg-white/5 border-white/5")}>
                                             <item.icon className="w-4 h-4" />
                                          </div>
                                          <div className="text-left">
                                             <p className="text-sm font-black uppercase tracking-tighter">{item.name}</p>
                                             {item.symbol && <p className="text-[10px] text-[#5c6b7a] font-bold uppercase tracking-widest">{item.symbol}</p>}
                                          </div>
                                       </div>
                                       {item.shortcut && (
                                          <span className="text-[9px] font-black text-[#5c6b7a] tracking-widest bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">{item.shortcut}</span>
                                       )}
                                    </button>
                                  )
                               })}
                            </div>
                          )
                       })}
                    </div>
                  ) : (
                    <div className="py-20 text-center opacity-30">
                       <Terminal className="w-12 h-12 mx-auto mb-6" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Protocol Search Returned Zero Results</p>
                    </div>
                  )}
               </div>

               <div className="px-10 py-5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">
                        <kbd className="px-2 py-1 bg-white/5 rounded-md border border-white/5">↑↓</kbd> NAVIGATE
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">
                        <kbd className="px-2 py-1 bg-white/5 rounded-md border border-white/5">ENTER</kbd> EXECUTE
                     </div>
                  </div>
                  <HelpCircle className="w-4 h-4 text-[#5c6b7a] hover:text-[#00e676] cursor-pointer" />
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
