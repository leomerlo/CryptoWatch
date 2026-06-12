import SettingsCard from '@/features/settings/settings-card'
import type { Setting } from '@/features/settings/settings-card'
import { cn } from '@/shared/lib/utils'
import type { AutoRefresh } from '@/shared/slices/ui-slice'
import { useAppStore } from '@/stores'
import { DollarSignIcon, EuroIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

const themeItemsClass = 'flex flex-col items-center gap-2 text-xs! tracking-wide! m-0!'

const SettingsPage = () => {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)
  const currency = useAppStore((state) => state.currency)
  const setCurrency = useAppStore((state) => state.setCurrency)
  const autoRefresh = useAppStore((state) => state.autoRefresh)
  const setAutoRefresh = useAppStore((state) => state.setAutoRefresh)
  const themeSetting: Setting = {
    label: 'Theme',
    value: theme,
    items: [
      {
        label: 'Light',
        value: 'light',
        children: (
          <div className={themeItemsClass}>
            <SunIcon className="w-4 h-4" /> Light
          </div>
        ),
      },
      {
        label: 'Dark',
        value: 'dark',
        children: (
          <div className={themeItemsClass}>
            <MoonIcon className="w-4 h-4" /> Dark
          </div>
        ),
      },
      {
        label: 'System',
        value: 'system',
        children: (
          <div className={themeItemsClass}>
            <MonitorIcon className="w-4 h-4" /> System
          </div>
        ),
      },
    ],
    onValueChange: (value: string) => {
      setTheme(value as 'light' | 'dark' | 'system')
    },
  }

  const currencySetting: Setting = {
    label: 'Currency',
    value: currency,
    items: [
      {
        label: 'USD',
        value: 'USD',
        children: (
          <div className={themeItemsClass}>
            <DollarSignIcon className="w-4 h-4" /> US Dollar
          </div>
        ),
      },
      {
        label: 'EUR',
        value: 'EUR',
        children: (
          <div className={themeItemsClass}>
            <EuroIcon className="w-4 h-4" /> Euro
          </div>
        ),
      },
      {
        label: 'ARS',
        value: 'ARS',
        children: (
          <div className={themeItemsClass}>
            <DollarSignIcon className="w-4 h-4" /> Argentine Peso
          </div>
        ),
      },
    ],
    onValueChange: (value: string) => {
      setCurrency(value as 'USD' | 'EUR')
    },
  }

  const onAutoRefreshChange = (value: AutoRefresh) => {
    setAutoRefresh(value)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl! font-bold! tracking-wide! mt-4! mb-0! text-foreground!">Settings</h1>
      <div className="flex flex-col gap-6">
        <SettingsCard
          title="Theme"
          description="Choose your preferred theme"
          setting={themeSetting}
        ></SettingsCard>
        <SettingsCard
          title="Currency"
          description="Choose your preferred currency"
          setting={currencySetting}
        ></SettingsCard>
        <SettingsCard
          title="Auto-refresh"
          description="Polling interval for REST data (WS prices are always live)"
        >
          <div
            className="flex gap-2 bg-background rounded-lg p-1 border-foreground/10 justify-self-start"
            role="radiogroup"
          >
            <button
              role="radio"
              type="button"
              className={cn(
                'text-xs! tracking-wide! m-0! px-2 py-1 rounded-md cursor-pointer',
                autoRefresh === 30 ? 'bg-primary' : ''
              )}
              onClick={() => onAutoRefreshChange(30)}
            >
              30s
            </button>
            <button
              role="radio"
              type="button"
              className={cn(
                'text-xs! tracking-wide! m-0! px-2 py-1 rounded-md cursor-pointer',
                autoRefresh === 60 ? 'bg-primary' : ''
              )}
              onClick={() => onAutoRefreshChange(60)}
            >
              1m
            </button>
            <button
              role="radio"
              type="button"
              className={cn(
                'text-xs! tracking-wide! m-0! px-2 py-1 rounded-md cursor-pointer',
                autoRefresh === 120 ? 'bg-primary' : ''
              )}
              onClick={() => onAutoRefreshChange(120)}
            >
              2m
            </button>
            <button
              role="radio"
              type="button"
              className={cn(
                'text-xs! tracking-wide! m-0! px-2 py-1 rounded-md cursor-pointer',
                autoRefresh === 300 ? 'bg-primary' : ''
              )}
              onClick={() => onAutoRefreshChange(300)}
            >
              5m
            </button>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

export default SettingsPage
