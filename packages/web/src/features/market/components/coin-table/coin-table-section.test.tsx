import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SortingState } from '@tanstack/react-table'

import { CoinTableSection } from '@/features/market/components/coin-table/coin-table-section'
import { mockCoin, mockEthereum } from '@/test/fixtures/market'

const useCoinsMock = vi.fn()
const prefetchCoinMock = vi.fn()

const storeState = vi.hoisted(() => ({
  marketSorting: [] as SortingState,
  setMarketSorting: vi.fn(),
}))

vi.mock('@/stores', () => ({
  useAppStore: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}))

vi.mock('@/features/market/api/use-coins', () => ({
  useCoins: (params: unknown) => useCoinsMock(params),
}))

vi.mock('@/features/market/api/use-prefetch-coin', () => ({
  usePrefetchCoin: () => prefetchCoinMock,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>,
}))

describe('CoinTableSection', () => {
  beforeEach(() => {
    useCoinsMock.mockReset()
    prefetchCoinMock.mockReset()
    storeState.marketSorting = []
    storeState.setMarketSorting.mockReset()
  })

  it('renders a loading state', () => {
    useCoinsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { container } = render(<CoinTableSection />)

    expect(screen.getByRole('status', { name: 'Loading coins table' })).toBeInTheDocument()
    expect(container.querySelectorAll('tbody [data-slot="table-row"]')).toHaveLength(20)
  })

  it('renders an error message', () => {
    useCoinsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load coins'),
      refetch: vi.fn(),
    })

    render(<CoinTableSection />)

    expect(screen.getByText('Error: Failed to load coins')).toBeInTheDocument()
  })

  it('renders an empty state when no coins match the search', async () => {
    const user = userEvent.setup()

    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    await user.type(screen.getByRole('textbox'), 'zzz')

    await waitFor(() => expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument(), {
      timeout: 800,
    })
  })

  it('filters coins locally by name', async () => {
    const user = userEvent.setup()

    useCoinsMock.mockReturnValue({
      data: [mockCoin, mockEthereum],
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    await user.type(screen.getByRole('textbox'), 'Ethereum')

    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument()
      expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument()
    })
  })

  it('renders coin rows and table headers', () => {
    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    expect(screen.getByRole('columnheader', { name: '#' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('btc')).toBeInTheDocument()
    expect(screen.getByText('$50,000.00')).toBeInTheDocument()
    expect(screen.getByText('+2.5%')).toBeInTheDocument()
  })

  it('requests the full coin list for client-side pagination', () => {
    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    expect(useCoinsMock).toHaveBeenCalledWith({
      page: 1,
      perPage: 250,
      filters: { category: 'all' },
    })
  })

  it('updates page when pagination is used', async () => {
    const user = userEvent.setup()
    const coins = Array.from({ length: 25 }, (_, index) => ({
      ...mockCoin,
      id: `coin-${index}`,
      name: `Coin ${index}`,
      market_cap_rank: index + 1,
    }))

    useCoinsMock.mockReturnValue({
      data: coins,
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    await user.click(screen.getByRole('button', { name: '2' }))

    expect(screen.getByText('Coin 20')).toBeInTheDocument()
    expect(screen.queryByText('Coin 0')).not.toBeInTheDocument()
  })

  it('uses a fixed total page count for pagination', () => {
    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    expect(screen.getByRole('button', { name: '13' })).toBeInTheDocument()
  })

  it('refetches coins when a category filter is selected', async () => {
    const user = userEvent.setup()

    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTableSection />)

    await user.click(screen.getByRole('button', { name: 'DeFi' }))

    expect(useCoinsMock).toHaveBeenLastCalledWith({
      page: 1,
      perPage: 250,
      filters: { category: 'decentralized-finance-defi' },
    })
  })

  it('prefetches coin details on row hover', async () => {
    const user = userEvent.setup()

    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    const { container } = render(<CoinTableSection />)

    const row = container.querySelector('tbody [data-slot="table-row"]')
    expect(row).not.toBeNull()

    await user.hover(row!)

    expect(prefetchCoinMock).toHaveBeenCalledWith('bitcoin')
  })
})
