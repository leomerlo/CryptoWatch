import { useState } from 'react'
import { getRouteApi, Link } from '@tanstack/react-router'

import type { CoinHistoryTimeframe } from '@/features/market/api/coins.keys'
import { useCoin, useCoinHistory } from '@/features/market/api/use-coins'
import { CoinDetailStats } from '@/features/market/components/coin-detail/coin-detail-stats'
import { CoinHistoryTimeframeSelector } from '@/features/market/components/coin-detail/coin-history-timeframe'
import CoinOhlcChart from '@/features/market/components/coin-detail/coin-ohlc-chart'
import { ArrowLeftIcon, BellIcon, StarIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/utils'

const coinRoute = getRouteApi('/coins/$coinId')

const CoinPage = () => {
  const { coinId } = coinRoute.useParams()
  const [timeframe, setTimeframe] = useState<CoinHistoryTimeframe>('1d')

  const { data: coin, isLoading, isError, error } = useCoin(coinId)
  const {
    data: candles,
    isLoading: isChartLoading,
    isError: isChartError,
    error: chartError,
  } = useCoinHistory(coinId, timeframe)

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>
  if (!coin) return <div>No data</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="mt-4">
        <Link
          to="/"
          className="text-sm! text-gray-500! hover:text-gray-700! transition-colors! inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to market
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt="" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl! font-bold! tracking-wide! m-0!">{coin.name} </h1>
              <span className="text-gray-500 uppercase text-sm">{coin.symbol}</span>
              {coin.marketCapRank && (
                <div className="text-[.8rem]">
                  Rank: <span className="text-gray-500 uppercase">#{coin.marketCapRank}</span>
                </div>
              )}
            </div>
            <div className="text-white text-4xl font-bold tracking-wide!">
              {formatCurrency(coin.currentPrice, 'USD', false)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="sm">
            <StarIcon className="w-4 h-4" />
            Watchlist
          </Button>
          <Button variant="outline" size="sm">
            <BellIcon className="w-4 h-4" />
            Alerts
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border border-border rounded-lg bg-table-background p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg! font-bold! tracking-wide! m-0!">Price chart</h2>
          <CoinHistoryTimeframeSelector value={timeframe} onChange={setTimeframe} />
        </div>
        {isChartLoading ? (
          <div className="h-60 flex items-center justify-center text-gray-500">
            Loading chart...
          </div>
        ) : isChartError ? (
          <div className="h-60 flex items-center justify-center text-red-500">
            {chartError.message}
          </div>
        ) : (
          <CoinOhlcChart candles={candles ?? []} className="h-60 w-full" height={240} />
        )}
      </div>

      <CoinDetailStats coin={coin} />
    </div>
  )
}

export default CoinPage
