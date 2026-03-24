"use client"

import { useStore } from "@/store/store"

export const trackView = (symbol: string, name: string) => {
  const store = useStore.getState()
  store.addToHistory(symbol, name)
}

export const trackSectorView = (sector: string) => {
  const store = useStore.getState()
  store.trackSector(sector)
}

export const getTopSectors = () => {
  const store = useStore.getState()
  const sectors = store.browsedSectors
  return Object.entries(sectors)
    .sort(([, a], [, b]) => b - a)
    .map(([sector]) => sector)
    .slice(0, 3)
}

export interface UserProfile {
  totalSearches: number;
  searchedSectors: Record<string, number>;
  viewedStocks: Record<string, number>;
  avgPriceTarget: number;
}

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return {
      totalSearches: 0,
      searchedSectors: {},
      viewedStocks: {},
      avgPriceTarget: 100
    };
  }
  
  const searchHistory = JSON.parse(localStorage.getItem('stoxpilot_searches') || '[]');
  const viewHistory = JSON.parse(localStorage.getItem('stoxpilot_views') || '[]');
  
  return {
    totalSearches: searchHistory.length,
    searchedSectors: {},
    viewedStocks: {},
    avgPriceTarget: 100,
  };
}
