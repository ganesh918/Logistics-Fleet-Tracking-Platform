import { MapPinned, Package, Truck, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '../ui/Card'

const actions = [
  { to: '/vehicles', label: 'Fleet registry', desc: '32+ vehicles', icon: Truck, color: 'bg-brand-100 text-brand-700' },
  { to: '/drivers', label: 'Driver roster', desc: 'Live status', icon: UserPlus, color: 'bg-violet-100 text-violet-700' },
  { to: '/shipments', label: 'New shipment', desc: 'Create & assign', icon: Package, color: 'bg-emerald-100 text-emerald-700' },
  { to: '/tracking', label: 'Live map', desc: 'Routes & ETA', icon: MapPinned, color: 'bg-amber-100 text-amber-800' },
]

export function QuickActions() {
  return (
    <Card>
      <CardBody>
        <p className="mb-3 text-sm font-medium text-surface-800/60">Quick actions</p>
        <div className="fleet-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="fleet-link-tile group flex items-center gap-3 rounded-xl border border-surface-100 p-3 dark:border-surface-200/15"
            >
              <div
                className={`fleet-link-tile-icon flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}
              >
                <Icon className="size-5 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 transition-colors group-hover:text-brand-700">
                  {label}
                </p>
                <p className="text-xs text-surface-800/50">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
