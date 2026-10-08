import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../utils/cn'

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}) {
  if (totalItems <= pageSize) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <div
      className={cn(
        'fleet-pagination-enter flex flex-col items-center justify-between gap-3 border-t border-surface-200/80 pt-4 sm:flex-row dark:border-surface-800',
        className,
      )}
    >
      <p className="text-sm text-surface-800/60 dark:text-surface-200/60">
        Showing {from}–{to} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <span className="min-w-[5rem] text-center text-sm font-medium text-surface-800 dark:text-surface-100">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
