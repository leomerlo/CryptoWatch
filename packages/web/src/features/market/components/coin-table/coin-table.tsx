import type { Coin } from '@/features/market/types/coin'
import CoinSparkline from '@/features/market/components/coin-table/coin-sparkline'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'
import { Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table'
import { EyeIcon, SearchIcon } from 'lucide-react'

export type CoinTableProps = {
  data: Coin[]
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  page: number
  perPage: number
  onRowHover?: (coinId: string) => void
}

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
        <span className="text-2xs font-normal text-gray-500 uppercase">{row.original.symbol}</span>
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
      <span className="tracking-tight">{formatCurrency(row.original.market_cap, 'USD', true)}</span>
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

const CoinTable = ({
  data,
  sorting,
  onSortingChange,
  page,
  perPage,
  onRowHover,
}: CoinTableProps) => {
  // TanStack Table returns unstable function refs; safe to use here without memoization.
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const paginatedRows = table.getRowModel().rows.slice((page - 1) * perPage, page * perPage)

  return (
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
            <TableRow key={row.id} onMouseEnter={() => onRowHover?.(row.original.id)}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(cell.column.id === 'name' && 'w-48 max-w-48')}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default CoinTable
