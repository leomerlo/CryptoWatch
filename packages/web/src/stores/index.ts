import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createUISlice, type UISlice } from '@/shared/slices/ui-slice'
import { createAuthSlice, type AuthSlice } from '@/features/auth/slices/auth-slice'
export type AppStore = UISlice & AuthSlice
export type { UISlice, AuthSlice }
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createUISlice(...args),
        ...createAuthSlice(...args),
      }),
      { name: 'CryptoWatch' }
    ),
    {
      name: 'cw-ui',
      partialize: (state: AppStore) => ({
        theme: state.theme,
        currency: state.currency,
        autoRefresh: state.autoRefresh,
        marketSorting: state.marketSorting,
      }),
    }
  )
)
