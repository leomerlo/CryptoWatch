import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import CoinOhlcChart from '@/features/market/components/coin-detail/coin-ohlc-chart'
import { mockCoinOhlc } from '@/test/fixtures/market'

describe('CoinOhlcChart', () => {
  it('renders empty state when there are no candles', () => {
    render(<CoinOhlcChart candles={[]} />)
    expect(screen.getByText('No chart data')).toBeInTheDocument()
  })

  it('renders axis labels for price and time', () => {
    const { container } = render(<CoinOhlcChart candles={mockCoinOhlc} width={400} height={200} />)

    const labels = container.querySelectorAll('text')
    expect(labels.length).toBeGreaterThanOrEqual(8)
    expect(container.querySelector('[aria-label="Price candlestick chart"]')).toBeInTheDocument()
  })
})
