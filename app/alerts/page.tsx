"use client"

import { PriceAlerts } from "@/components/alerts/PriceAlerts"
import { FadeIn } from "@/components/ui/FadeIn"
import { Bell, Shield } from "lucide-react"

export default function AlertsPage() {
  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center space-x-2 text-[#ff1744]">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sentinel Surveillance Protocol</span>
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-6">
                Price Alerts
                <Bell className="w-8 h-8 text-white/10" />
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl">
                Deploy autonomous sentinels to monitor market thresholds. Get instant protocol execution notifications when your price targets are reached.
             </p>
          </div>
        </div>

        <PriceAlerts />
      </div>
    </FadeIn>
  )
}
