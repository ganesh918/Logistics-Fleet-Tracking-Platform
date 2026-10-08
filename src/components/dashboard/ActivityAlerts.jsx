import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelative } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { cn } from '../../utils/cn'

function prioritizeAlerts(notifications) {
  return [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1
    const rank = { critical: 0, warning: 1, info: 2 }
    const ra = rank[a.severity] ?? 3
    const rb = rank[b.severity] ?? 3
    if (ra !== rb) return ra - rb
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export function RecentActivity({
  items,
  className,
  limit,
  compact = false,
  maxBodyHeight = 'max-h-48',
}) {
  const visible = limit ? items.slice(0, limit) : items
  const hasMore = limit != null && items.length > limit

  return (
    <Card className={cn('flex flex-col', !compact && 'min-h-[280px]', className)}>
      <CardHeader
        title="Recent activity"
        description={compact ? 'Latest events' : 'Latest fleet events'}
        action={
          hasMore ? (
            <span className="text-xs text-surface-800/45">
              {visible.length} of {items.length}
            </span>
          ) : null
        }
      />
      <CardBody
        className={cn(
          'min-h-0 p-0',
          compact ? cn('overflow-y-auto overscroll-contain px-5 pb-4', maxBodyHeight) : 'flex-1 overflow-y-auto px-5 pb-5',
        )}
      >
        <ul className="space-y-0">
          {visible.map((item) => (
            <li
              key={item.id}
              className="fleet-list-row -mx-2 flex gap-2.5 rounded-lg border-b border-surface-100 px-2 py-2.5 last:border-0 dark:border-surface-200/10"
            >
              <div className="fleet-activity-dot mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-snug text-surface-900">
                  {item.action}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-surface-800/55">
                  {item.actor} · {formatRelative(item.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {visible.length === 0 ? (
          <p className="py-4 text-center text-sm text-surface-800/50">No recent activity</p>
        ) : null}
      </CardBody>
    </Card>
  )
}

const severityClass = {
  info: 'bg-brand-50 text-brand-800 ring-brand-600/20',
  warning: 'bg-amber-50 text-amber-900 ring-amber-600/20',
  critical: 'bg-rose-50 text-rose-800 ring-rose-600/20',
}

export function AlertsPanel({
  notifications,
  className,
  limit = 8,
  compact = false,
  maxBodyHeight = 'max-h-52',
}) {
  const sorted = prioritizeAlerts(notifications)
  const alerts = limit ? sorted.slice(0, limit) : sorted
  const hasMore = limit != null && sorted.length > limit

  return (
    <Card className={cn('flex flex-col', !compact && 'min-h-[280px]', className)}>
      <CardHeader
        title="Alerts"
        description={compact ? 'Priority items' : 'Maintenance, delays, and status updates'}
        action={
          <Link
            to="/notifications"
            className="shrink-0 text-xs font-medium text-brand-600 transition-all duration-200 hover:translate-x-0.5 hover:text-brand-700 sm:text-sm"
          >
            View all{hasMore ? ` (${sorted.length})` : ''}
          </Link>
        }
      />
      <CardBody
        className={cn(
          'min-h-0 space-y-2 p-0',
          compact
            ? cn('overflow-y-auto overscroll-contain px-4 pb-4 pt-1', maxBodyHeight)
            : 'flex-1 space-y-3 overflow-y-auto px-5 pb-5',
        )}
      >
        {alerts.map((n) => (
          <div
            key={n.id}
            className={cn(
              'group fleet-alert-row flex gap-2.5 rounded-lg border border-surface-100 bg-surface-50/80 dark:border-surface-200/10 dark:bg-surface-100/5',
              compact ? 'p-2.5' : 'rounded-xl p-3',
            )}
          >
            <AlertCircle
              className={cn(
                'shrink-0 text-surface-500 transition-transform duration-300 group-hover:rotate-12',
                compact ? 'mt-0.5 size-3.5' : 'mt-0.5 size-4',
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <p className="min-w-0 flex-1 line-clamp-1 text-sm font-medium text-surface-900">
                  {n.title}
                </p>
                <Badge className={cn('shrink-0 text-[10px]', severityClass[n.severity])}>
                  {n.severity}
                </Badge>
              </div>
              {!compact ? (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-surface-800/65">
                  {n.message}
                </p>
              ) : null}
              <p className="mt-1 text-[10px] text-surface-400">{formatRelative(n.createdAt)}</p>
            </div>
          </div>
        ))}
        {alerts.length === 0 ? (
          <p className="py-4 text-center text-sm text-surface-800/50">No alerts</p>
        ) : null}
      </CardBody>
    </Card>
  )
}
