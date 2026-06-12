import { describe, expect, it } from 'vitest'

import { coinDetailQueryOptions, coinsListQueryOptions } from '@/features/market/api/coins.options'
import { coinsKeys } from '@/features/market/api/coins.keys'

describe('coins.options', () => {
  it('configures coins list query options', () => {
    const params = {
      page: 1,
      perPage: 250,
      filters: { category: 'all' },
      currency: 'USD' as const,
      refetchInterval: 30 as const,
    }
    const options = coinsListQueryOptions(params)

    expect(options.queryKey).toEqual(
      coinsKeys.list({ page: 1, perPage: 250, filters: { category: 'all' }, currency: 'USD' })
    )
    expect(options.staleTime).toBe(60_000)
    expect(options.gcTime).toBe(5 * 60 * 1000)
    expect(options.refetchOnWindowFocus).toBe(true)
    expect(options.refetchOnMount).toBe(false)
    expect(options.refetchInterval).toBe(30_000)
  })

  it('configures coin detail query options', () => {
    const options = coinDetailQueryOptions('bitcoin', 'USD')

    expect(options.queryKey).toEqual(coinsKeys.detail('bitcoin', 'USD'))
    expect(options.staleTime).toBe(60_000)
    expect(options.gcTime).toBe(5 * 60 * 1000)
    expect(options.refetchOnWindowFocus).toBe(true)
    expect(options.refetchOnMount).toBe(false)
  })
})
