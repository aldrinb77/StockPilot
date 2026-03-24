"use client"

import { useEffect } from "react"
import { useStore, Alert } from "@/store/store"
import { MOCK_STOCKS, MOCK_SIGNALS } from "@/lib/mockData"

export function useAlertSystem() {
  const { alerts, updateAlert, notificationsEnabled } = useStore()

  useEffect(() => {
    const checkAlerts = () => {
      alerts.forEach(alert => {
        if (alert.triggered) return

        const stock = MOCK_STOCKS.find(s => s.symbol === alert.symbol)
        if (!stock) return

        let triggered = false
        let triggerMsg = ""

        switch (alert.type) {
          case 'PRICE_ABOVE':
            if (stock.price >= (alert.value || 0)) {
               triggered = true
               triggerMsg = `${alert.symbol} crossed above ${alert.value}`
            }
            break
          case 'PRICE_BELOW':
            if (stock.price <= (alert.value || 0)) {
               triggered = true
               triggerMsg = `${alert.symbol} crossed below ${alert.value}`
            }
            break
          case 'SIGNAL_BULLISH':
            if (MOCK_SIGNALS[alert.symbol]?.type.includes('BUY')) {
               triggered = true
               triggerMsg = `${alert.symbol} signal is now Bullish`
            }
            break
          case 'SIGNAL_BEARISH':
            if (MOCK_SIGNALS[alert.symbol]?.type.includes('SELL')) {
               triggered = true
               triggerMsg = `${alert.symbol} signal is now Bearish`
            }
            break
          // Add other logics as needed
        }

        if (triggered) {
          updateAlert(alert.id, { 
            triggered: true, 
            triggerTime: Date.now(),
            currentPrice: stock.price 
          })

          if (notificationsEnabled) {
            // Native browser notification
            if (Notification.permission === "granted") {
               new Notification(`StoxPilot Alert: ${alert.symbol}`, {
                 body: triggerMsg,
                 icon: "/favicon.ico"
               })
            }
          }
        }
      })
    }

    const interval = setInterval(checkAlerts, 60000)
    checkAlerts() // Initial check

    return () => clearInterval(interval)
  }, [alerts, updateAlert, notificationsEnabled])

  useEffect(() => {
    if (notificationsEnabled && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [notificationsEnabled])
}
