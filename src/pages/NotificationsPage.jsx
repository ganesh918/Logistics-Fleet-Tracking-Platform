import { Bell, CheckCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFleet } from '../context/FleetContext'
import { formatRelative } from '../utils/format'
import { cn } from '../utils/cn'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState, PageLoader } from '../components/ui/PageStates'

const typeLabel = {
  shipment_delayed: 'Delayed shipment',
  maintenance_due: 'Maintenance',
  delivery_update: 'Delivery update',
  driver_status: 'Driver status',
  system: 'System',
}

const severityClass = {
  info: 'bg-brand-50 text-brand-800 ring-brand-600/20',
  warning: 'bg-amber-50 text-amber-900 ring-amber-600/20',
  critical: 'bg-rose-50 text-rose-800 ring-rose-600/20',
}

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'critical', label: 'Critical' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'shipments', label: 'Shipments' },
]

export function NotificationsPage() {
  const {
    notifications,
    loadState,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount,
  } = useFleet()
  const [tab, setTab] = useState('all')

  const filtered = useMemo(() => {
    switch (tab) {
      case 'unread':
        return notifications.filter((n) => !n.read)
      case 'critical':
        return notifications.filter((n) => n.severity === 'critical')
      case 'maintenance':
        return notifications.filter((n) => n.type === 'maintenance_due')
      case 'shipments':
        return notifications.filter((n) =>
          ['shipment_delayed', 'delivery_update'].includes(n.type),
        )
      default:
        return notifications
    }
  }, [notifications, tab])

  if (loadState === 'loading' && notifications.length === 0) return <PageLoader />

  const entityLink = (type, id) => {
    if (!type || !id) return null
    if (type === 'vehicle') return `/vehicles/${id}`
    if (type === 'driver') return `/drivers/${id}`
    if (type === 'shipment') return `/shipments/${id}`
    return null
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-surface-800/60">
          {unreadNotificationCount} unread · {notifications.length} total alerts
        </p>
        <Button variant="secondary" size="sm" onClick={() => void markAllNotificationsRead()}>
          <CheckCheck className="size-4" />
          Mark all read
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-out',
              tab === t.id
                ? 'scale-105 bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'bg-surface-100 text-surface-800 hover:-translate-y-0.5 hover:bg-surface-200 hover:shadow-sm dark:bg-surface-100/20 dark:hover:bg-surface-100/30',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No notifications in this view"
          description="Try another filter or refresh fleet data."
        />
      ) : (
        <div className="fleet-stagger space-y-3">
          {filtered.map((n) => {
            const href = entityLink(n.relatedEntityType, n.relatedEntityId)
            return (
              <Card
                key={n.id}
                interactive
                className={cn('group p-4', !n.read && 'ring-2 ring-brand-200 dark:ring-brand-500/30')}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-surface-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-surface-100/15 dark:group-hover:bg-brand-950/40">
                      <Bell className="size-5 transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-surface-900">{n.title}</h3>
                        <Badge className="bg-surface-100 text-surface-700 ring-surface-500/20">
                          {typeLabel[n.type] ?? n.type}
                        </Badge>
                        <Badge className={severityClass[n.severity]}>{n.severity}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-surface-800/70">{n.message}</p>
                      <p className="mt-2 text-xs text-surface-400">{formatRelative(n.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end lg:flex-row lg:items-center">
                    {!n.read ? (
                      <Button size="sm" variant="secondary" onClick={() => void markNotificationRead(n.id)}>
                        Mark read
                      </Button>
                    ) : null}
                    {href ? (
                      <Link to={href}>
                        <Button size="sm" variant="ghost">
                          View details
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
