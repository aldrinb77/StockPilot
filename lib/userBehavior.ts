export interface UserProfile {
  searchedSectors: Record<string, number>
  viewedStocks: Record<string, number> // symbol -> count
  avgPriceTarget: number
  buyInterestCount: number
  totalSearches: number
}

// Ensure safe local storage access in Next.js SSR
const isClient = typeof window !== 'undefined'

function parseTrackingData(key: string): any {
  if (!isClient) return {}
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveTrackingData(key: string, data: any) {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function trackStockView(symbol: string, sector: string, price: number) {
  const views = parseTrackingData('sp_track_views')
  views[symbol] = (views[symbol] || 0) + 1
  saveTrackingData('sp_track_views', views)

  const sectors = parseTrackingData('sp_track_sectors')
  sectors[sector] = (sectors[sector] || 0) + 1
  saveTrackingData('sp_track_sectors', sectors)

  trackPricePreference(price)
}

export function trackSignalInteraction(signalType: string) {
  if (signalType.includes('BUY')) {
    const interests = parseTrackingData('sp_track_interests')
    interests.buy = (interests.buy || 0) + 1
    saveTrackingData('sp_track_interests', interests)
  }
}

function trackPricePreference(price: number) {
  const prefs = parseTrackingData('sp_track_prices')
  prefs.data = prefs.data || []
  prefs.data.push(price)
  // Keep last 20
  if (prefs.data.length > 20) prefs.data.shift()
  saveTrackingData('sp_track_prices', prefs)
}

export function getUserProfile(): UserProfile {
  const viewedStocks = parseTrackingData('sp_track_views')
  const searchedSectors = parseTrackingData('sp_track_sectors')
  const interests = parseTrackingData('sp_track_interests')
  const prices = parseTrackingData('sp_track_prices')

  let avgPriceTarget = 0
  if (prices.data && prices.data.length > 0) {
    avgPriceTarget = prices.data.reduce((a: number, b: number) => a + b, 0) / prices.data.length
  }

  return {
    searchedSectors,
    viewedStocks,
    avgPriceTarget,
    buyInterestCount: interests.buy || 0,
    totalSearches: Object.values(viewedStocks).reduce((a: any, b: any) => a + b, 0) as number
  }
}
