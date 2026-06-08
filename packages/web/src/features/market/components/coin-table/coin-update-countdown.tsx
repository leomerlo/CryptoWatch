import { cn } from '@/shared/lib/utils'
import { useEffect, useState } from 'react'

type CoinUpdateCountdownProps = {
  /** Timestamp (ms) when data was last updated; drives the countdown reset */
  resetAt: number
  /** Full cycle duration in milliseconds */
  durationMs?: number
  size?: number
  className?: string
}

const STROKE_WIDTH = 2

export function CoinUpdateCountdown({
  resetAt,
  durationMs = 60_000,
  size = 20,
  className,
}: CoinUpdateCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(durationMs)

  useEffect(() => {
    const tick = () => {
      setRemainingMs(Math.max(0, durationMs - (Date.now() - resetAt)))
    }

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [resetAt, durationMs])

  const radius = (size - STROKE_WIDTH) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, Math.max(0, remainingMs / durationMs))
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('-rotate-90', className)}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-muted"
        strokeWidth={STROKE_WIDTH}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  )
}
