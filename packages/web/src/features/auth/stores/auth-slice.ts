import type { StateCreator } from 'zustand'
import type { AppStore } from '@/stores'
import type { Session, User } from '@supabase/supabase-js'

export type AuthSlice = {
  session: Session | null
  user: User | null
  setSession: (session: Session | null) => void
}

export const createAuthSlice: StateCreator<
  AppStore,
  [['zustand/devtools', unknown]],
  [],
  AuthSlice
> = (set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session, user: session?.user ?? null }),
})
