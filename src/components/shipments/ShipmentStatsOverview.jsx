import { AlertTriangle, CheckCircle2, Clock, Package, Truck } from 'lucide-react'
import { useMemo } from 'react'
import { shipmentStatusLabel } from '../../utils/statusStyles'
import { Card, CardBody } from '../ui/Card'

function StatTile({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card className="overflow-hidden">
      <CardBody className="flex items-start gap-3 p-4">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-surface-800/50">{label}</p>
          <p className="font-display text-2xl font-bold text-surface-900">{value}</p>
          {sub ? <p className="mt-0.5 text-xs text-surface-800/55">{sub}</p> : null}
        </div>
      </CardBody>
    </Card>
  )
}

export function ShipmentStatsOverview({ shipments }) {
  const stats = useMemo(() => {
    const active = shipments.filter((s) =>
      ['pending', 'picked_up', 'in_transit', 'delayed'].includes(s.status),
    ).length
    const inTransit = shipments.filter((s) => s.status === 'in_transit').length
    const delayed = shipments.filter((s) => s.status === 'delayed').length
    const delivered = shipments.filter((s) => s.status === 'delivered').length
    const pending = shipments.filter((s) => s.status === 'pending').length
    return { total: shipments.length, active, inTransit, delayed, delivered, pending }
  }, [shipments])

  return (
    <div className="fleet-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <StatTile
        label="Total shipments"
        value={stats.total}
        sub="Create & manage lifecycle"
        icon={Package}
        accent="bg-brand-100 text-brand-700"
      />
      <StatTile
        label="Active pipeline"
        value={stats.active}
        sub="Pending through in transit"
        icon={Truck}
        accent="bg-violet-100 text-violet-700"
      />
      <StatTile
        label={shipmentStatusLabel.in_transit}
        value={stats.inTransit}
        sub="Live on road"
        icon={Clock}
        accent="bg-sky-100 text-sky-800"
      />
      <StatTile
        label={shipmentStatusLabel.delayed}
        value={stats.delayed}
        sub="Needs attention"
        icon={AlertTriangle}
        accent="bg-amber-100 text-amber-800"
      />
      <StatTile
        label={shipmentStatusLabel.delivered}
        value={stats.delivered}
        sub="Delivery history"
        icon={CheckCircle2}
        accent="bg-emerald-100 text-emerald-700"
      />
    </div>
  )
}
