import { Fuel, LocateFixed } from 'lucide-react'
import { vehicleStatusColor, vehicleStatusLabel } from '../../utils/statusStyles'
import { Badge } from '../ui/Badge'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { cn } from '../../utils/cn'

export function VehicleStatusList({
  vehicles,
  drivers,
  selectedVehicleId,
  onSelectVehicle,
  className,
  compact = false,
  scrollBody = true,
}) {
  return (
    <Card className={cn('flex min-h-0 flex-col', className)}>
      <CardHeader
        title="Vehicle location & status"
        description="Tap to focus on map"
        className="shrink-0"
      />
      <CardBody
        className={cn(
          compact ? 'max-h-48 space-y-2' : 'grid grid-cols-1 gap-2 sm:grid-cols-2',
          scrollBody && 'min-h-0 flex-1 overflow-y-auto overscroll-contain',
        )}
      >
        {vehicles.length === 0 ? (
          <p className="col-span-full text-sm text-surface-800/50">No vehicles to display.</p>
        ) : (
          vehicles.map((v) => {
            const driver = drivers.find((d) => d.id === v.assignedDriverId)
            const selected = v.id === selectedVehicleId
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVehicle(v.id)}
                className={cn(
                  'min-w-0 w-full rounded-xl border p-2.5 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]',
                  selected
                    ? 'border-brand-500/50 bg-brand-50/80 ring-1 ring-brand-500/25 dark:bg-brand-950/30'
                    : 'border-surface-100 hover:border-brand-400/50 hover:bg-brand-50/40 dark:border-surface-200/10 dark:hover:bg-brand-950/20',
                )}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <p className="truncate text-sm font-semibold text-surface-900">{v.plateNumber}</p>
                  <Badge className={cn('shrink-0 text-[10px]', vehicleStatusColor[v.status])}>
                    {vehicleStatusLabel[v.status]}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-surface-800/60">
                  <LocateFixed className="size-3 shrink-0 text-brand-600" />
                  <span className="truncate">{v.currentLocation.label ?? 'Unknown hub'}</span>
                </p>
                {!compact && (
                  <>
                    <p className="font-mono text-[10px] text-surface-800/40">
                      {v.currentLocation.lat.toFixed(4)}, {v.currentLocation.lng.toFixed(4)}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-surface-800/55">
                      <span className="inline-flex items-center gap-1">
                        <Fuel className="size-3" /> {v.fuelLevel}%
                      </span>
                      {driver ? (
                        <span className="truncate">
                          {driver.firstName} {driver.lastName}
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
              </button>
            )
          })
        )}
      </CardBody>
    </Card>
  )
}
