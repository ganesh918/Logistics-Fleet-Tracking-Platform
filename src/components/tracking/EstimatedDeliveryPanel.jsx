import { CalendarClock, Timer, Truck } from 'lucide-react'
import { differenceInMinutes, parseISO } from 'date-fns'
import { formatDateTime } from '../../utils/format'
import { shipmentStatusColor, shipmentStatusLabel } from '../../utils/statusStyles'
import { Badge } from '../ui/Badge'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { cn } from '../../utils/cn'
import { PickupDeliveryStops } from './PickupDeliveryPanel'

function etaParts(iso) {
  try {
    const mins = differenceInMinutes(parseISO(iso), new Date())
    if (mins <= 0) return { label: 'Arriving now', sub: 'Driver approaching destination', urgent: false }
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return {
      label: h > 0 ? `${h}h ${m}m` : `${m} min`,
      sub: 'Estimated time to delivery',
      urgent: mins < 60,
    }
  } catch {
    return { label: '—', sub: 'ETA unavailable', urgent: false }
  }
}

export function EstimatedDeliveryPanel({ shipment, driverName, vehiclePlate, className }) {
  if (!shipment) {
    return (
      <Card className={cn('flex h-full flex-col', className)}>
        <CardHeader title="Estimated delivery" description="Select a shipment to view ETA" />
        <CardBody className="flex flex-1 flex-col gap-4">
          <p className="text-sm text-surface-800/55">
            Choose an active shipment to see delivery window, countdown, and route on the map.
          </p>
          <div className="border-t border-surface-100 pt-4 dark:border-surface-200/15">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
              Pickup & delivery
            </p>
            <PickupDeliveryStops shipment={null} />
          </div>
        </CardBody>
      </Card>
    )
  }

  const eta = etaParts(shipment.estimatedDeliveryAt)

  return (
    <Card
      className={cn(
        'flex h-full flex-col border-brand-500/15 bg-gradient-to-br from-brand-50/80 to-panel dark:from-brand-950/35 dark:to-panel',
        className,
      )}
    >
      <CardHeader
        title="Estimated delivery"
        description={shipment.referenceCode}
        action={
          <Badge className={shipmentStatusColor[shipment.status]}>
            {shipmentStatusLabel[shipment.status]}
          </Badge>
        }
      />
      <CardBody className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
              eta.urgent ? 'bg-accent-500/15 text-accent-600' : 'bg-brand-600/10 text-brand-700'
            }`}
          >
            <Timer className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-bold tracking-tight text-surface-900">{eta.label}</p>
            <p className="text-xs text-surface-800/55">{eta.sub}</p>
          </div>
        </div>

        <div className="grid gap-1.5 text-xs sm:text-sm">
          <p className="flex items-start gap-2 text-surface-800/70">
            <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-brand-600 sm:size-4" />
            <span>
              <span className="font-medium text-surface-900">Scheduled: </span>
              {formatDateTime(shipment.delivery.scheduledAt)}
            </span>
          </p>
          <p className="flex items-start gap-2 text-surface-800/70">
            <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-brand-600 sm:size-4" />
            <span>
              <span className="font-medium text-surface-900">Current ETA: </span>
              {formatDateTime(shipment.estimatedDeliveryAt)}
            </span>
          </p>
          {(driverName || vehiclePlate) && (
            <p className="flex items-start gap-2 text-surface-800/70">
              <Truck className="mt-0.5 size-3.5 shrink-0 text-brand-600 sm:size-4" />
              <span>
                {driverName && <span className="font-medium">{driverName}</span>}
                {driverName && vehiclePlate && ' · '}
                {vehiclePlate && <span>{vehiclePlate}</span>}
              </span>
            </p>
          )}
        </div>

        <div className="border-t border-surface-100 pt-4 dark:border-surface-200/15">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
            Pickup & delivery
          </p>
          <PickupDeliveryStops shipment={shipment} stopsClassName="grid-cols-1 md:grid-cols-2" />
        </div>
      </CardBody>
    </Card>
  )
}
