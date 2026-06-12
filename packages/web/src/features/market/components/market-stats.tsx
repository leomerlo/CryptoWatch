import { useGlobalMarket } from '@/features/market/api/use-global'
import { formatCurrency } from '@/shared/utils'
import { useAppStore } from '@/stores'

const MarketStatsCardClassName =
  'flex-1 py-2 px-4 border border-border rounded-lg bg-table-background flex flex-col text-left'

const MarketStatsCardSkeleton = () => {
  return (
    <div className={MarketStatsCardClassName}>
      <span className="text-2xs text-gray-500 w-1/3 h-4 bg-gray-800 rounded-md animate-pulse"></span>
      <span className="text-lg font-bold w-1/2 h-4 bg-gray-800 rounded-md animate-pulse"></span>
    </div>
  )
}

const MarketStatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className={MarketStatsCardClassName}>
      <span className="text-2xs tracking-tight font-medium text-gray-500">{title}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  )
}

const MarketStats = () => {
  const currency = useAppStore((state) => state.currency)
  const { data, isLoading, error } = useGlobalMarket(currency)
  if (isLoading)
    return (
      <div className="flex gap-4">
        <MarketStatsCardSkeleton />
        <MarketStatsCardSkeleton />
        <MarketStatsCardSkeleton />
      </div>
    )
  if (error) return <div>Error: {error?.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div className="flex gap-4">
      <MarketStatCard
        title="Total Market Cap"
        value={formatCurrency(data?.totalMarketCap, currency, true)}
      />
      <MarketStatCard title="Volume 24h" value={formatCurrency(data?.volume24h, currency, true)} />
      <MarketStatCard title="BTC Dominance" value={data?.btcDominance.toFixed(2) + '%'} />
    </div>
  )
}

export default MarketStats
