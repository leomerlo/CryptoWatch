import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchCoinDetails, fetchCoinsList } from '@/features/market/api/coins.api'
import { mockCoin } from '@/test/fixtures/market'

describe('coins.api', () => {
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

  describe('fetchCoinsList', () => {
    it('requests markets with default query params', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => [mockCoin],
      })

      const result = await fetchCoinsList({ page: 1, perPage: 20 })

      expect(fetchMock).toHaveBeenCalledOnce()
      const url = new URL(fetchMock.mock.calls[0][0] as string)
      expect(url.pathname).toBe('/functions/v1/coingecko/coins/markets')
      expect(url.searchParams.get('page')).toBe('1')
      expect(url.searchParams.get('per_page')).toBe('20')
      expect(url.searchParams.get('vs_currency')).toBe('usd')
      expect(url.searchParams.get('sparkline')).toBe('true')
      expect(url.searchParams.get('price_change_percentage')).toBe('24h')
      expect(url.searchParams.get('order')).toBe('market_cap_desc')
      expect(url.searchParams.get('category')).toBeNull()
      expect(result).toEqual([mockCoin])
    })

    it('includes category when filter is not "all"', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => [mockCoin],
      })

      await fetchCoinsList({
        page: 2,
        perPage: 50,
        filters: { category: 'layer-1' },
      })

      const url = new URL(fetchMock.mock.calls[0][0] as string)
      expect(url.searchParams.get('page')).toBe('2')
      expect(url.searchParams.get('per_page')).toBe('50')
      expect(url.searchParams.get('category')).toBe('layer-1')
    })

    it('throws when the response is not ok', async () => {
      fetchMock.mockResolvedValue({ ok: false })

      await expect(fetchCoinsList({ page: 1 })).rejects.toThrow('Failed to fetch coins list')
    })

    it('throws when the payload fails validation', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => [{ id: 'invalid' }],
      })

      await expect(fetchCoinsList({ page: 1 })).rejects.toThrow()
    })
  })

  describe('fetchCoinDetails', () => {
    it('requests coin details by id', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockCoin,
      })

      const result = await fetchCoinDetails('bitcoin')

      const url = new URL(fetchMock.mock.calls[0][0] as string)
      expect(url.pathname).toBe('/functions/v1/coingecko/coins/bitcoin')
      expect(result).toEqual(mockCoin)
    })

    it('throws when the response is not ok', async () => {
      fetchMock.mockResolvedValue({ ok: false })

      await expect(fetchCoinDetails('bitcoin')).rejects.toThrow('Failed to fetch coin details')
    })
  })
})
