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
  Activity,
  User,
  LogOut,
  Grid3X3,
  Calculator,
  Calendar,
  History,
  Bell,
  Trophy
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMenuStore } from "@/store/useMenuStore"
import { useUserProfile } from "@/hooks/useUserProfile"

const navItems = [
  { name: "Briefing", href: "/briefing", icon: Newspaper, section: 'main' },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: 'main' },
  { name: "Signals", href: "/signals", icon: Zap, section: 'main' },
  { name: "Screener", href: "/screener", icon: Search, section: 'main' },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy, section: 'main' },
  { name: "Watchlist", href: "/watchlist", icon: Star, section: 'personal' },
  { name: "Alerts", href: "/alerts", icon: Bell, section: 'personal' },
  { name: "Portfolio", href: "/portfolio", icon: PieChart, section: 'personal' },
  { name: "Journal", href: "/journal", icon: BookText, section: 'personal' },
  { name: "Trade History", href: "/history", icon: History, section: 'personal' },
  { name: "Heatmap", href: "/heatmap", icon: Grid3X3, section: 'tools' },
  { name: "Calculator", href: "/calculator", icon: Calculator, section: 'tools' },
  { name: "Calendar", href: "/calendar", icon: Calendar, section: 'tools' },
  { name: "Compare", href: "/compare", icon: GitCompareArrows, section: 'tools' },
  { name: "Encyclopedia", href: "/learn", icon: BookOpen, section: 'tools' },
  { name: "Settings", href: "/settings", icon: Settings, section: 'settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed, toggleSidebar } = useMenuStore()
  const { userName } = useUserProfile()

  if (pathname === "/") return null

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col h-full bg-[#060a13]/95 backdrop-blur-xl border-r border-[#ffffff10] transition-all duration-300 relative z-50",
        isSidebarCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* LOGO SECTION */}
      <div className={cn("flex items-center h-16 flex-shrink-0 border-b border-[#ffffff10]", isSidebarCollapsed ? "justify-center" : "px-6")}>
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="text-xl">📈</div>
          {!isSidebarCollapsed && (
            <span className="text-xl font-black tracking-tighter text-gradient bg-gradient-to-r from-[#00e676] to-[#00e5ff]">
              StoxPilot
            </span>
          )}
        </div>
      </div>

      {/* USER GREETING */}
      {!isSidebarCollapsed && (
        <div className="px-6 py-6 border-b border-[#ffffff10]">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white/50" />
            </div>
            <div>
              <p className="text-[10px] text-[#8899a6] font-black uppercase tracking-widest leading-none">OPERATOR: {userName}</p>
              <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ffab00]/10 border border-[#ffab00]/20 w-fit">
                <Zap className="w-2.5 h-2.5 text-[#ffab00] fill-[#ffab00]" />
                <span className="text-[9px] font-black text-[#ffab00] uppercase tracking-widest">GOD MODE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3">
        {renderSection('main', navItems, pathname, isSidebarCollapsed)}
        <div className="my-4 h-px bg-white/5 mx-3" />
        {renderSection('personal', navItems, pathname, isSidebarCollapsed)}
        <div className="my-4 h-px bg-white/5 mx-3" />
        {renderSection('tools', navItems, pathname, isSidebarCollapsed)}
        <div className="my-4 h-px bg-white/5 mx-3" />
        {renderSection('settings', navItems, pathname, isSidebarCollapsed)}
      </nav>

      {/* FOOTER ACTION */}
      <div className="p-3 border-t border-[#ffffff10]">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center h-10 rounded-xl text-[#8899a6] hover:text-white hover:bg-white/5 transition-all"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center space-x-3 px-4 w-full">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Collapse Terminal</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

function renderSection(section: string, items: any[], pathname: string, collapsed: boolean) {
  return items.filter(i => i.section === section).map((item) => {
    const isActive = pathname.startsWith(item.href)
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.name : undefined}
        className={cn(
          "flex items-center transition-all duration-200 rounded-xl h-10 group relative overflow-hidden mb-1",
          isActive 
            ? "bg-[#00e67615] border-l-[3px] border-[#00e676] text-[#00e676]" 
            : "text-[#8899a6] hover:text-white hover:bg-white/5",
          collapsed ? "justify-center" : "px-3 space-x-3"
        )}
      >
        <item.icon className={cn(
          "w-[20px] h-[20px] flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
          isActive ? "text-[#00e676]" : "text-[#5c6b7a] group-hover:text-white"
        )} />
        {!collapsed && (
          <span className={cn(
            "text-[13px] whitespace-nowrap tracking-wide transition-all",
            isActive ? "font-black" : "font-semibold"
          )}>{item.name}</span>
        )}
      </Link>
    )
  })
}
