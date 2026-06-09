import type { StateCreator } from 'zustand'
import type { AppStore } from '@/stores'
import type { SortingState, Updater } from '@tanstack/react-table'

export type Theme = 'light' | 'dark' | 'system'
export type Currency = 'USD' | 'EUR' | 'ARS'
export type AutoRefresh = 30 | 60 | 120 | 300
export type UISlice = {
  theme: Theme
  setTheme: (theme: Theme) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  autoRefresh: AutoRefresh
  setAutoRefresh: (autoRefresh: AutoRefresh) => void
  marketSorting: SortingState
  setMarketSorting: (updater: Updater<SortingState>) => void
}

export const createUISlice: StateCreator<AppStore, [['zustand/devtools', unknown]], [], UISlice> = (
  set
) => ({
  theme: 'system',
  setTheme: (theme) => {
    set({ theme }, false, 'ui/setTheme')
  },
  currency: 'USD',
  setCurrency: (currency: Currency) => {
    set((state) => ({ ...state, currency }), false, 'ui/setCurrency')
  },
  autoRefresh: 30,
  setAutoRefresh: (autoRefresh: AutoRefresh) => {
    set((state) => ({ ...state, autoRefresh }), false, 'ui/setAutoRefresh')
  },
  marketSorting: [],
  setMarketSorting: (updater: Updater<SortingState>) => {
    set(
      (state) => {
        const next = typeof updater === 'function' ? updater(state.marketSorting) : updater
        return { marketSorting: next }
      },
      false,
      'ui/setMarketSorting'
    )
  },
})
