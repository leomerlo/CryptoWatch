import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createUISlice, type UISlice } from '@/shared/theme/ui-slice'
import { createAuthSlice, type AuthSlice } from '@/features/auth/stores/auth-slice'
export type AppStore = UISlice & AuthSlice
export type { UISlice, AuthSlice }
export const useAppStore = create<AppStore>()(
  devtools(
    (...args) => ({
      ...createUISlice(...args),
      ...createAuthSlice(...args),
    }),
    { name: 'CryptoWatch' }
  )
)
