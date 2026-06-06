import { describe, expect, it } from 'vitest'

import { parseCoinDetails, parseCoinOhlc } from '@/features/market/types/coin'
import { mockCoinDetails, mockCoinGeckoDetailRaw, mockCoinOhlc } from '@/test/fixtures/market'

describe('coin types', () => {
  it('parses CoinGecko detail payload into flat CoinDetails', () => {
    expect(parseCoinDetails(mockCoinGeckoDetailRaw)).toEqual(mockCoinDetails)
  })

  it('parses OHLC rows into candle objects', () => {
    const rows = mockCoinOhlc.map((c) => [c.timestamp, c.open, c.high, c.low, c.close])
    expect(parseCoinOhlc(rows)).toEqual(mockCoinOhlc)
  })
})
