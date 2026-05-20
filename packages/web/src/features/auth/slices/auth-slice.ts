import type { StateCreator } from 'zustand'
import type { AppStore } from '@/stores'
import type { Session } from '@supabase/supabase-js'

export type AuthSlice = {
  session: Session | null
  setSession: (session: Session | null) => void
}

export const createAuthSlice: StateCreator<
  AppStore,
  [['zustand/devtools', unknown]],
  [],
  AuthSlice
> = (set) => ({
  session: null,
  setSession: (session) => set({ session }),
})
