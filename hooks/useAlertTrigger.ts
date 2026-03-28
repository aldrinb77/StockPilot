"use client"

import { useEffect, useRef } from "react"
import { useStore } from "@/store/store"
import { fetchStockQuote } from "@/lib/api"
import { useToast } from "@/components/ui/Toast"

export function useAlertTrigger() {
  const { alerts, updateAlert } = useStore()
  const { addToast } = useToast()
  const lastCheck = useRef<Record<string, number>>({})

  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880 // A5 note
      osc.type = 'sine'
      gain.gain.value = 0.3
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.warn("Audio Context failed to initialize")
    }
  }

  useEffect(() => {
    const checkAlerts = async () => {
      const activeAlerts = alerts.filter(a => !a.triggered)
      if (activeAlerts.length === 0) return

      for (const alert of activeAlerts) {
        // Only check every 30 seconds per symbol
        const now = Date.now()
        if (lastCheck.current[alert.symbol] && now - lastCheck.current[alert.symbol] < 30000) continue
        
        try {
          const quote = await fetchStockQuote(alert.symbol)
          lastCheck.current[alert.symbol] = now

          let triggered = false
          if (alert.type === 'PRICE_ABOVE' && quote.price >= alert.targetValue) triggered = true
          if (alert.type === 'PRICE_BELOW' && quote.price <= alert.targetValue) triggered = true
          if (alert.type === 'PERCENT_UP' && quote.changePercent >= alert.targetValue) triggered = true
          if (alert.type === 'PERCENT_DOWN' && quote.changePercent <= -Math.abs(alert.targetValue)) triggered = true

          if (triggered) {
            updateAlert(alert.id, { triggered: true, triggerTime: Date.now() })
            
            // Notification
            if (Notification.permission === "granted") {
              new Notification(`STOX_SENTINEL: ${alert.symbol} TRIGGERED`, {
                body: `${alert.symbol} reached target of ${alert.targetValue}. Current: ${quote.price}`,
                icon: "/icon.png"
              })
            }

            // Sound
            if (!alert.muteSound) {
              playAlertSound()
            }

            addToast(`SENTINEL TRIGGERED: ${alert.symbol}. Target breached.`, 'success')
          }
        } catch (e) {
          console.error("Alert check failed for", alert.symbol)
        }
      }
    }

    const interval = setInterval(checkAlerts, 10000) // Check every 10s
    return () => clearInterval(interval)
  }, [alerts, updateAlert])

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])
}
