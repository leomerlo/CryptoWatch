import { useCoins } from '@/features/market/api/use-coins'
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
} from '@tanstack/react-table'
import { cn } from '@/shared/lib/utils'
import CoinSparkline from '@/features/market/components/coin-table/coin-sparkline'
import { formatCurrency } from '@/shared/utils'
import CoinPagination from './coin-pagination'
import { useState } from 'react'
import { useGlobalMarket } from '@/features/market/api/use-global'

const CoinTable = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useCoins({ page, filters: { category: 'all' } })

  const { data: globalData } = useGlobalMarket()

  const columnHelper = createColumnHelper<Coin>()

  const columns = [
    columnHelper.accessor('market_cap_rank', {
      header: '#',
      cell: ({ row }) => row.original.market_cap_rank,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-tight text-white">{row.original.name}</span>
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
            row.original.price_change_percentage_24h! > 0 ? 'text-green-500' : 'text-red-500'
          )}
        >
          {row.original.price_change_percentage_24h! > 0 ? '+' : ''}
          {row.original.price_change_percentage_24h!.toFixed(1)}%
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
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error?.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div className="relative overflow-x-auto flex flex-col gap-2">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CoinPagination
        page={page}
        totalPages={globalData?.totalCoins ? Math.ceil(globalData.totalCoins / 20) : 1}
        onPageChange={setPage}
      />
    </div>
  )
}

export default CoinTable
