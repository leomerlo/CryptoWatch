import { useQuery } from '@tanstack/react-query'
import { coinsListQueryOptions } from './coins.options'
import type { CoinsListParams } from './coins.keys'

export function useCoins(params: CoinsListParams) {
  return useQuery(coinsListQueryOptions(params))
}
