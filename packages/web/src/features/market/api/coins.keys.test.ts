import { describe, expect, it } from 'vitest'

import { coinsKeys } from '@/features/market/api/coins.keys'

describe('coinsKeys', () => {
  it('builds stable list keys from params without refetch interval', () => {
    const params = {
      page: 1,
      perPage: 250,
      filters: { category: 'all' },
      currency: 'USD' as const,
    }

    expect(coinsKeys.list(params)).toEqual(['coins', 'list', params])
  })

  it('builds detail keys from coin id and currency', () => {
    expect(coinsKeys.detail('bitcoin', 'USD')).toEqual(['coins', 'detail', 'bitcoin', 'USD'])
  })

  it('builds history keys from id, timeframe, and currency', () => {
    expect(coinsKeys.history('bitcoin', '1d', 'USD')).toEqual([
      'coins',
      'history',
      'bitcoin',
      '1d',
      'USD',
    ])
  })
})
