import type { CoinsListParams } from '@/features/market/api/coins.keys'
import { coinsKeys } from '@/features/market/api/coins.keys'
import { queryOptions } from '@tanstack/react-query'
import { fetchCoinsList } from '@/features/market/api/coins.api'

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
