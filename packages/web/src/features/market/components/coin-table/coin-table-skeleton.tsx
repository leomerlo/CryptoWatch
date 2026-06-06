import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'

const SKELETON_ROW_COUNT = 20

const pulseClassName = 'bg-gray-800 rounded-md animate-pulse'

const CoinTableSkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className={`h-4 w-4 ${pulseClassName}`} />
    </TableCell>
    <TableCell>
      <div className="flex flex-col gap-1">
        <div className={`h-3 w-20 ${pulseClassName}`} />
        <div className={`h-2 w-8 ${pulseClassName}`} />
      </div>
    </TableCell>
    <TableCell>
      <div className={`h-4 w-16 ${pulseClassName}`} />
    </TableCell>
    <TableCell>
      <div className={`h-4 w-10 ${pulseClassName}`} />
    </TableCell>
    <TableCell>
      <div className={`h-4 w-14 ${pulseClassName}`} />
    </TableCell>
    <TableCell>
      <div className={`h-4 w-14 ${pulseClassName}`} />
    </TableCell>
    <TableCell>
      <div className={`h-8 w-16 ${pulseClassName}`} />
    </TableCell>
  </TableRow>
)

const CoinTableSkeleton = () => (
  <div className="w-full min-w-0" role="status" aria-busy="true" aria-label="Loading coins table">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h</TableHead>
          <TableHead>Mkt Cap</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>7d</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
          <CoinTableSkeletonRow key={index} />
        ))}
      </TableBody>
    </Table>
  </div>
)

export default CoinTableSkeleton
