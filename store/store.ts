import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WatchlistItem, PortfolioItem } from '@/lib/types'

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
}

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
      setNotificationsEnabled: (val) => set({ notificationsEnabled: val })
    }),
    {
      name: 'stockpilot-store-v2',
      partialize: (state) => ({ 
        watchlist: state.watchlist, 
        portfolio: state.portfolio,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        experienceLevel: state.experienceLevel,
        notificationsEnabled: state.notificationsEnabled
      })
    }
  )
)
