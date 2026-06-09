import { useQuery } from '@tanstack/react-query'
import {
  coinsListQueryOptions,
  coinDetailQueryOptions,
  coinHistoryQueryOptions,
} from './coins.options'
import type { CoinHistoryTimeframe, CoinsListParams } from './coins.keys'
import type { Currency } from '@/shared/slices/ui-slice'

export function useCoins(params: CoinsListParams) {
  return useQuery(coinsListQueryOptions(params))
}

export function useCoin(coinId: string, currency: Currency) {
  return useQuery(coinDetailQueryOptions(coinId, currency))
}

export function useCoinHistory(
  coinId: string,
  timeframe: CoinHistoryTimeframe,
  currency: Currency
) {
  return useQuery(coinHistoryQueryOptions(coinId, timeframe, currency))
}
