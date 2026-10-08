import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function PageLoader({ label = 'Loading fleet data…' }) {
  return (
    <div className="fleet-empty-enter flex min-h-[40vh] flex-col items-center justify-center gap-4 text-surface-800/70">
      <div className="fleet-loader-ring" aria-hidden />
      <p className="animate-pulse text-sm">{label}</p>
    </div>
  )
}

export function PageError({ message, onRetry }) {
  return (
    <div className="fleet-empty-enter flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="fleet-empty-float flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="size-7 transition-transform duration-300 hover:rotate-12" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-surface-900">Something went wrong</h3>
        <p className="mt-1 max-w-md text-sm text-surface-800/60">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      ) : null}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="fleet-empty-enter flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="fleet-empty-float flex size-14 items-center justify-center rounded-2xl bg-surface-100 text-surface-800/50">
        <Inbox className="size-7" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-surface-900">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-sm text-sm text-surface-800/60">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-surface-200/80 via-surface-100/90 to-surface-200/80 bg-[length:200%_100%] ${className ?? ''}`}
      style={{ animation: 'fleet-shimmer 1.8s ease-in-out infinite' }}
    />
  )
}
