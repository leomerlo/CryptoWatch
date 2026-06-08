import { describe, expect, it } from 'vitest'

import { coinDetailQueryOptions, coinsListQueryOptions } from '@/features/market/api/coins.options'
import { coinsKeys } from '@/features/market/api/coins.keys'

describe('coins.options', () => {
  it('configures coins list query options', () => {
    const params = { page: 1, perPage: 250, filters: { category: 'all' } }
    const options = coinsListQueryOptions(params)

    expect(options.queryKey).toEqual(coinsKeys.list(params))
    expect(options.staleTime).toBe(60_000)
    expect(options.gcTime).toBe(5 * 60 * 1000)
    expect(options.refetchOnWindowFocus).toBe(true)
    expect(options.refetchOnMount).toBe(false)
  })

  it('configures coin detail query options', () => {
    const options = coinDetailQueryOptions('bitcoin')

    expect(options.queryKey).toEqual(coinsKeys.detail('bitcoin'))
    expect(options.staleTime).toBe(60_000)
    expect(options.gcTime).toBe(5 * 60 * 1000)
    expect(options.refetchOnWindowFocus).toBe(true)
    expect(options.refetchOnMount).toBe(false)
  })
})
