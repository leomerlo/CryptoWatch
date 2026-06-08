import type { StateCreator } from 'zustand'
import type { AppStore } from '@/stores'
import type { SortingState, Updater } from '@tanstack/react-table'

export type Theme = 'light' | 'dark' | 'system'
export type UISlice = {
  theme: Theme
  setTheme: (theme: Theme) => void
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
