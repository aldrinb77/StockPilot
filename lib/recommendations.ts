import { getUserProfile, UserProfile } from "./userBehavior"
import { StockData, Signal } from "./types"

export interface StockWithSignal extends StockData {
  signal: Signal
}

export function generateRecommendations(allStocks: StockWithSignal[]): { stocks: StockWithSignal[], reason: string } {
  const profile = getUserProfile()

  // Base state: If no history exists, recommend the strongest signals across the board
  if (profile.totalSearches < 2) {
    return {
      stocks: [...allStocks]
        .filter(s => s.signal.type.includes('BUY'))
        .sort((a, b) => b.signal.strength - a.signal.strength)
        .slice(0, 4),
      reason: "Trending Built Specifically For You"
    }
  }

  // 1. Sector Affinity Logic
  let topSector = ''
  let maxSectorCount = 0
  for (const [sector, count] of Object.entries(profile.searchedSectors)) {
    if ((count as number) > maxSectorCount) {
      maxSectorCount = count as number
      topSector = sector
    }
  }

  const affinityStocks = allStocks.filter(s => 
    s.sector === topSector && 
    s.signal.type.includes('BUY') &&
    !(profile.viewedStocks[s.symbol] > 5) // Exclude stocks they've stared at too much to show variance
  )

  if (affinityStocks.length > 0) {
    return {
      stocks: affinityStocks.sort((a, b) => b.signal.strength - a.signal.strength).slice(0, 4),
      reason: `Based on your interest in ${topSector}`
    }
  }

  // 2. Fallback: Price Affinity Math logic 
  const similarPriceStocks = allStocks
    .filter(s => s.signal.type.includes('BUY'))
    .filter(s => Math.abs(s.price - profile.avgPriceTarget) < (profile.avgPriceTarget * 0.3)) // Within 30% bounds of their usual browsing
    
  if (similarPriceStocks.length > 0) {
    return {
      stocks: similarPriceStocks.sort((a,b) => b.signal.strength - a.signal.strength).slice(0, 4),
      reason: `Tracking strong signals matching your typical price range`
    }
  }

  // 3. Absolute Fallback: Highest Strength Buy Arrays uniformly distributed
  return {
    stocks: [...allStocks]
      .filter(s => s.signal.type.includes('BUY'))
      .sort((a, b) => b.signal.strength - a.signal.strength)
      .slice(0, 4),
    reason: "Because you're hunting clear signals explicitly"
  }
}
