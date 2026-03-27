"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Search, 
  BookOpen, 
  Settings, 
  LayoutDashboard,
  Zap,
  Star,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  GitCompareArrows,
  BookText,
  TrendingUp,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMenuStore } from "@/store/useMenuStore"

const navItems = [
  { name: "Daily Briefing", href: "/briefing", icon: Newspaper },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Active Signals", href: "/signals", icon: Zap },
  { name: "Compare Stocks", href: "/compare", icon: GitCompareArrows },
  { name: "Market Screener", href: "/screener", icon: Search },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Portfolio Guard", href: "/portfolio", icon: PieChart },
  { name: "Trading Journal", href: "/journal", icon: BookText },
  { name: "Academy", href: "/learn", icon: BookOpen },
  { name: "System Config", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed, toggleSidebar } = useMenuStore()

  if (pathname === "/") return null

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col h-full bg-[#05080f] border-r border-white/5 transition-all duration-500 relative z-50",
        isSidebarCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className={cn("flex items-center h-20 flex-shrink-0 border-b border-white/5", isSidebarCollapsed ? "justify-center" : "px-8")}>
        <div className="flex items-center space-x-3 text-white group cursor-pointer">
          <div className="w-10 h-10 bg-tvGreen/10 border border-tvGreen/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-tvGreen/5">
             <TrendingUp className="w-6 h-6 text-tvGreen" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
               <span className="text-lg font-black tracking-tighter leading-none">StoxPilot</span>
               <span className="text-[8px] font-black text-tvGreen uppercase tracking-widest mt-1">Private Terminal</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-10 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center transition-all duration-300 rounded-2xl h-12 group relative overflow-hidden",
                isActive 
                  ? "bg-white/5 border border-white/10 shadow-2xl text-white" 
                  : "text-gray-500 hover:text-white hover:bg-white/5",
                isSidebarCollapsed ? "justify-center" : "px-4 space-x-4"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-tvGreen" : "text-gray-600 group-hover:text-white"
              )} />
              {!isSidebarCollapsed && (
                <span className={cn(
                  "text-xs whitespace-nowrap tracking-widest uppercase transition-all",
                  isActive ? "font-black" : "font-black"
                )}>{item.name}</span>
              )}
              {isActive && (
                <motion.div 
                   layoutId="active-pill"
                   className="absolute left-0 top-3 bottom-3 w-1 bg-tvGreen rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={cn("glass-panel mb-4 p-4 rounded-2xl flex items-center space-x-4", isSidebarCollapsed ? "hidden" : "flex")}>
           <div className="w-10 h-10 rounded-xl bg-tvGreen/10 flex items-center justify-center border border-tvGreen/30 animate-pulse">
              <Activity className="w-5 h-5 text-tvGreen" />
           </div>
           <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">System Health</p>
              <p className="text-xs text-tvGreen font-black tracking-tight leading-none">OPTIMAL</p>
           </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <div className="flex items-center space-x-3">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Collapse Terminal</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
