import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import MarketStats from '@/features/market/components/market-stats'
import { mockGlobalMarket } from '@/test/fixtures/market'

const useGlobalMarketMock = vi.fn()

vi.mock('@/features/market/api/use-global', () => ({
  useGlobalMarket: () => useGlobalMarketMock(),
}))

describe('MarketStats', () => {
  beforeEach(() => {
    useGlobalMarketMock.mockReset()
  })

  it('renders loading skeletons', () => {
    useGlobalMarketMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { container } = render(<MarketStats />)

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6)
  })

  it('renders an error message', () => {
    useGlobalMarketMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    })

    render(<MarketStats />)

    expect(screen.getByText('Error: Network error')).toBeInTheDocument()
  })

  it('renders a no-data message', () => {
    useGlobalMarketMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    render(<MarketStats />)

    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders formatted market stats', () => {
    useGlobalMarketMock.mockReturnValue({
      data: mockGlobalMarket,
      isLoading: false,
      error: null,
    })

    render(<MarketStats />)

    expect(screen.getByText('Total Market Cap')).toBeInTheDocument()
    expect(screen.getByText('$2.5T')).toBeInTheDocument()
    expect(screen.getByText('Volume 24h')).toBeInTheDocument()
    expect(screen.getByText('$120B')).toBeInTheDocument()
    expect(screen.getByText('BTC Dominance')).toBeInTheDocument()
    expect(screen.getByText('52.34%')).toBeInTheDocument()
  })
})
