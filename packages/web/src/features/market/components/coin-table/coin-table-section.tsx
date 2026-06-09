import { useCoins } from '@/features/market/api/use-coins'
import { usePrefetchCoin } from '@/features/market/api/use-prefetch-coin'
import CoinFilters from '@/features/market/components/coin-table/coin-filters'
import CoinPagination from '@/features/market/components/coin-table/coin-pagination'
import CoinSearch from '@/features/market/components/coin-table/coin-search'
import CoinTable from '@/features/market/components/coin-table/coin-table'
import CoinTableSkeleton from '@/features/market/components/coin-table/coin-table-skeleton'
import { CoinUpdateCountdown } from '@/features/market/components/coin-table/coin-update-countdown'
import { ErrorState } from '@/shared/components/ui/error-state'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAppStore } from '@/stores'
import { useMemo, useState } from 'react'

const TOTAL_QUERY = 250
const PER_PAGE = 20

export const CoinTableSection = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, unknown>>({ category: 'all' })
  const marketSorting = useAppStore((s) => s.marketSorting)
  const setMarketSorting = useAppStore((s) => s.setMarketSorting)
  const currency = useAppStore((s) => s.currency)
  const autoRefresh = useAppStore((s) => s.autoRefresh)
  const { data, isLoading, error, dataUpdatedAt, refetch } = useCoins({
    page: 1,
    perPage: TOTAL_QUERY,
    filters,
    currency,
    refetchInterval: autoRefresh,
  })
  const prefetchCoin = usePrefetchCoin()
  const debouncedSearch = useDebounce(search, 500)

  const filtered = useMemo(() => {
    const coins = data ?? []
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return coins
    return coins.filter((coin) => coin.name.toLowerCase().includes(query))
  }, [data, debouncedSearch])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFiltersChange = (next: Record<string, unknown>) => {
    setFilters(next)
    setPage(1)
  }

  const handleSortingChange = (updater: Parameters<typeof setMarketSorting>[0]) => {
    setPage(1)
    setMarketSorting(updater)
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load market data"
        description="Could not fetch market data. This might be a rate limit or network issue."
        errorDetail={`Error: ${error.message}`}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <section className="flex w-full min-w-0 flex-col gap-2">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 shrink-0">
          <CoinFilters filters={filters} setFilters={handleFiltersChange} />
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <CoinSearch search={search} setSearch={handleSearchChange} />
          {dataUpdatedAt && (
            <CoinUpdateCountdown
              key={dataUpdatedAt}
              resetAt={dataUpdatedAt}
              durationMs={autoRefresh * 1000}
            />
          )}
        </div>
      </div>
      {isLoading ? (
        <CoinTableSkeleton />
      ) : (
        <>
          <CoinTable
            data={filtered}
            sorting={marketSorting}
            onSortingChange={handleSortingChange}
            page={page}
            perPage={PER_PAGE}
            onRowHover={prefetchCoin}
          />
          <CoinPagination
            page={page}
            totalPages={Math.ceil(TOTAL_QUERY / PER_PAGE)}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  )
}

export default CoinTableSection
