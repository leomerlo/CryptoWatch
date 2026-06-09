import type { CoinHistoryTimeframe, CoinsListParams } from '@/features/market/api/coins.keys'
import { coinsKeys } from '@/features/market/api/coins.keys'
import { queryOptions } from '@tanstack/react-query'
import { fetchCoinDetails, fetchCoinOhlc, fetchCoinsList } from '@/features/market/api/coins.api'
import type { Currency } from '@/shared/slices/ui-slice'

export function coinsListQueryOptions(params: CoinsListParams) {
  const { refetchInterval, ...keyParams } = params
  return queryOptions({
    queryKey: coinsKeys.list(keyParams),
    queryFn: () => fetchCoinsList(params),
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchInterval: refetchInterval * 1000,
  })
}

export function coinDetailQueryOptions(id: string, currency: Currency) {
  return queryOptions({
    queryKey: coinsKeys.detail(id, currency),
    queryFn: () => fetchCoinDetails(id, currency),
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    enabled: Boolean(id),
  })
}

export function coinHistoryQueryOptions(
  id: string,
  timeframe: CoinHistoryTimeframe,
  currency: Currency
) {
  return queryOptions({
    queryKey: coinsKeys.history(id, timeframe, currency),
    queryFn: () => fetchCoinOhlc(id, timeframe, currency),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(id),
  })
}
