import type { StateCreator } from 'zustand'
import type { AppStore } from '@/stores'
export type Theme = 'light' | 'dark' | 'system'
export type UISlice = {
  theme: Theme
  setTheme: (theme: Theme) => void
}
export const createUISlice: StateCreator<AppStore, [['zustand/devtools', unknown]], [], UISlice> = (
  set
) => ({
  theme: 'system',
  setTheme: (theme) => {
    set({ theme }, false, 'ui/setTheme') // action name in DevTools
    localStorage.setItem('cw-ui', theme)
  },
})
