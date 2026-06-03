import { useQuery } from '@tanstack/react-query'
import { coinsListQueryOptions, coinDetailQueryOptions } from './coins.options'
import type { CoinsListParams } from './coins.keys'

export function useCoins(params: CoinsListParams) {
  return useQuery(coinsListQueryOptions(params))
}

export function useCoin(coinId: string) {
  return useQuery(coinDetailQueryOptions(coinId))
}
