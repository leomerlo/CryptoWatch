import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CoinTable from '@/features/market/components/coin-table/coin-table'
import { mockCoin } from '@/test/fixtures/market'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>,
}))

const defaultProps = {
  data: [mockCoin],
  sorting: [] as const,
  onSortingChange: vi.fn(),
  page: 1,
  perPage: 20,
}

describe('CoinTable', () => {
  it('renders coin rows and table headers', () => {
    render(<CoinTable {...defaultProps} />)

    expect(screen.getByRole('columnheader', { name: '#' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('btc')).toBeInTheDocument()
    expect(screen.getByText('$50,000.00')).toBeInTheDocument()
    expect(screen.getByText('+2.5%')).toBeInTheDocument()
  })

  it('renders an empty state when data is empty', () => {
    const { container } = render(<CoinTable {...defaultProps} data={[]} />)

    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument()
    expect(container.querySelector('tbody [data-slot="table-row"]')).toBeInTheDocument()
  })

  it('shows rows for the current page slice', () => {
    const coins = Array.from({ length: 25 }, (_, index) => ({
      ...mockCoin,
      id: `coin-${index}`,
      name: `Coin ${index}`,
      market_cap_rank: index + 1,
    }))

    const { rerender } = render(<CoinTable {...defaultProps} data={coins} page={1} perPage={20} />)

    expect(screen.getByText('Coin 0')).toBeInTheDocument()
    expect(screen.queryByText('Coin 20')).not.toBeInTheDocument()

    rerender(<CoinTable {...defaultProps} data={coins} page={2} perPage={20} />)

    expect(screen.getByText('Coin 20')).toBeInTheDocument()
    expect(screen.queryByText('Coin 0')).not.toBeInTheDocument()
  })

  it('calls onRowHover with coin id on row hover', async () => {
    const user = userEvent.setup()
    const onRowHover = vi.fn()

    const { container } = render(<CoinTable {...defaultProps} onRowHover={onRowHover} />)

    const row = container.querySelector('tbody [data-slot="table-row"]')
    expect(row).not.toBeNull()

    await user.hover(row!)

    expect(onRowHover).toHaveBeenCalledWith('bitcoin')
  })
})
