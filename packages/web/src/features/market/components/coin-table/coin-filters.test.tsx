import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CoinFilters from '@/features/market/components/coin-table/coin-filters'

describe('CoinFilters', () => {
  it('renders all category buttons', () => {
    render(<CoinFilters filters={{ category: 'all' }} setFilters={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'DeFi' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'NFTs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Layer 1' })).toBeInTheDocument()
  })

  it('calls setFilters with the selected category', async () => {
    const user = userEvent.setup()
    const setFilters = vi.fn()

    render(<CoinFilters filters={{ category: 'all' }} setFilters={setFilters} />)

    await user.click(screen.getByRole('button', { name: 'DeFi' }))

    expect(setFilters).toHaveBeenCalledWith({ category: 'decentralized-finance-defi' })
  })
})
