import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createUISlice, type UISlice } from '@/shared/theme/ui-slice'
export type AppStore = UISlice
export const useAppStore = create<AppStore>()(
  devtools(
    (...args) => ({
      ...createUISlice(...args),
    }),
    { name: 'CryptoWatch' }
  )
)
