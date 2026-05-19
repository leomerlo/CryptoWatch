import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

interface UIStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const useUIStore = create<UIStore>((set) => ({
  theme: (localStorage.getItem('cw-ui') as Theme) || 'system',
  setTheme: (theme: Theme) => {
    set({ theme: theme })
    localStorage.setItem('cw-ui', theme)
  },
}))

export default useUIStore
