import { useQuery } from '@tanstack/react-query'
import {
  coinsListQueryOptions,
  coinDetailQueryOptions,
  coinHistoryQueryOptions,
} from './coins.options'
import type { CoinHistoryTimeframe, CoinsListParams } from './coins.keys'

export function useCoins(params: CoinsListParams) {
  return useQuery(coinsListQueryOptions(params))
}

export function useCoin(coinId: string) {
  return useQuery(coinDetailQueryOptions(coinId))
}

export function useCoinHistory(coinId: string, timeframe: CoinHistoryTimeframe) {
  return useQuery(coinHistoryQueryOptions(coinId, timeframe))
}
