import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface CoinFiltersProps {
  filters: Record<string, unknown>
  setFilters: (filters: Record<string, unknown>) => void
}

const categories = [
  { label: 'All', value: 'all' },
  { label: 'DeFi', value: 'decentralized-finance-defi' },
  { label: 'NFTs', value: 'non-fungible-tokens-nft' },
  { label: 'Layer 1', value: 'layer-1' },
]

const CoinFilters = ({ filters, setFilters }: CoinFiltersProps) => {
  return (
    <div className="flex gap-0.5 bg-muted/50 border border-muted rounded-lg p-0.5 w-auto">
      {categories.map((category) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setFilters({ category: category.value })}
          className={cn(filters.category === category.value && 'bg-muted')}
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}

export default CoinFilters
