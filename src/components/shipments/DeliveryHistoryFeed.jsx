import { History, MapPin } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/format'
import { shipmentStatusColor, shipmentStatusLabel } from '../../utils/statusStyles'
import { Badge } from '../ui/Badge'
import { Card, CardBody } from '../ui/Card'

export function DeliveryHistoryFeed({ shipments }) {
  const events = useMemo(() => {
    const rows = []
    for (const s of shipments) {
      for (const ev of s.timeline ?? []) {
        rows.push({
          id: `${s.id}-${ev.id}`,
          shipmentId: s.id,
          referenceCode: s.referenceCode,
          customerName: s.customerName,
          ...ev,
        })
      }
    }
    return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }, [shipments])

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-surface-900">Delivery history</h2>
        <p className="mt-1 text-sm text-surface-800/60">
          Unified timeline across shipments — status changes, locations, and notes
        </p>
      </div>

      {events.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-surface-800/50">No timeline events yet.</p>
        </Card>
      ) : (
        <div className="fleet-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((ev) => (
            <Card key={ev.id} interactive className="flex h-full flex-col p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/40">
                  <History className="size-5" />
                </div>
                <Badge className={shipmentStatusColor[ev.status] ?? shipmentStatusColor.pending}>
                  {shipmentStatusLabel[ev.status] ?? ev.status}
                </Badge>
              </div>

              <div className="mt-3 min-w-0 flex-1">
                <Link
                  to={`/shipments/${ev.shipmentId}`}
                  className="font-display text-base font-semibold text-brand-700 hover:underline"
                >
                  {ev.referenceCode}
                </Link>
                <p className="mt-0.5 truncate text-xs text-surface-800/55">{ev.customerName}</p>
                <p className="mt-3 text-sm text-surface-800/75">{ev.note}</p>
                <p className="mt-3 flex items-start gap-1.5 text-xs text-surface-800/60">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
                  <span>{ev.location}</span>
                </p>
                <p className="mt-2 text-[11px] font-medium text-surface-400">
                  {formatDateTime(ev.timestamp)}
                </p>
              </div>

              <Link
                to={`/shipments/${ev.shipmentId}`}
                className="mt-4 border-t border-surface-100 pt-3 text-xs font-medium text-brand-600 hover:underline dark:border-surface-200/10"
              >
                View shipment details
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
