import type { CoinDetails } from '@/features/market/types/coin'
import { formatCurrency, formatDate, formatSupply } from '@/shared/utils'
import { useAppStore } from '@/stores'

const statCardClassName =
  'flex-1 min-w-[140px] py-2 px-4 border border-border rounded-lg bg-table-background flex flex-col text-left'

function StatCard({ title, value, subValue }: { title: string; value: string; subValue?: string }) {
  return (
    <div className={statCardClassName}>
      <span className="text-2xs tracking-tight font-medium text-gray-500">{title}</span>
      <span className="text-lg font-bold">{value}</span>
      {subValue ? <span className="text-2xs text-gray-500">{subValue}</span> : null}
    </div>
  )
}

type CoinDetailStatsProps = {
  coin: CoinDetails
}

export function CoinDetailStats({ coin }: CoinDetailStatsProps) {
  const currency = useAppStore((state) => state.currency)
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Market Cap" value={formatCurrency(coin.marketCap, currency, true)} />
      <StatCard title="24h Volume" value={formatCurrency(coin.volume24h, currency, true)} />
      <StatCard
        title="All-Time High"
        value={formatCurrency(coin.ath.price, currency)}
        subValue={formatDate(coin.ath.date)}
      />
      <StatCard
        title="All-Time Low"
        value={formatCurrency(coin.atl.price, currency)}
        subValue={formatDate(coin.atl.date)}
      />
      <StatCard title="Circulating Supply" value={formatSupply(coin.circulatingSupply)} />
      <StatCard title="Max Supply" value={formatSupply(coin.maxSupply)} />
    </div>
  )
}
