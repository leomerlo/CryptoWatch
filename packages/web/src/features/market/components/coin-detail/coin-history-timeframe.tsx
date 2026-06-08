import type { CoinHistoryTimeframe } from '@/features/market/api/coins.keys'
import { cn } from '@/shared/lib/utils'

const TIMEFRAMES: CoinHistoryTimeframe[] = ['1h', '4h', '1d', '1w']

type CoinHistoryTimeframeProps = {
  value: CoinHistoryTimeframe
  onChange: (timeframe: CoinHistoryTimeframe) => void
}

export function CoinHistoryTimeframeSelector({ value, onChange }: CoinHistoryTimeframeProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Chart timeframe">
      {TIMEFRAMES.map((timeframe) => (
        <button
          key={timeframe}
          type="button"
          onClick={() => onChange(timeframe)}
          className={cn(
            'px-3 py-1 text-xs font-bold uppercase rounded-md border border-border',
            value === timeframe
              ? 'bg-white text-black'
              : 'bg-table-background text-gray-500 hover:text-white'
          )}
        >
          {timeframe}
        </button>
      ))}
    </div>
  )
}
