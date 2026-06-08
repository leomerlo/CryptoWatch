const pulseClassName = 'bg-gray-800 rounded-md animate-pulse'

const StatCardSkeleton = () => (
  <div className="flex-1 min-w-[140px] py-2 px-4 border border-border rounded-lg bg-table-background flex flex-col gap-2">
    <div className={`h-3 w-20 ${pulseClassName}`} />
    <div className={`h-5 w-24 ${pulseClassName}`} />
    <div className={`h-3 w-16 ${pulseClassName}`} />
  </div>
)

export const CoinChartSkeleton = () => (
  <div
    className={`h-60 w-full ${pulseClassName}`}
    role="status"
    aria-busy="true"
    aria-label="Loading chart"
  />
)

const CoinPageSkeleton = () => (
  <div
    className="flex flex-col gap-6"
    role="status"
    aria-busy="true"
    aria-label="Loading coin details"
  >
    <div className="mt-4">
      <div className={`h-4 w-28 ${pulseClassName}`} />
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full shrink-0 ${pulseClassName}`} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={`h-7 w-32 ${pulseClassName}`} />
            <div className={`h-4 w-10 ${pulseClassName}`} />
            <div className={`h-3 w-14 ${pulseClassName}`} />
          </div>
          <div className={`h-10 w-40 ${pulseClassName}`} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`h-8 w-24 ${pulseClassName}`} />
        <div className={`h-8 w-20 ${pulseClassName}`} />
      </div>
    </div>

    <div className="flex flex-col gap-3 border border-border rounded-lg bg-table-background p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className={`h-6 w-28 ${pulseClassName}`} />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={`h-7 w-10 ${pulseClassName}`} />
          ))}
        </div>
      </div>
      <CoinChartSkeleton />
    </div>

    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 6 }, (_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  </div>
)

export default CoinPageSkeleton
