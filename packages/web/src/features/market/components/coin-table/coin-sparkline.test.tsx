import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import CoinSparkline from '@/features/market/components/coin-table/coin-sparkline'

describe('CoinSparkline', () => {
  it('renders a placeholder when prices are empty', () => {
    const { container } = render(<CoinSparkline prices={[]} />)

    expect(container.querySelector('svg')).not.toBeInTheDocument()
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders a sparkline svg when prices are provided', () => {
    const { container } = render(<CoinSparkline prices={[10, 20, 15]} />)

    const svg = container.querySelector('svg')
    const polyline = container.querySelector('polyline')

    expect(svg).toBeInTheDocument()
    expect(polyline).toHaveAttribute('points')
  })

  it('uses green styling when positive is true', () => {
    const { container } = render(<CoinSparkline prices={[10, 5, 15]} positive />)

    expect(container.querySelector('svg')).toHaveClass('text-green-500')
  })

  it('uses red styling when positive is false', () => {
    const { container } = render(<CoinSparkline prices={[10, 20, 15]} positive={false} />)

    expect(container.querySelector('svg')).toHaveClass('text-red-500')
  })

  it('infers trend from first and last price when positive is not provided', () => {
    const { container, rerender } = render(<CoinSparkline prices={[10, 15, 20]} />)
    expect(container.querySelector('svg')).toHaveClass('text-green-500')

    rerender(<CoinSparkline prices={[20, 15, 10]} />)
    expect(container.querySelector('svg')).toHaveClass('text-red-500')
  })

  it('respects custom dimensions', () => {
    const { container } = render(<CoinSparkline prices={[1, 2, 3]} width={80} height={24} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '80')
    expect(svg).toHaveAttribute('height', '24')
  })
})
