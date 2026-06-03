import { describe, expect, it } from 'vitest'

import { coinsKeys } from '@/features/market/api/coins.keys'

describe('coinsKeys', () => {
  it('builds stable list keys from params', () => {
    const params = { page: 1, perPage: 250, filters: { category: 'all' } }

    expect(coinsKeys.list(params)).toEqual(['coins', 'list', params])
  })

  it('builds detail keys from coin id', () => {
    expect(coinsKeys.detail('bitcoin')).toEqual(['coins', 'detail', 'bitcoin'])
  })

  it('builds history keys from id and timeframe', () => {
    expect(coinsKeys.history('bitcoin', '1d')).toEqual(['coins', 'history', 'bitcoin', '1d'])
  })
})
