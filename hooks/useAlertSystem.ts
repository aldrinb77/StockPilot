"use client"

import { useEffect } from "react"
import { useStore } from "@/store/store"
import { fetchStockQuote } from "@/lib/api"

export function useAlertSystem() {
  const { alerts, updateAlert, selectedMarket, checkStreak } = useStore()

  // Initial check streaks and login protocol
  useEffect(() => {
    checkStreak()
  }, [])

  useEffect(() => {
    const checkAlerts = async () => {
      // Get unique symbols from active alerts
      const activeAlerts = alerts.filter(a => !a.triggered)
      if (activeAlerts.length === 0) return

      const symbols = Array.from(new Set(activeAlerts.map(a => a.symbol)))
      
      for (const symbol of symbols) {
        try {
          const quote = await fetchStockQuote(symbol)
          const relevantAlerts = activeAlerts.filter(a => a.symbol === symbol)
          
          relevantAlerts.forEach(alert => {
             let triggered = false
             let triggerMsg = ""

             switch (alert.type) {
               case 'PRICE_ABOVE':
                 if (quote.price >= alert.targetValue) {
                   triggered = true
                   triggerMsg = `${symbol} crossed above ${alert.targetValue}`
                 }
                 break
               case 'PRICE_BELOW':
                 if (quote.price <= alert.targetValue) {
                   triggered = true
                   triggerMsg = `${symbol} crossed below ${alert.targetValue}`
                 }
                 break
               case 'PERCENT_UP':
                 if (quote.changePercent >= alert.targetValue) {
                   triggered = true
                   triggerMsg = `${symbol} gain reached +${alert.targetValue}%`
                 }
                 break
               case 'PERCENT_DOWN':
                 if (quote.changePercent <= alert.targetValue) {
                   triggered = true
                   triggerMsg = `${symbol} loss reached ${alert.targetValue}%`
                 }
                 break
             }

             if (triggered) {
                updateAlert(alert.id, { 
                  triggered: true, 
                  triggerTime: Date.now() 
                })

                if (!alert.muteSound) playAlertSound()
                
                 // Browser notification - HARDENED
                 if (typeof window !== 'undefined' && 'Notification' in window) {
                    try {
                      const NotificationClass = (window as any).Notification
                      if (typeof NotificationClass === 'function') {
                        // Check permission state safely
                        if (NotificationClass.permission === 'granted') {
                          new NotificationClass(`StoxPilot: ${symbol} Alert`, {
                            body: triggerMsg,
                            icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔔</text></svg>"
                          })
                        }
                      }
                    } catch (e) {
                      console.warn("Native notification construction failed:", e)
                    }
                 }
             }
          })
        } catch (err) {
          console.error(`Alert poll failed for ${symbol}:`, err)
        }
      }
    }

    const interval = setInterval(checkAlerts, 60000)
    
    // Initial check after a short delay to ensure hydration
    const timeout = setTimeout(checkAlerts, 2000)
    
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [alerts, updateAlert])

  // Request browser permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const NotificationClass = (window as any).Notification
        if (typeof NotificationClass === 'function' && NotificationClass.permission === "default") {
          NotificationClass.requestPermission()
        }
      } catch (e) {
        console.warn("Permission request failed:", e)
      }
    }
  }, [])
}

function playAlertSound() {
  try {
    const AudioContextClass = typeof window !== 'undefined' ? ((window as any).AudioContext || (window as any).webkitAudioContext) : null
    if (!AudioContextClass || typeof AudioContextClass !== 'function') return
    
    // In some mobile browsers, calling the constructor throws if not in a user gesture context
    // or if the implementation is gated behind a flag but not a class
    let ctx;
    try {
      ctx = new AudioContextClass()
    } catch (e) {
      console.warn("AudioContext constructor failed:", e)
      return
    }
    
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
  } catch (err) {
    console.error("Audio protocol failed:", err)
  }
}
