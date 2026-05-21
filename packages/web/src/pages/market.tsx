import { useCoins } from '@/features/market/api/use-coins'
import { useGlobalMarket } from '@/features/market/api/use-global'
import { formatCurrency } from '@/shared/utils'

const MarketPage = () => {
  const {
    data: coins,
    isLoading: isLoadingCoins,
    error: errorCoins,
  } = useCoins({ page: 1, filters: { category: 'all' } })
  const {
    data: globalMarket,
    isLoading: isLoadingGlobalMarket,
    error: errorGlobalMarket,
  } = useGlobalMarket()

  if (isLoadingCoins || isLoadingGlobalMarket) return <div>Loading...</div>
  if (errorCoins || errorGlobalMarket)
    return <div>Error: {errorCoins?.message || errorGlobalMarket?.message}</div>
  if (!coins) return <div>No data</div>

  return (
    <div>
      <h1 className="text-2xl font-bold">Market</h1>
      <div className="flex gap-4">
        {!globalMarket && (
          <span className="text-2xl font-bold">Error fetching global market data</span>
        )}
        {globalMarket && (
          <>
            <div className="flex-1">
              <span className="text-sm text-gray-500">Total Market Cap</span>
              <span className="text-2xl font-bold">
                {formatCurrency(globalMarket?.totalMarketCap, 'USD')}
              </span>
            </div>
            <div className="flex-1">
              <span className="text-sm text-gray-500">Volume 24h</span>
              <span className="text-2xl font-bold">
                {formatCurrency(globalMarket?.volume24h, 'USD')}
              </span>
            </div>
            <div className="flex-1">
              <span className="text-sm text-gray-500">BTC Dominance</span>
              <span className="text-2xl font-bold">{globalMarket?.btcDominance.toFixed(2)}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MarketPage
