import type { CoinHistoryTimeframe } from './coins.keys'

/** CoinGecko OHLC endpoint only accepts these day ranges. */
export const OHLC_DAYS_BY_TIMEFRAME: Record<CoinHistoryTimeframe, number> = {
  '1h': 1,
  '4h': 7,
  '1d': 30,
  '1w': 90,
}
