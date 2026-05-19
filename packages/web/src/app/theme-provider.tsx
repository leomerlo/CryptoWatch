import useUIStore, { type Theme } from '@/stores/uiStore'
import { useEffect, type ReactNode } from 'react'

type ThemeProviderProps = {
  children: ReactNode
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark')
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactNode {
  const theme = useUIStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      if (useUIStore.getState().theme === 'system') {
        applyTheme('system')
      }
    }

    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [theme])

  return children
}
