import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { MarketRegion, MARKETS } from "./markets"

export function formatCurrency(value: number, market: MarketRegion = 'US'): string {
  const config = MARKETS[market]
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: config.currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: config.currency === 'JPY' ? 0 : 2,
  }).format(value)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercent(num: number): string {
  const sign = num > 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

export function getMarketStatus(market: MarketRegion = 'US'): 'open' | 'closed' | 'pre-market' | 'after-hours' {
  const config = MARKETS[market]
  const now = new Date()
  
  // Get time in market's timezone
  const marketTimeStr = now.toLocaleString("en-US", { timeZone: config.marketHours.timezone })
  const marketTime = new Date(marketTimeStr)
  
  const day = marketTime.getDay() // 0 (Sun) to 6 (Sat)
  const hours = marketTime.getHours()
  const minutes = marketTime.getMinutes()
  const timeInMinutes = hours * 60 + minutes

  // Markets typically closed on weekends
  if (day === 0 || day === 6) {
    return 'closed'
  }

  const [openH, openM] = config.marketHours.open.split(':').map(Number)
  const [closeH, closeM] = config.marketHours.close.split(':').map(Number)
  
  const marketOpen = openH * 60 + openM
  const marketClose = closeH * 60 + closeM
  
  // Simple check for open/closed based on provided hours
  // This can be expanded for pre/after hours if desired, but for now we follow the core hours
  if (timeInMinutes >= marketOpen && timeInMinutes < marketClose) {
    return 'open'
  }

  // Pre-market (roughly 1-2 hours before)
  if (timeInMinutes >= marketOpen - 120 && timeInMinutes < marketOpen) {
    return 'pre-market'
  }

  // After-hours (roughly 2 hours after)
  if (timeInMinutes >= marketClose && timeInMinutes < marketClose + 120) {
    return 'after-hours'
  }

  return 'closed'
}

export function timeAgo(date: number | Date): string {
  const now = new Date().getTime()
  const time = new Date(date).getTime()
  const seconds = Math.floor((now - time) / 1000)

  if (seconds < 60) return `${Math.max(1, seconds)} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

export function toTradingViewSymbol(symbol: string, market: string): string {
  if (market === 'IN') return 'NSE:' + symbol.replace('.NS', '');
  if (market === 'UK') return 'LSE:' + symbol.replace('.L', '');
  if (market === 'JP') return 'TSE:' + symbol.replace('.T', '');
  if (market === 'AU') return 'ASX:' + symbol.replace('.AX', '');
  if (market === 'CA') return 'TSX:' + symbol.replace('.TO', '');
  if (market === 'HK') return 'HKEX:' + symbol.replace('.HK', '');
  if (market === 'EU') {
    if (symbol.endsWith('.DE')) return 'XETR:' + symbol.replace('.DE', '');
    if (symbol.endsWith('.PA')) return 'EURONEXT:' + symbol.replace('.PA', '');
    if (symbol.endsWith('.AS')) return 'EURONEXT:' + symbol.replace('.AS', '');
  }
  return symbol;
}
