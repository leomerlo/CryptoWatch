import { memo } from 'react'

import { cn } from '@/shared/lib/utils'

type CoinSparklineProps = {
  prices: number[] | null | undefined
  positive?: boolean | null
  className?: string
  width?: number
  height?: number
}

function toPolylinePoints(prices: number[], width: number, height: number, padding = 1): string {
  if (prices.length === 0) return ''

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const innerHeight = height - padding * 2
  const step = prices.length > 1 ? width / (prices.length - 1) : 0

  return prices
    .map((price, index) => {
      const x = prices.length > 1 ? index * step : width / 2
      const y = padding + innerHeight - ((price - min) / range) * innerHeight
      return `${x},${y}`
    })
    .join(' ')
}

function CoinSparkline({
  prices,
  positive,
  className,
  width = 120,
  height = 40,
}: CoinSparklineProps) {
  const series = prices ?? []

  if (series.length === 0) {
    return (
      <span
        className={cn('inline-block text-muted-foreground', className)}
        style={{ width, height }}
        aria-hidden
      />
    )
  }

  const trendUp = positive ?? series[series.length - 1] >= series[0]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn('shrink-0', trendUp ? 'text-green-500' : 'text-red-500', className)}
      aria-hidden
    >
      <polyline
        points={toPolylinePoints(series, width, height)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default memo(CoinSparkline)
