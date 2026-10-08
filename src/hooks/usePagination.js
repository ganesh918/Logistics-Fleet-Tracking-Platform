import { useMemo, useState } from 'react'

export function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const safePage = Math.min(page, totalPages)

  const slice = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages))

  return {
    page: safePage,
    totalPages,
    pageSize,
    totalItems: items.length,
    items: slice,
    goToPage,
    nextPage: () => goToPage(safePage + 1),
    prevPage: () => goToPage(safePage - 1),
    reset: () => setPage(1),
  }
}
