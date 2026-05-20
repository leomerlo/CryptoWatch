import { useAppStore, type UISlice } from '@/stores'
import { useEffect, type ReactNode } from 'react'

type ThemeProviderProps = {
  children: ReactNode
}

function resolveTheme(theme: UISlice['theme']): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(theme: UISlice['theme']) {
  document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark')
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactNode {
  const theme = useAppStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      if (useAppStore.getState().theme === 'system') {
        applyTheme('system')
      }
    }

    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [theme])

  return children
}
