import { Activity, Fuel, ShieldCheck, Truck } from 'lucide-react'
import { useFleet } from '../../context/FleetContext'
import { formatPercent } from '../../utils/format'
import { Card, CardBody, CardHeader } from '../ui/Card'

export function FleetHealthPanel() {
  const { vehicles, dashboardStats } = useFleet()

  const active = vehicles.filter((v) => v.status === 'active').length
  const maintenance = vehicles.filter((v) => v.status === 'maintenance').length
  const lowFuel = vehicles.filter((v) => v.fuelLevel < 20).length
  const avgFuel = vehicles.length
    ? Math.round(vehicles.reduce((a, v) => a + v.fuelLevel, 0) / vehicles.length)
    : 0

  const healthScore = Math.min(
    100,
    Math.round(
      (active / vehicles.length) * 40 +
        avgFuel * 0.3 +
        (dashboardStats?.onTimeDeliveryRate ?? 90) * 0.3 -
        maintenance * 2 -
        lowFuel,
    ),
  )

  const metrics = [
    { label: 'Active units', value: `${active}/${vehicles.length}`, icon: Truck },
    { label: 'Avg fuel', value: `${avgFuel}%`, icon: Fuel },
    { label: 'On-time rate', value: formatPercent(dashboardStats?.onTimeDeliveryRate ?? 0, 1), icon: ShieldCheck },
    { label: 'In maintenance', value: maintenance, icon: Activity },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader title="Fleet health index" description="Composite operational score" />
      <CardBody>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="fleet-score-pop font-display text-4xl font-bold text-brand-600">{healthScore}</p>
            <p className="text-xs text-surface-800/50">out of 100</p>
          </div>
          <div className="h-2 flex-1 max-w-[200px] overflow-hidden rounded-full bg-surface-200 dark:bg-surface-200/20">
            <div
              className="fleet-progress-fill h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group fleet-health-metric rounded-xl border border-surface-100 bg-panel-muted px-3 py-2 dark:border-surface-200/10"
            >
              <div className="flex items-center gap-2 text-xs text-surface-800/55">
                <Icon className="size-3.5 transition-transform duration-300 group-hover:rotate-12" />
                {label}
              </div>
              <p className="mt-0.5 font-semibold text-surface-900">{value}</p>
            </div>
          ))}
        </div>
        {lowFuel > 0 ? (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
            {lowFuel} vehicle{lowFuel > 1 ? 's' : ''} below 20% fuel — dispatch recommended.
          </p>
        ) : null}
      </CardBody>
    </Card>
  )
}
