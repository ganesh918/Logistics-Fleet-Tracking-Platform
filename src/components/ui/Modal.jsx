import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export function Modal({ open, onClose, title, description, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="fleet-modal-backdrop absolute inset-0 bg-surface-950/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'fleet-modal-panel relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-panel shadow-2xl',
          widths[size],
        )}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-surface-100 bg-panel/95 px-5 py-4 backdrop-blur-sm dark:border-surface-200/15">
          <div>
            <h2 id="modal-title" className="font-display text-lg font-semibold text-surface-900">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-surface-800/60">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
