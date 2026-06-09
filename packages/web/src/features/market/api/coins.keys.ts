import type { AutoRefresh, Currency } from '@/shared/slices/ui-slice'

export type CoinsListKeyParams = {
  page?: number
  perPage?: number
  filters?: Record<string, unknown>
  currency?: Currency
}

export type CoinsListParams = CoinsListKeyParams & {
  refetchInterval: AutoRefresh
}

export type CoinHistoryTimeframe = '1h' | '4h' | '1d' | '1w'

export const coinsKeys = {
  all: ['coins'] as const,
  lists: () => [...coinsKeys.all, 'list'] as const,
  list: (params: CoinsListKeyParams) => [...coinsKeys.lists(), params] as const,
  details: () => [...coinsKeys.all, 'detail'] as const,
  detail: (id: string, currency: Currency) => [...coinsKeys.details(), id, currency] as const,
  histories: () => [...coinsKeys.all, 'history'] as const,
  history: (id: string, timeframe: CoinHistoryTimeframe, currency: Currency) =>
    [...coinsKeys.histories(), id, timeframe, currency] as const,
}
