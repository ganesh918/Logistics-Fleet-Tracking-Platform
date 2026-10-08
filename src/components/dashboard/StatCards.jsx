import { Clock, Package, Timer, Truck, Users } from 'lucide-react'
import { formatPercent } from '../../utils/format'
import { Card, CardBody } from '../ui/Card'

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card className="group overflow-hidden">
      <CardBody className="flex items-start gap-4 p-4 sm:p-5">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${accent}`}
        >
          <Icon className="size-5 transition-transform duration-300 group-hover:-rotate-6" />
        </div>
        <div>
          <p className="text-sm text-surface-800/60">{label}</p>
          <p className="font-display text-2xl font-bold tracking-tight text-surface-900 transition-transform duration-300 group-hover:translate-x-0.5">
            {value}
          </p>
          {sub ? <p className="mt-0.5 text-xs text-surface-800/50">{sub}</p> : null}
        </div>
      </CardBody>
      <div className="fleet-shimmer-line h-0.5 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  )
}

export function StatCards({ stats }) {
  return (
    <div className="fleet-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total vehicles"
        value={stats.totalVehicles}
        sub="Across all depots"
        icon={Truck}
        accent="bg-brand-100 text-brand-700"
      />
      <StatCard
        label="Active drivers"
        value={stats.totalDrivers}
        sub="Licensed & onboarded"
        icon={Users}
        accent="bg-violet-100 text-violet-700"
      />
      <StatCard
        label="Active shipments"
        value={stats.activeShipments}
        sub={`${stats.inTransitCount} in transit · ${stats.delayedCount} delayed`}
        icon={Package}
        accent="bg-emerald-100 text-emerald-700"
      />
      <StatCard
        label="On-time delivery"
        value={formatPercent(stats.onTimeDeliveryRate, 1)}
        sub={`${stats.deliveredCount} delivered (sample set)`}
        icon={Timer}
        accent="bg-amber-100 text-amber-800"
      />
    </div>
  )
}

export function ShipmentStatusStrip({ stats }) {
  const items = [
    { label: 'Delivered', value: stats.deliveredCount, color: 'bg-emerald-500' },
    { label: 'In transit', value: stats.inTransitCount, color: 'bg-brand-500' },
    { label: 'Delayed', value: stats.delayedCount, color: 'bg-amber-500' },
  ]
  const total = items.reduce((a, b) => a + b.value, 0) || 1
  return (
    <Card>
      <CardBody>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display font-semibold text-surface-900">Shipment pipeline</h3>
          <Clock className="size-4 text-surface-400 transition-transform duration-300 hover:rotate-12" />
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-surface-100">
          {items.map((item) => (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-500 hover:brightness-110`}
              style={{ width: `${(item.value / total) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-0.5">
              <span className={`size-2.5 rounded-full ${item.color} ring-2 ring-transparent transition-all hover:ring-brand-300/50`} />
              <span className="text-surface-800/70">{item.label}</span>
              <span className="font-semibold text-surface-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
