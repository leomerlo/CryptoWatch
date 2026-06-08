import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CoinPagination from '@/features/market/components/coin-table/coin-pagination'

describe('CoinPagination', () => {
  it('renders only page 1 when totalPages is 1', () => {
    render(<CoinPagination page={1} totalPages={1} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByText('More pages')).not.toBeInTheDocument()
  })

  it('shows ellipsis for large page ranges', () => {
    render(<CoinPagination page={10} totalPages={20} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
    expect(screen.getAllByText('More pages')).toHaveLength(2)
    expect(screen.getByRole('button', { name: '10' })).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange when clicking a page number', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<CoinPagination page={1} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: '3' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when clicking next and last page controls', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<CoinPagination page={2} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    await user.click(screen.getByRole('button', { name: 'Go to last page' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(onPageChange).toHaveBeenCalledWith(5)
  })

  it('does not call onPageChange when clicking the current page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<CoinPagination page={2} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: '2' }))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange for disabled navigation on the first page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<CoinPagination page={1} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    await user.click(screen.getByRole('button', { name: 'Go to first page' }))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('disables first-page controls on page 1', () => {
    render(<CoinPagination page={1} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Go to first page' })).toHaveClass(
      'pointer-events-none'
    )
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toHaveClass(
      'pointer-events-none'
    )
  })

  it('disables last-page controls on the final page', () => {
    render(<CoinPagination page={5} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Go to next page' })).toHaveClass(
      'pointer-events-none'
    )
    expect(screen.getByRole('button', { name: 'Go to last page' })).toHaveClass(
      'pointer-events-none'
    )
  })
})
