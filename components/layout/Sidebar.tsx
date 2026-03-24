"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart2, 
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
  BookText
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMenuStore } from "@/store/useMenuStore"

const navItems = [
  { name: "Daily Briefing", href: "/briefing", icon: Newspaper },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Compare", href: "/compare", icon: GitCompareArrows },
  { name: "Journal", href: "/journal", icon: BookText },
  { name: "Signals", href: "/signals", icon: Zap },
  { name: "Screener", href: "/screener", icon: Search },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed, toggleSidebar } = useMenuStore()

  if (pathname === "/") return null

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col h-full bg-[#131722] border-r border-gray-700/50 transition-all duration-300 relative",
        isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className={cn("flex items-center h-[56px] flex-shrink-0 border-b border-gray-700/50", isSidebarCollapsed ? "justify-center" : "px-4")}>
        <div className="flex items-center space-x-2 text-white">
          <span className="text-xl">📈</span>
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold tracking-tight">StoxPilot</span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center transition-all duration-200 mx-3 rounded-xl h-11 group relative overflow-hidden",
                isActive 
                  ? "nav-active border border-white/5 shadow-lg shadow-black/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5",
                isSidebarCollapsed ? "justify-center" : "px-3 space-x-3"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-white" : "text-gray-500 group-hover:text-white"
              )} />
              {!isSidebarCollapsed && (
                <span className={cn(
                  "text-sm whitespace-nowrap tracking-wide transition-all",
                  isActive ? "font-black" : "font-bold"
                )}>{item.name}</span>
              )}
              {isActive && (
                <motion.div 
                   layoutId="active-pill"
                   className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" 
                   style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>


      <div className="p-3 border-t border-gray-700/50">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center h-10 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center space-x-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
