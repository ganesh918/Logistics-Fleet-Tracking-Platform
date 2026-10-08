import { cn } from '../../utils/cn'
import { shipmentFlowLabels, shipmentProgressIndex } from '../../utils/shipmentProgress'
import { shipmentStatusLabel } from '../../utils/statusStyles'

export function ShipmentStatusTracker({ status, compact = false }) {
  const current = shipmentProgressIndex(status)
  const isCancelled = status === 'cancelled'
  const isDelayed = status === 'delayed'

  if (isCancelled) {
    return (
      <span className="text-xs font-medium text-rose-600">{shipmentStatusLabel.cancelled}</span>
    )
  }

  if (compact) {
    const steps = 4
    return (
      <div className="flex min-w-[7rem] items-center gap-0.5" title={shipmentStatusLabel[status]}>
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i <= current ? (isDelayed && i === current ? 'bg-amber-500' : 'bg-brand-500') : 'bg-surface-200',
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-wide text-surface-800/45">
        {shipmentFlowLabels.map((label, i) => (
          <span
            key={label}
            className={cn(
              'hidden flex-1 text-center sm:block',
              i <= current && 'text-brand-700',
              isDelayed && i === current && 'text-amber-700',
            )}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        {shipmentFlowLabels.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full',
              i <= current ? (isDelayed && i === current ? 'bg-amber-500' : 'bg-brand-500') : 'bg-surface-200',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-surface-800/60">
        Current: <span className="font-medium text-surface-900">{shipmentStatusLabel[status]}</span>
        {isDelayed ? ' · SLA at risk' : null}
      </p>
    </div>
  )
}
