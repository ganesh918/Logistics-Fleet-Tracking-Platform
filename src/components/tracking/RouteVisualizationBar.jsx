import { Route } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'
import { cn } from '../../utils/cn'

function routeMetrics(shipment) {
  if (!shipment?.route?.length) return null
  const stops = shipment.route.length
  const km = Math.round(120 + stops * 45 + (shipment.weightKg ?? 0) / 200)
  const progress =
    shipment.status === 'delivered'
      ? 100
      : shipment.status === 'picked_up'
        ? 35
        : shipment.status === 'in_transit'
          ? 68
          : shipment.status === 'delayed'
            ? 72
            : 15
  return { stops, km, progress }
}

export function RouteVisualizationBar({ shipment, showRoute, embedded = false }) {
  const m = shipment ? routeMetrics(shipment) : null

  const content = (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        embedded ? 'px-4 py-3' : '',
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-surface-900">
        <Route className="size-4 shrink-0 text-brand-600" />
        Route visualization
        {!showRoute && (
          <span className="text-xs font-normal text-surface-800/50">(hidden on map)</span>
        )}
      </div>
      {m ? (
        <div className="flex w-full flex-col gap-2 sm:max-w-lg sm:flex-1">
          <div className="flex justify-between text-xs text-surface-800/55">
            <span>
              {m.km} km · {m.stops} waypoints
            </span>
            <span>{m.progress}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-200/20">
            <div
              className="fleet-progress-fill h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
              style={{ width: `${m.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-surface-800/45">Select a shipment to view route progress.</p>
      )}
    </div>
  )

  if (embedded) {
    return (
      <div className="border-t border-surface-200/80 bg-panel-muted/80 dark:border-surface-200/10">
        {content}
      </div>
    )
  }

  if (!shipment) return null

  return (
    <Card>
      <CardBody className="py-3">{content}</CardBody>
    </Card>
  )
}
