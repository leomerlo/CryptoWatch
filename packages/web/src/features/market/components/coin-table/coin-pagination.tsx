import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { cn } from '@/shared/lib/utils'

const SIBLING_COUNT = 2

type PageItem = number | 'ellipsis'

function getVisiblePages(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 1) return [1]

  const start = Math.max(2, page - SIBLING_COUNT)
  const end = Math.min(totalPages - 1, page + SIBLING_COUNT)

  const pages: PageItem[] = [1]

  if (start > 2) {
    pages.push('ellipsis')
  } else {
    for (let i = 2; i < start; i++) pages.push(i)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis')
  } else {
    for (let i = end + 1; i < totalPages; i++) pages.push(i)
  }

  if (totalPages > 1) pages.push(totalPages)

  return pages
}

const CoinPagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const visiblePages = getVisiblePages(page, totalPages)

  const goTo = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    onPageChange(nextPage)
  }

  const disabledClass = 'pointer-events-none opacity-50'

  return (
    <Pagination className="mx-0! justify-end!">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-label="Go to first page"
            onClick={() => goTo(1)}
            className={cn(page === 1 && disabledClass)}
          >
            «
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => goTo(page - 1)}
            className={cn(page === 1 && disabledClass)}
          />
        </PaginationItem>

        {visiblePages.map((item, index) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink isActive={item === page} onClick={() => goTo(item)}>
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => goTo(page + 1)}
            className={cn(page === totalPages && disabledClass)}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Go to last page"
            onClick={() => goTo(totalPages)}
            className={cn(page === totalPages && disabledClass)}
          >
            »
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default CoinPagination
