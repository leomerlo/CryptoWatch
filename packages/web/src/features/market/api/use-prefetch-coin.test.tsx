import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { coinDetailQueryOptions } from '@/features/market/api/coins.options'
import { usePrefetchCoin } from '@/features/market/api/use-prefetch-coin'
import { coinsKeys } from '@/features/market/api/coins.keys'
import { mockCoinDetails } from '@/test/fixtures/market'
import { createTestQueryClient } from '@/test/create-test-query-client'
import { TestProviders } from '@/test/test-providers'

const fetchCoinDetailsMock = vi.fn()

vi.mock('@/features/market/api/coins.api', () => ({
  fetchCoinDetails: (id: string) => fetchCoinDetailsMock(id),
}))

describe('usePrefetchCoin', () => {
  it('prefetches coin details when data is not cached', async () => {
    fetchCoinDetailsMock.mockResolvedValue(mockCoinDetails)
    const queryClient = createTestQueryClient()

    const { result } = renderHook(() => usePrefetchCoin(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    })

    result.current('bitcoin')

    await waitFor(() => {
      expect(queryClient.getQueryData(coinsKeys.detail('bitcoin'))).toEqual(mockCoinDetails)
    })
    expect(fetchCoinDetailsMock).toHaveBeenCalledWith('bitcoin')
  })

  it('does not prefetch when data is already cached', async () => {
    fetchCoinDetailsMock.mockResolvedValue(mockCoinDetails)
    const queryClient = createTestQueryClient()

    await queryClient.prefetchQuery(coinDetailQueryOptions('bitcoin'))
    fetchCoinDetailsMock.mockClear()

    const { result } = renderHook(() => usePrefetchCoin(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    })

    result.current('bitcoin')

    expect(fetchCoinDetailsMock).not.toHaveBeenCalled()
  })
})
