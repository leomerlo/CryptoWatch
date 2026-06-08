import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CoinOhlcCandle } from '@/features/market/types/coin'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'

type CoinOhlcChartProps = {
  candles: CoinOhlcCandle[]
  className?: string
  /** Fixed chart height in px. Width follows the container. */
  height?: number
  /** Override width (e.g. tests). When omitted, width is measured from the container. */
  width?: number
}

const MARGIN = { top: 12, right: 12, bottom: 36, left: 64 }
const Y_TICK_COUNT = 5
const X_TICK_COUNT = 5
const AXIS_COLOR = '#374151'
const GRID_COLOR = '#1f2937'
const LABEL_COLOR = '#9ca3af'

function formatAxisDate(timestamp: number, spanMs: number): string {
  const date = new Date(timestamp)
  if (spanMs <= 2 * 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  if (spanMs <= 90 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

function pickTickIndices(length: number, count: number): number[] {
  if (length <= 1) return [0]
  const ticks = new Set<number>()
  for (let i = 0; i < count; i++) {
    ticks.add(Math.round((i / (count - 1)) * (length - 1)))
  }
  return [...ticks].sort((a, b) => a - b)
}

function CoinOhlcChart({
  candles,
  className,
  height = 240,
  width: widthOverride,
}: CoinOhlcChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(0)

  useLayoutEffect(() => {
    if (widthOverride != null) return

    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth
      setMeasuredWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [widthOverride])

  const chartWidth = widthOverride ?? measuredWidth

  const chart = useMemo(() => {
    if (candles.length === 0 || chartWidth <= 0) return null

    const plotLeft = MARGIN.left
    const plotTop = MARGIN.top
    const plotWidth = chartWidth - MARGIN.left - MARGIN.right
    const plotHeight = height - MARGIN.top - MARGIN.bottom

    const lows = candles.map((c) => c.low)
    const highs = candles.map((c) => c.high)
    const min = Math.min(...lows)
    const max = Math.max(...highs)
    const range = max - min || 1

    const yTicks = Array.from(
      { length: Y_TICK_COUNT },
      (_, i) => min + (range * i) / (Y_TICK_COUNT - 1)
    )
    const xTickIndices = pickTickIndices(candles.length, X_TICK_COUNT)
    const timeSpan = candles[candles.length - 1].timestamp - candles[0].timestamp

    const barWidth = plotWidth / candles.length
    const bodyWidth = Math.max(1, barWidth * 0.6)

    const y = (price: number) => plotTop + plotHeight - ((price - min) / range) * plotHeight

    return {
      plotLeft,
      plotTop,
      plotWidth,
      plotHeight,
      barWidth,
      bodyWidth,
      yTicks,
      xTickIndices,
      timeSpan,
      y,
    }
  }, [candles, chartWidth, height])

  const wrapperClassName = cn('w-full', className)

  if (candles.length === 0) {
    return (
      <div
        className={cn(
          wrapperClassName,
          'flex items-center justify-center text-muted-foreground text-sm'
        )}
        style={{ height }}
      >
        No chart data
      </div>
    )
  }

  if (!chart) {
    return <div ref={containerRef} className={wrapperClassName} style={{ height }} aria-hidden />
  }

  const {
    plotLeft,
    plotTop,
    plotWidth,
    plotHeight,
    barWidth,
    bodyWidth,
    yTicks,
    xTickIndices,
    timeSpan,
    y,
  } = chart

  const plotRight = plotLeft + plotWidth
  const plotBottom = plotTop + plotHeight

  return (
    <div ref={containerRef} className={wrapperClassName} style={{ height }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="block h-full w-full"
        role="img"
        aria-label="Price candlestick chart"
      >
        {yTicks.map((price) => {
          const yPos = y(price)
          return (
            <g key={price}>
              <line
                x1={plotLeft}
                x2={plotRight}
                y1={yPos}
                y2={yPos}
                stroke={GRID_COLOR}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={plotLeft - 8}
                y={yPos}
                textAnchor="end"
                dominantBaseline="middle"
                fill={LABEL_COLOR}
                fontSize="10"
              >
                {formatCurrency(price, 'USD', true)}
              </text>
            </g>
          )
        })}

        <line
          x1={plotLeft}
          x2={plotRight}
          y1={plotBottom}
          y2={plotBottom}
          stroke={AXIS_COLOR}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={plotLeft}
          x2={plotLeft}
          y1={plotTop}
          y2={plotBottom}
          stroke={AXIS_COLOR}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {candles.map((candle, index) => {
          const centerX = plotLeft + index * barWidth + barWidth / 2
          const openY = y(candle.open)
          const closeY = y(candle.close)
          const highY = y(candle.high)
          const lowY = y(candle.low)
          const bullish = candle.close >= candle.open
          const color = bullish ? '#22c55e' : '#ef4444'
          const bodyTop = Math.min(openY, closeY)
          const bodyHeight = Math.max(1, Math.abs(closeY - openY))

          return (
            <g key={candle.timestamp}>
              <line
                x1={centerX}
                x2={centerX}
                y1={highY}
                y2={lowY}
                stroke={color}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={centerX - bodyWidth / 2}
                y={bodyTop}
                width={bodyWidth}
                height={bodyHeight}
                fill={color}
              />
            </g>
          )
        })}

        {xTickIndices.map((index) => {
          const candle = candles[index]
          const xPos = plotLeft + index * barWidth + barWidth / 2
          return (
            <text
              key={candle.timestamp}
              x={xPos}
              y={plotBottom + 20}
              textAnchor="middle"
              fill={LABEL_COLOR}
              fontSize="10"
            >
              {formatAxisDate(candle.timestamp, timeSpan)}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default memo(CoinOhlcChart)
