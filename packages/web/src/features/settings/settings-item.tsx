import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const settingsItemVariants = cva(
  'flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border p-3 cursor-pointer transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
  {
    variants: {
      active: {
        true: 'border-primary bg-primary/10 text-primary [&_svg]:text-primary',
        false: 'border-border bg-card text-muted-foreground [&_svg]:text-muted-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

type SettingsItemGroupContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const SettingsItemGroupContext = React.createContext<SettingsItemGroupContextValue | null>(null)

type SettingsItemGroupProps = {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

function SettingsItemGroup({
  value,
  onValueChange,
  children,
  className,
  'aria-label': ariaLabel,
}: SettingsItemGroupProps) {
  const contextValue = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange])

  return (
    <SettingsItemGroupContext.Provider value={contextValue}>
      <div role="radiogroup" aria-label={ariaLabel} className={cn('flex gap-3', className)}>
        {children}
      </div>
    </SettingsItemGroupContext.Provider>
  )
}

type SettingsItemProps = {
  value: string
  children: React.ReactNode
  className?: string
  active?: boolean
  onClick?: () => void
}

function SettingsItem({ value, children, className, active, onClick }: SettingsItemProps) {
  const group = React.useContext(SettingsItemGroupContext)
  const isActive = active ?? (group ? group.value === value : false)

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }
    group?.onValueChange(value)
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={handleClick}
      className={cn(settingsItemVariants({ active: isActive }), className)}
    >
      {children}
    </button>
  )
}

export { SettingsItem, SettingsItemGroup }
