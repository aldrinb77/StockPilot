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
