import { useCoins } from '@/features/market/api/use-coins'
import { usePrefetchCoin } from '@/features/market/api/use-prefetch-coin'
import type { Coin } from '@/features/market/types/coin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table'
import { cn } from '@/shared/lib/utils'
import CoinSparkline from '@/features/market/components/coin-table/coin-sparkline'
import { formatCurrency } from '@/shared/utils'
import CoinPagination from '@/features/market/components/coin-table/coin-pagination'
import CoinTableSkeleton from '@/features/market/components/coin-table/coin-table-skeleton'
import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { EyeIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import CoinFilters from '@/features/market/components/coin-table/coin-filters'
import CoinSearch from './coin-search'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAppStore } from '@/stores'

const CoinTable = () => {
  const TOTAL_QUERY = 250
  const PER_PAGE = 20
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [coins, setCoins] = useState<Coin[]>([])
  const [filters, setFilters] = useState<Record<string, unknown>>({ category: 'all' })
  const marketSorting = useAppStore((s) => s.marketSorting)
  const setMarketSorting = useAppStore((s) => s.setMarketSorting)
  const { data, isLoading, error } = useCoins({ page: 1, perPage: TOTAL_QUERY, filters })
  const prefetchCoin = usePrefetchCoin()
  const debouncedSearch = useDebounce(search, 500)

  const filtered = useMemo(() => {
    if (!debouncedSearch) return coins ?? []
    setPage(1)
    return (coins ?? []).filter((coin) =>
      coin.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [coins, debouncedSearch])

  useEffect(() => {
    if (!data) return
    setCoins(data)
  }, [data])

  const columnHelper = createColumnHelper<Coin>()

  const columns = [
    columnHelper.accessor('market_cap_rank', {
      header: '#',
      cell: ({ row }) => row.original.market_cap_rank ?? '—',
      sortDescFirst: true,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link to={`/coins/$coinId`} params={{ coinId: row.original.id }}>
            <span className="text-xs font-bold tracking-tight text-white underline block overflow-hidden text-ellipsis whitespace-nowrap">
              {row.original.name}
            </span>
          </Link>
          <span className="text-2xs font-normal text-gray-500 uppercase">
            {row.original.symbol}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('current_price', {
      header: 'Price',
      cell: ({ row }) => (
        <span className="text-white font-bold tracking-tight">
          {formatCurrency(row.original.current_price, 'USD')}
        </span>
      ),
    }),
    columnHelper.accessor('price_change_percentage_24h', {
      header: '24h',
      cell: ({ row }) => (
        <span
          className={cn(
            'font-bold',
            row.original.price_change_percentage_24h && row.original.price_change_percentage_24h > 0
              ? 'text-green-500'
              : 'text-red-500'
          )}
        >
          {row.original.price_change_percentage_24h && row.original.price_change_percentage_24h > 0
            ? '+'
            : ''}
          {row.original.price_change_percentage_24h &&
            row.original.price_change_percentage_24h.toFixed(1)}
          %
        </span>
      ),
    }),
    columnHelper.accessor('market_cap', {
      header: 'Mkt Cap',
      cell: ({ row }) => (
        <span className="tracking-tight">
          {formatCurrency(row.original.market_cap, 'USD', true)}
        </span>
      ),
    }),
    columnHelper.accessor('total_volume', {
      header: 'Volume',
      cell: ({ row }) => (
        <span className="text-xs tracking-tight">
          {formatCurrency(row.original.total_volume, 'USD', true)}
        </span>
      ),
    }),
    columnHelper.accessor('sparkline_in_7d', {
      header: '7d',
      cell: ({ row }) => (
        <CoinSparkline
          prices={row.original.sparkline_in_7d?.price}
          positive={
            row.original.price_change_percentage_24h != null
              ? row.original.price_change_percentage_24h >= 0
              : null
          }
        />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Link to={`/coins/$coinId`} params={{ coinId: row.original.id }}>
          <Button variant="ghost" size="icon">
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Link>
      ),
    }),
  ]

  const table = useReactTable({
    data: filtered ?? [],
    columns,
    state: { sorting: marketSorting },
    onSortingChange: (updater) => {
      setPage(1)
      setMarketSorting(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const paginatedRows = table.getRowModel().rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (error) return <div>Error: {error?.message}</div>

  return (
    <div className="relative overflow-x-auto flex flex-col gap-2">
      <div className="flex justify-between">
        <div>
          <CoinFilters filters={filters} setFilters={setFilters} />
        </div>
        <div>
          <CoinSearch search={search} setSearch={setSearch} />
        </div>
      </div>
      {isLoading ? (
        <CoinTableSkeleton />
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.id === 'name' && 'w-48 max-w-48',
                        header.column.id === 'market_cap_rank' && 'w-12 max-w-12',
                        header.column.id === 'current_price' && 'w-24 max-w-24',
                        header.column.getCanSort() && 'cursor-pointer select-none'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === 'asc'
                          ? ' ↑'
                          : ' ↓'
                        : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-48">
                    <div className="flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-full">
                        <SearchIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow key={row.id} onMouseEnter={() => prefetchCoin(row.original.id)}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(cell.column.id === 'name' && 'w-64 max-w-64')}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <CoinPagination
            page={page}
            totalPages={Math.ceil(TOTAL_QUERY / PER_PAGE)}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

export default CoinTable
