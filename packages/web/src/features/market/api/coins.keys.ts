export type CoinsListParams = {
  page?: number
  filters?: Record<string, unknown>
}

export type CoinHistoryTimeframe = '1h' | '4h' | '1d' | '1w'

export const coinsKeys = {
  all: ['coins'] as const,
  lists: () => [...coinsKeys.all, 'list'] as const,
  list: (params: CoinsListParams) => [...coinsKeys.lists(), params] as const,
  details: () => [...coinsKeys.all, 'detail'] as const,
  detail: (id: string) => [...coinsKeys.details(), id] as const,
  histories: () => [...coinsKeys.all, 'history'] as const,
  history: (id: string, timeframe: CoinHistoryTimeframe) =>
    [...coinsKeys.histories(), id, timeframe] as const,
}
