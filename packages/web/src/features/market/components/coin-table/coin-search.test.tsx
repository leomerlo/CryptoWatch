import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CoinSearch from '@/features/market/components/coin-table/coin-search'

describe('CoinSearch', () => {
  it('renders a search input with the current value', () => {
    render(<CoinSearch search="btc" setSearch={vi.fn()} />)

    expect(screen.getByRole('textbox')).toHaveValue('btc')
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('calls setSearch when the input changes', async () => {
    const user = userEvent.setup()
    const setSearch = vi.fn()

    render(<CoinSearch search="" setSearch={setSearch} />)

    await user.type(screen.getByRole('textbox'), 'eth')

    expect(setSearch).toHaveBeenCalled()
    expect(setSearch.mock.calls.map(([value]) => value).join('')).toBe('eth')
  })
})
