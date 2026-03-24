import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercent(num: number): string {
  const sign = num > 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

export function getMarketStatus(): 'open' | 'closed' | 'pre-market' | 'after-hours' {
  const now = new Date()
  const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  
  const day = estTime.getDay()
  const hours = estTime.getHours()
  const minutes = estTime.getMinutes()
  
  const timeInMinutes = hours * 60 + minutes

  if (day === 0 || day === 6) {
    return 'closed'
  }

  // Pre-market: 4:00 AM - 9:30 AM EST
  const preMarketStart = 4 * 60
  const marketOpen = 9 * 60 + 30
  const marketClose = 16 * 60 // 4:00 PM EST
  const afterHoursEnd = 20 * 60 // 8:00 PM EST

  if (timeInMinutes >= preMarketStart && timeInMinutes < marketOpen) {
    return 'pre-market'
  } else if (timeInMinutes >= marketOpen && timeInMinutes < marketClose) {
    return 'open'
  } else if (timeInMinutes >= marketClose && timeInMinutes < afterHoursEnd) {
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
