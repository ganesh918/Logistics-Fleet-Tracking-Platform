import { cn } from '../../utils/cn'

export function Card({ className, children, interactive = false }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-200/80 bg-panel shadow-sm shadow-surface-900/5 dark:border-surface-200/20 dark:shadow-black/20',
        interactive ? 'fleet-card-interactive' : 'fleet-card',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-surface-100 px-5 py-4 dark:border-surface-200/15',
        className,
      )}
    >
      <div>
        <h3 className="font-display text-base font-semibold text-surface-900">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-sm text-surface-800/60 dark:text-surface-800/70">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>
}
