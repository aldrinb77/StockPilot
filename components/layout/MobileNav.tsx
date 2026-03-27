"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Search, 
  LayoutDashboard,
  Zap,
  Star,
  PieChart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { name: "Terminal", href: "/dashboard", icon: LayoutDashboard },
  { name: "Signals", href: "/signals", icon: Zap },
  { name: "Screener", href: "/screener", icon: Search },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
]

export default function MobileNav() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-[#060a13f2] backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all active:scale-90",
              isActive ? "text-[#00e676]" : "text-[#5c6b7a]"
            )}
          >
            {isActive && (
              <motion.div 
                layoutId="mobile-nav-active"
                className="absolute -top-1 w-12 h-1 bg-[#00e676] rounded-full shadow-[0_0_15px_rgba(0,230,118,0.5)]" 
              />
            )}
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "bg-[#00e67610] text-[#00e676]" : "text-[#5c6b7a]"
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
