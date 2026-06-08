import type { CoinHistoryTimeframe, CoinsListParams } from '@/features/market/api/coins.keys'
import { coinsKeys } from '@/features/market/api/coins.keys'
import { queryOptions } from '@tanstack/react-query'
import { fetchCoinDetails, fetchCoinOhlc, fetchCoinsList } from '@/features/market/api/coins.api'

export function coinsListQueryOptions(params: CoinsListParams) {
  return queryOptions({
    queryKey: coinsKeys.list(params),
    queryFn: () => fetchCoinsList(params),
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
  })
}

export function coinDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: coinsKeys.detail(id),
    queryFn: () => fetchCoinDetails(id),
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    enabled: Boolean(id),
  })
}

export function coinHistoryQueryOptions(id: string, timeframe: CoinHistoryTimeframe) {
  return queryOptions({
    queryKey: coinsKeys.history(id, timeframe),
    queryFn: () => fetchCoinOhlc(id, timeframe),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(id),
  })
}
