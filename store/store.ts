import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WatchlistItem, PortfolioItem } from '@/lib/types'
import { MarketRegion } from '@/lib/markets'

export interface Alert {
  id: string
  symbol: string
  type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'PERCENT_UP' | 'PERCENT_DOWN' | 'SIGNAL_BULLISH' | 'SIGNAL_BEARISH' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT' | 'VOLUME_SPIKE'
  targetValue: number
  triggered: boolean
  createdAt: number
  triggerTime?: number
  muteSound?: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockedAt?: number
  icon: string
}

export interface WatchlistGroup {
  id: string
  name: string
  symbols: string[]
}

export interface JournalEntry {
  id: string
  date: string
  symbol: string
  type: 'Bought' | 'Sold' | 'Watching' | 'Learning'
  notes: string
  mood: 'HAPPY' | 'NEUTRAL' | 'SAD'
  lesson?: string
}

export interface AppState {
  // Watchlist & Portfolio
  watchlist: WatchlistItem[]
  watchlistGroups: WatchlistGroup[]
  setWatchlistGroups: (groups: WatchlistGroup[]) => void
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (symbol: string) => void
  
  portfolio: PortfolioItem[]
  addToPortfolio: (item: PortfolioItem) => void
  removeFromPortfolio: (id: string) => void
  
  // Paper Trading
  paperBalance: number
  buyStock: (symbol: string, name: string, price: number, quantity: number) => void
  sellStock: (id: string, price: number) => void
  resetPaperAccount: () => void
  
  // Journal
  journalEntries: JournalEntry[]
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void
  removeJournalEntry: (id: string) => void
  
  // Trade History
  tradeHistory: PortfolioItem[]
  addToHistoryExecuted: (item: PortfolioItem) => void
  removeFromHistory: (id: string) => void

  // User State
  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (val: boolean) => void
  
  selectedMarket: MarketRegion
  setSelectedMarket: (market: MarketRegion) => void

  // Alerts
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id' | 'triggered' | 'createdAt'>) => void
  removeAlert: (id: string) => void
  updateAlert: (id: string, updates: Partial<Alert>) => void
  
  // Stats & Achievements
  streak: number
  lastLoginDate: string
  analysisCount: number
  tradesLoggedCount: number
  achievements: Achievement[]
  incrementAnalysis: () => void
  incrementTradesLogged: () => void
  unlockAchievement: (id: string) => void
  checkStreak: () => void

  // Layout & Settings
  dashboardLayout: { id: string, label: string, visible: boolean }[]
  setDashboardLayout: (layout: { id: string, label: string, visible: boolean }[]) => void
  
  appearance: {
    accentColor: string
    cardStyle: 'glass' | 'solid'
  }
  
