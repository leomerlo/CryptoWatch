import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchGlobalMarket } from '@/features/market/api/global.api'

const globalPayload = {
  data: {
    total_market_cap: { usd: 2_500_000_000_000 },
    total_volume: { usd: 120_000_000_000 },
    market_cap_percentage: { btc: 52.34 },
    market_cap_change_percentage_24h_usd: 1.2,
    active_cryptocurrencies: 100,
    updated_at: 1_700_000_000,
  },
}

describe('global.api', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('maps global market data to the app shape', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => globalPayload,
    })

    const result = await fetchGlobalMarket('USD')

    expect(fetchMock).toHaveBeenCalledOnce()
    const url = new URL(fetchMock.mock.calls[0][0] as string)
    expect(url.pathname).toBe('/functions/v1/coingecko/global')
    expect(url.searchParams.get('vs_currency')).toBe('usd')
    expect(result).toEqual({
      totalMarketCap: 2_500_000_000_000,
      volume24h: 120_000_000_000,
      btcDominance: 52.34,
      marketCapChange24h: 1.2,
      totalCoins: 100,
      updatedAt: 1_700_000_000,
    })
  })

  it('throws when the response is not ok', async () => {
    fetchMock.mockResolvedValue({ ok: false })

    await expect(fetchGlobalMarket('USD')).rejects.toThrow('Failed to fetch global market data')
  })
})
