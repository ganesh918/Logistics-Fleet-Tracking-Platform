import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

const styles = {
  success: {
    wrap: 'border-emerald-200/80 bg-emerald-50/95 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/90 dark:text-emerald-100',
    icon: 'text-emerald-600 dark:text-emerald-400',
    Icon: CheckCircle2,
  },
  error: {
    wrap: 'border-rose-200/80 bg-rose-50/95 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/90 dark:text-rose-100',
    icon: 'text-rose-600 dark:text-rose-400',
    Icon: AlertCircle,
  },
  info: {
    wrap: 'border-brand-200/80 bg-brand-50/95 text-brand-950 dark:border-brand-800/40 dark:bg-brand-950/90 dark:text-brand-100',
    icon: 'text-brand-600 dark:text-brand-400',
    Icon: Info,
  },
}

export function Toaster({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:right-6 sm:top-6"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const cfg = styles[t.variant] ?? styles.info
        const Icon = cfg.Icon
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto fleet-modal-panel flex gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md',
              cfg.wrap,
            )}
            role="status"
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', cfg.icon)} aria-hidden />
            <div className="min-w-0 flex-1">
              {t.title ? <p className="text-sm font-semibold">{t.title}</p> : null}
              <p className={cn('text-sm', t.title && 'mt-0.5 opacity-90')}>{t.message}</p>
            </div>
            <button
              type="button"
              className="fleet-icon-btn shrink-0 p-1 opacity-70 hover:opacity-100"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(t.id)}
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
