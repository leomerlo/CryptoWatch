import { SettingsItem, SettingsItemGroup } from './settings-item'

export interface SettingItem {
  label: string
  value: string
  children: React.ReactNode
}

export interface Setting {
  label: string
  value: string
  onValueChange: (value: string) => void
  items: SettingItem[]
}

interface SettingsCardProps {
  title: string
  description: string
  children?: React.ReactNode
  setting?: Setting
}

const SettingsCard = ({ title, description, children, setting }: SettingsCardProps) => {
  return (
    <div className="bg-muted/50 border border-muted rounded-lg p-4 w-120 flex flex-col gap-4">
      <div>
        <h2 className="text-sm! font-bold! tracking-wide! m-0! text-foreground!">{title}</h2>
        <span className="text-xs! text-muted-foreground!">{description}</span>
      </div>
      {children && <div>{children}</div>}
      {setting && (
        <SettingsItemGroup
          value={setting.value}
          onValueChange={setting.onValueChange}
          aria-label={setting.label}
        >
          {setting.items.map((setting) => (
            <SettingsItem key={setting.value} value={setting.value}>
              {setting.children}
            </SettingsItem>
          ))}
        </SettingsItemGroup>
      )}
    </div>
  )
}

export default SettingsCard