  // Behavioral Tracking
  browsedSectors: Record<string, number>
  trackSector: (sector: string) => void
  viewHistory: { symbol: string, name: string, timestamp: number }[]
  addToHistory: (symbol: string, name: string) => void
  resetLayout: () => void
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'FIRST_TRADE', name: 'First Trade', description: 'Logged your first execution protocol.', unlocked: false, icon: '🏆' },
  { id: 'SIGNAL_HUNTER', name: 'Signal Hunter', description: 'Analyzed 50 stock signals.', unlocked: false, icon: '📊' },
  { id: 'WATCHFUL_EYE', name: 'Watchful Eye', description: 'Added 10 assets to your watchlist.', unlocked: false, icon: '⭐' },
  { id: 'ON_FIRE', name: 'On Fire', description: 'Maintained a 30-day login streak.', unlocked: false, icon: '🔥' },
  { id: 'SHARPSHOOTER', name: 'Sharpshooter', description: 'Achieved 80%+ accuracy over 20 trades.', unlocked: false, icon: '🎯' },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      watchlistGroups: [{ id: 'default', name: 'Primary Watchlist', symbols: [] }],
      setWatchlistGroups: (watchlistGroups) => set({ watchlistGroups }),
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
      addToPortfolio: (item) => set((state) => ({ portfolio: [...state.portfolio, item] })),
      removeFromPortfolio: (id) => set((state) => ({ portfolio: state.portfolio.filter((p) => p.id !== id) })),

      paperBalance: 100000,
      buyStock: (symbol, name, price, quantity) => set((state) => {
        const cost = price * quantity
        if (state.paperBalance < cost) return state // Not enough funds
        
        const newItem: PortfolioItem = {
          id: Math.random().toString(36).slice(2, 11),
          symbol,
          name,
          quantity,
          buyPrice: price,
          buyDate: Date.now()
        }
        
        return {
          paperBalance: state.paperBalance - cost,
          portfolio: [...state.portfolio, newItem]
        }
      }),
      sellStock: (id, price) => set((state) => {
        const item = state.portfolio.find(p => p.id === id)
        if (!item) return state
        
        const proceeds = item.quantity * price
        const filtered = state.portfolio.filter(p => p.id !== id)
        
        // Add to history
        const historyItem = { ...item, sellPrice: price, sellDate: Date.now() } as any
        
        return {
          paperBalance: state.paperBalance + proceeds,
          portfolio: filtered,
          tradeHistory: [historyItem, ...state.tradeHistory]
        }
      }),
      resetPaperAccount: () => set({ paperBalance: 100000, portfolio: [], tradeHistory: [] }),

      journalEntries: [],
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [{ ...entry, id: Math.random().toString(36).slice(2, 11) }, ...state.journalEntries]
      })),
      removeJournalEntry: (id) => set((state) => ({
        journalEntries: state.journalEntries.filter(e => e.id !== id)
      })),

      tradeHistory: [],
      addToHistoryExecuted: (item) => set((state) => ({
        tradeHistory: [{ ...item, id: Math.random().toString(36).slice(2, 11) }, ...state.tradeHistory]
      })),
      removeFromHistory: (id) => set((state) => ({
        tradeHistory: state.tradeHistory.filter(h => h.id !== id)
      })),

      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      
      selectedMarket: 'IN',
      setSelectedMarket: (market) => set({ selectedMarket: market }),

      alerts: [],
      addAlert: (alert) => set((state) => ({
        alerts: [{ 
          ...alert, 
          id: Math.random().toString(36).slice(2, 11), 
          triggered: false, 
          createdAt: Date.now() 
        }, ...state.alerts].slice(0, 10)
      })),
      removeAlert: (id) => set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) })),
      updateAlert: (id, updates) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      streak: 0,
      lastLoginDate: '',
      analysisCount: 0,
      tradesLoggedCount: 0,
      achievements: DEFAULT_ACHIEVEMENTS,
      
      incrementAnalysis: () => set((state) => {
        const count = state.analysisCount + 1
        return { analysisCount: count }
      }),
      incrementTradesLogged: () => set((state) => ({ tradesLoggedCount: state.tradesLoggedCount + 1 })),
      
      unlockAchievement: (id) => set((state) => {
        if (state.achievements.find(a => a.id === id)?.unlocked) return state
        return {
          achievements: state.achievements.map(a => a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a)
        }
      }),
      
      checkStreak: () => {
        const today = new Date().toISOString().split('T')[0]
        const lastDate = get().lastLoginDate
        if (lastDate === today) return
        
        let newStreak = 1
        if (lastDate) {
          const last = new Date(lastDate)
          const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
          if (diff === 1) newStreak = get().streak + 1
          else if (diff > 1) newStreak = 1
        }
        set({ streak: newStreak, lastLoginDate: today })
      },

      dashboardLayout: [
        { id: 'MARKET_OVERVIEW', label: 'Indices', visible: true },
        { id: 'WATCHLIST', label: 'Watchlist Feed', visible: true },
        { id: 'TOP_MOVERS', label: 'Top Movers', visible: true },
        { id: 'SECTOR_HEATMAP', label: 'Market Heatmap', visible: true },
        { id: 'MARKET_CALENDAR', label: 'Temporal Events', visible: true },
      ],
      setDashboardLayout: (dashboardLayout) => set({ dashboardLayout }),
      
      appearance: {
        accentColor: '#00e676',
        cardStyle: 'glass'
      },

      browsedSectors: {},
      trackSector: (sector) => set((state) => ({
        browsedSectors: {
          ...state.browsedSectors,
          [sector]: (state.browsedSectors[sector] || 0) + 1
        }
      })),
      viewHistory: [],
      addToHistory: (symbol, name) => set((state) => {
        const filtered = state.viewHistory.filter(h => h.symbol !== symbol)
        return {
          viewHistory: [{ symbol, name, timestamp: Date.now() }, ...filtered].slice(0, 20)
        }
      }),
      resetLayout: () => set({
        dashboardLayout: [
          { id: 'MARKET_OVERVIEW', label: 'Indices', visible: true },
          { id: 'WATCHLIST', label: 'Watchlist Feed', visible: true },
          { id: 'TOP_MOVERS', label: 'Top Movers', visible: true },
          { id: 'SECTOR_HEATMAP', label: 'Market Heatmap', visible: true },
          { id: 'MARKET_CALENDAR', label: 'Temporal Events', visible: true },
        ]
      })
    }),
    {
      name: 'stoxpilot-advanced-store-v3',
    }
  )
)
