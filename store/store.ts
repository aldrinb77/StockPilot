import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WatchlistItem, PortfolioItem } from '@/lib/types'
import { MarketRegion } from '@/lib/markets'

export interface Alert {
  id: string
  symbol: string
  type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'SIGNAL_BULLISH' | 'SIGNAL_BEARISH' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT' | 'VOLUME_SPIKE'
  value?: number
  triggered: boolean
  createdAt: number
  triggerTime?: number
  currentPrice?: number
}

export interface JournalEntry {
  id: string
  date: string
  symbol?: string
  type: 'Bought' | 'Sold' | 'Watching' | 'Learning'
  notes: string
  mood: 'HAPPY' | 'NEUTRAL' | 'SAD'
  lesson?: string
}

export interface DashboardSection {
  id: string
  label: string
  visible: boolean
}

export interface AppearanceSettings {
  accentColor: string
  cardStyle: 'glass' | 'solid' | 'bordered'
  fontSize: 'small' | 'medium' | 'large'
}

interface AppState {
  isMenuOpen: boolean
  toggle: () => void
  close: () => void
  
  watchlist: WatchlistItem[]
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (symbol: string) => void
  
  portfolio: PortfolioItem[]
  addToPortfolio: (item: PortfolioItem) => void
  removeFromPortfolio: (id: string) => void

  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (val: boolean) => void
  experienceLevel: 'beginner' | 'intermediate' | 'experienced'
  setExperienceLevel: (level: 'beginner' | 'intermediate' | 'experienced') => void
  
  notificationsEnabled: boolean
  setNotificationsEnabled: (val: boolean) => void

  selectedMarket: MarketRegion
  setSelectedMarket: (market: MarketRegion) => void

  // Advanced Features
  viewHistory: { symbol: string, name: string, timestamp: number }[]
  addToHistory: (symbol: string, name: string) => void
  
  dashboardLayout: DashboardSection[]
  setDashboardLayout: (layout: DashboardSection[]) => void
  resetLayout: () => void
  
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id' | 'triggered' | 'createdAt'>) => void
  removeAlert: (id: string) => void
  updateAlert: (id: string, updates: Partial<Alert>) => void
  
  journalEntries: JournalEntry[]
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void
  removeJournalEntry: (id: string) => void
  
  appearance: AppearanceSettings
  setAppearance: (settings: Partial<AppearanceSettings>) => void
  
  browsedSectors: Record<string, number>
  trackSector: (sector: string) => void
}

const DEFAULT_LAYOUT: DashboardSection[] = [
  { id: 'MARKET_OVERVIEW', label: 'Market Overview', visible: true },
  { id: 'WATCHLIST', label: 'Your Watchlist', visible: true },
  { id: 'ALERTS_SENTINEL', label: 'Active Alerts', visible: true },
  { id: 'BULLISH_SIGNALS', label: 'Top Bullish Readings', visible: true },
  { id: 'BEARISH_SIGNALS', label: 'Top Bearish Readings', visible: true },
  { id: 'TOP_MOVERS', label: 'Top Movers', visible: true },
  { id: 'RECENTLY_VIEWED', label: 'Recently Viewed', visible: true },
  { id: 'TOOLS_CALCULATOR', label: 'ROE Calculator', visible: true },
  { id: 'SECTOR_HEATMAP', label: 'Sector Heatmap', visible: true },
  { id: 'MARKET_CALENDAR', label: 'Market Calendar', visible: true },
  { id: 'LEARNING_TIPS', label: 'Learning Tips', visible: true },
  { id: 'PORTFOLIO_SUMMARY', label: 'Your Portfolio Summary', visible: true },
]

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isMenuOpen: false,
      toggle: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      close: () => set({ isMenuOpen: false }),

      watchlist: [],
      addToWatchlist: (item) => set((state) => {
        if (!state.watchlist.some(w => w.symbol === item.symbol)) {
          return { watchlist: [...state.watchlist, item] }
        }
        return state;
      }),
      removeFromWatchlist: (symbol) => set((state) => ({
        watchlist: state.watchlist.filter((w) => w.symbol !== symbol)
      })),

      portfolio: [],
      addToPortfolio: (item) => set((state) => ({
        portfolio: [...state.portfolio, item]
      })),
      removeFromPortfolio: (id) => set((state) => ({
        portfolio: state.portfolio.filter((p) => p.id !== id)
      })),

      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      experienceLevel: 'beginner',
      setExperienceLevel: (level) => set({ experienceLevel: level }),

      notificationsEnabled: false,
      setNotificationsEnabled: (val) => set({ notificationsEnabled: val }),

      selectedMarket: 'US',
      setSelectedMarket: (market) => set({ selectedMarket: market }),

      // Advanced Persisten Records
      viewHistory: [],
      addToHistory: (symbol, name) => set((state) => {
        const filtered = state.viewHistory.filter(h => h.symbol !== symbol)
        return {
          viewHistory: [{ symbol, name, timestamp: Date.now() }, ...filtered].slice(0, 10)
        }
      }),

      dashboardLayout: DEFAULT_LAYOUT,
      setDashboardLayout: (layout) => set({ dashboardLayout: layout }),
      resetLayout: () => set({ dashboardLayout: DEFAULT_LAYOUT }),

      alerts: [],
      addAlert: (alert) => set((state) => ({
        alerts: [{ 
          ...alert, 
          id: Math.random().toString(36).substr(2, 9), 
          triggered: false, 
          createdAt: Date.now() 
        }, ...state.alerts]
      })),
      removeAlert: (id) => set((state) => ({
        alerts: state.alerts.filter(a => a.id !== id)
      })),
      updateAlert: (id, updates) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      journalEntries: [],
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [{ ...entry, id: Math.random().toString(36).substr(2, 9) }, ...state.journalEntries]
      })),
      removeJournalEntry: (id) => set((state) => ({
        journalEntries: state.journalEntries.filter(e => e.id !== id)
      })),

      appearance: {
        accentColor: '#10B981', // Emerald default
        cardStyle: 'glass',
        fontSize: 'medium'
      },
      setAppearance: (settings) => set((state) => ({
        appearance: { ...state.appearance, ...settings }
      })),

      browsedSectors: {},
      trackSector: (sector) => set((state) => ({
        browsedSectors: {
          ...state.browsedSectors,
          [sector]: (state.browsedSectors[sector] || 0) + 1
        }
      }))
    }),
    {
      name: 'stoxpilot-store-v2',
      partialize: (state) => ({ 
        watchlist: state.watchlist, 
        portfolio: state.portfolio,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        experienceLevel: state.experienceLevel,
        notificationsEnabled: state.notificationsEnabled,
        selectedMarket: state.selectedMarket,
        viewHistory: state.viewHistory,
        dashboardLayout: state.dashboardLayout,
        alerts: state.alerts,
        journalEntries: state.journalEntries,
        appearance: state.appearance,
        browsedSectors: state.browsedSectors
      })
    }
  )
)
