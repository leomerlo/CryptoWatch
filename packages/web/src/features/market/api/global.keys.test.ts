import { describe, expect, it } from 'vitest'

import { globalKeys } from '@/features/market/api/global.keys'

describe('globalKeys', () => {
  it('builds market keys from currency', () => {
    expect(globalKeys.market('usd')).toEqual(['global', 'markets', 'usd'])
  })
})
