import { MapPin, PackageCheck, PackageOpen } from 'lucide-react'
import { formatDateTime } from '../../utils/format'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { cn } from '../../utils/cn'

function StopCard({ type, address, lat, lng, timeLabel, time }) {
  const isPickup = type === 'pickup'
  return (
    <div
      className={cn(
        'rounded-xl border p-3',
        isPickup
          ? 'border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/25'
          : 'border-amber-200/70 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/25',
      )}
    >
      <div
        className={cn(
          'mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide',
          isPickup ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300',
        )}
      >
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded text-[10px] font-bold text-white',
            isPickup ? 'bg-emerald-500' : 'bg-amber-500',
          )}
        >
          {isPickup ? 'P' : 'D'}
        </span>
        {isPickup ? <PackageOpen className="size-3.5" /> : <PackageCheck className="size-3.5" />}
        {isPickup ? 'Pickup point' : 'Delivery point'}
      </div>
      <p className="text-sm font-medium leading-snug text-surface-900">{address}</p>
      <p className="mt-1 font-mono text-[11px] text-surface-800/45">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </p>
      <p className="mt-1.5 text-xs text-surface-800/55">
        {timeLabel}: {formatDateTime(time)}
      </p>
    </div>
  )
}

export function PickupDeliveryStops({ shipment, className, stopsClassName }) {
  if (!shipment) {
    return (
      <p className={cn('text-sm text-surface-800/55', className)}>
        Select a shipment to view pickup and delivery stops.
      </p>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('grid gap-3', stopsClassName ?? 'sm:grid-cols-2')}>
        <StopCard
          type="pickup"
          address={shipment.pickup.address}
          lat={shipment.pickup.lat}
          lng={shipment.pickup.lng}
          timeLabel="Scheduled"
          time={shipment.pickup.scheduledAt}
        />
        <StopCard
          type="delivery"
          address={shipment.delivery.address}
          lat={shipment.delivery.lat}
          lng={shipment.delivery.lng}
          timeLabel="Window"
          time={shipment.delivery.scheduledAt}
        />
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-surface-800/45">
        <MapPin className="size-3.5 shrink-0" />
        Stops align with markers on the live map.
      </p>
    </div>
  )
}

export function PickupDeliveryPanel({ shipment, className }) {
  return (
    <Card className={cn('flex h-full min-h-0 flex-col', className)}>
      <CardHeader title="Pickup & delivery" description="Map markers P · D" />
      <CardBody>
        <PickupDeliveryStops shipment={shipment} stopsClassName="grid-cols-1" />
      </CardBody>
    </Card>
  )
}
