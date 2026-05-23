import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CoinTable from '@/features/market/components/coin-table/coin-table'
import { mockCoin, mockGlobalMarket } from '@/test/fixtures/market'

const useCoinsMock = vi.fn()
const useGlobalMarketMock = vi.fn()

vi.mock('@/features/market/api/use-coins', () => ({
  useCoins: (params: unknown) => useCoinsMock(params),
}))

vi.mock('@/features/market/api/use-global', () => ({
  useGlobalMarket: () => useGlobalMarketMock(),
}))

describe('CoinTable', () => {
  beforeEach(() => {
    useCoinsMock.mockReset()
    useGlobalMarketMock.mockReset()

    useGlobalMarketMock.mockReturnValue({
      data: mockGlobalMarket,
      isLoading: false,
      error: null,
    })
  })

  it('renders a loading state', () => {
    useCoinsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { container } = render(<CoinTable />)

    expect(screen.getByRole('status', { name: 'Loading coins table' })).toBeInTheDocument()
    expect(container.querySelectorAll('tbody [data-slot="table-row"]')).toHaveLength(20)
  })

  it('renders an error message', () => {
    useCoinsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load coins'),
    })

    render(<CoinTable />)

    expect(screen.getByText('Error: Failed to load coins')).toBeInTheDocument()
  })

  it('renders a no-data message', () => {
    useCoinsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    render(<CoinTable />)

    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders coin rows and table headers', () => {
    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTable />)

    expect(screen.getByRole('columnheader', { name: '#' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('btc')).toBeInTheDocument()
    expect(screen.getByText('$50,000.00')).toBeInTheDocument()
    expect(screen.getByText('+2.5%')).toBeInTheDocument()
  })

  it('requests coins for the current page', () => {
    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTable />)

    expect(useCoinsMock).toHaveBeenCalledWith({
      page: 1,
      filters: { category: 'all' },
    })
  })

  it('updates page when pagination is used', async () => {
    const user = userEvent.setup()

    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTable />)

    await user.click(screen.getByRole('button', { name: '2' }))

    expect(useCoinsMock).toHaveBeenLastCalledWith({
      page: 2,
      filters: { category: 'all' },
    })
  })

  it('derives total pages from global market data', () => {
    useCoinsMock.mockReturnValue({
      data: [mockCoin],
      isLoading: false,
      error: null,
    })

    render(<CoinTable />)

    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
  })
})
