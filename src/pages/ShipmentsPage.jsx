import { Clock, Mail, MapPin, Pencil, Phone, Plus, Truck, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DeliveryHistoryFeed } from '../components/shipments/DeliveryHistoryFeed'
import { ShipmentStatsOverview } from '../components/shipments/ShipmentStatsOverview'
import { ShipmentStatusTracker } from '../components/shipments/ShipmentStatusTracker'
import { ShipmentForm } from '../components/shipments/ShipmentForm'
import { FilterPanel } from '../components/filters/FilterPanel'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { usePagination } from '../hooks/usePagination'
import { filterShipments } from '../utils/filters'
import { formatDateTime } from '../utils/format'
import { shipmentFormValuesFromEntity, shipmentPayloadFromForm } from '../utils/shipmentForm'
import { shipmentProgressPercent } from '../utils/shipmentProgress'
import { shipmentStatusColor, shipmentStatusLabel } from '../utils/statusStyles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Pagination } from '../components/ui/Pagination'
import { Select } from '../components/ui/Select'
import { EmptyState, PageError, PageLoader } from '../components/ui/PageStates'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'eta', label: 'ETA (soonest)' },
  { value: 'customer', label: 'Customer A–Z' },
  { value: 'status', label: 'Status' },
]

function sortShipments(list, sortBy) {
  const copy = [...list]
  switch (sortBy) {
    case 'eta':
      return copy.sort((a, b) => a.estimatedDeliveryAt.localeCompare(b.estimatedDeliveryAt))
    case 'customer':
      return copy.sort((a, b) => a.customerName.localeCompare(b.customerName))
    case 'status':
      return copy.sort((a, b) => a.status.localeCompare(b.status))
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export function ShipmentsPage() {
  const { shipments, drivers, vehicles, filters, loadState, error, refresh, createShipment, updateShipment } =
    useFleet()
  const toast = useToast()
  const [modal, setModal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => filterShipments(shipments, filters), [shipments, filters])
  const sorted = useMemo(() => sortShipments(filtered, sortBy), [filtered, sortBy])
  const pagination = usePagination(sorted, 9)
  const editing = editingId ? shipments.find((s) => s.id === editingId) : undefined

  useEffect(() => {
    pagination.reset()
  }, [filters, shipments.length, sortBy])

  if (loadState === 'loading' && shipments.length === 0) return <PageLoader />
  if (loadState === 'error' && shipments.length === 0) {
    return <PageError message={error ?? 'Failed to load shipments'} onRetry={() => void refresh()} />
  }

  const statusOptions = Object.entries(shipmentStatusLabel).map(([value, label]) => ({ value, label }))

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Operations</p>
          <h1 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">Shipment management</h1>
        </div>
        <Button
          className="shrink-0 self-start lg:self-auto"
          onClick={() => {
            setEditingId(null)
            setModal('create')
          }}
        >
          <Plus className="size-4" />
          Create shipment
        </Button>
      </div>

      <ShipmentStatsOverview shipments={shipments} />

      <FilterPanel scope="shipments" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-surface-800/60">
          Showing {pagination.items.length} of {filtered.length} filtered ({shipments.length} total)
        </p>
        <Select
          className="min-w-[10rem]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={SORT_OPTIONS}
          aria-label="Sort shipments"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No shipments found"
          description="Create a shipment or adjust your filters."
          action={
            <Button variant="secondary" onClick={() => setModal('create')}>
              Create shipment
            </Button>
          }
        />
      ) : (
        <>
          <div className="fleet-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pagination.items.map((s) => {
              const driver = drivers.find((d) => d.id === s.assignedDriverId)
              const vehicle = vehicles.find((v) => v.id === s.assignedVehicleId)
              const lastEvent = s.timeline?.[s.timeline.length - 1]
              return (
                <Card key={s.id} interactive className="flex h-full flex-col p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={`/shipments/${s.id}`}
                        className="font-display text-lg font-semibold text-brand-700 hover:underline"
                      >
                        {s.referenceCode}
                      </Link>
                      <p className="font-mono text-[10px] text-surface-400">{s.id}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1">
                      <Badge className={shipmentStatusColor[s.status]}>{shipmentStatusLabel[s.status]}</Badge>
                      <Badge className="bg-surface-100 text-surface-700 ring-surface-500/20">{s.priority}</Badge>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="font-medium text-surface-900">{s.customerName}</p>
                    <p className="flex items-center gap-1.5 text-xs text-surface-800/65">
                      <Mail className="size-3.5 shrink-0" />
                      {s.customerEmail}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-surface-800/65">
                      <Phone className="size-3.5 shrink-0" />
                      {s.customerPhone}
                    </p>
                    <p className="text-xs text-surface-400">{s.weightKg} kg cargo</p>
                  </div>

                  <div className="mt-4 space-y-3 rounded-xl border border-surface-100 bg-surface-50/50 p-3 text-xs dark:border-surface-200/10 dark:bg-surface-100/5">
                    <div>
                      <p className="mb-1 flex items-center gap-1 font-semibold text-emerald-700">
                        <MapPin className="size-3.5" />
                        Pickup
                      </p>
                      <p className="text-surface-800/75">{s.pickup.address}</p>
                      <p className="mt-0.5 text-surface-400">{formatDateTime(s.pickup.scheduledAt)}</p>
                    </div>
                    <div>
                      <p className="mb-1 flex items-center gap-1 font-semibold text-amber-700">
                        <MapPin className="size-3.5" />
                        Delivery
                      </p>
                      <p className="text-surface-800/75">{s.delivery.address}</p>
                      <p className="mt-0.5 text-surface-400">{formatDateTime(s.delivery.scheduledAt)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <p className="flex items-center gap-1 font-medium text-surface-900">
                      <User className="size-3.5 text-brand-600" />
                      {driver ? `${driver.firstName} ${driver.lastName}` : 'Unassigned driver'}
                    </p>
                    <p className="flex items-center gap-1 text-surface-800/65">
                      <Truck className="size-3.5" />
                      {vehicle?.plateNumber ?? 'No vehicle'}
                    </p>
                  </div>

                  <p className="mt-3 flex items-center gap-1 text-xs text-surface-800/60">
                    <Clock className="size-3.5" />
                    ETA {formatDateTime(s.estimatedDeliveryAt)}
                  </p>

                  <div className="mt-4 flex-1">
                    <ShipmentStatusTracker status={s.status} />
                    <p className="mt-2 text-[11px] text-surface-400">
                      {shipmentProgressPercent(s.status)}% complete · Last update: {lastEvent?.note ?? '—'}
                    </p>
                    <Select
                      className="mt-3"
                      label="Update status"
                      value={s.status}
                      onChange={(e) => void updateShipment(s.id, { status: e.target.value })}
                      options={statusOptions}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-surface-100 pt-3 dark:border-surface-200/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(s.id)
                        setModal('edit')
                      }}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Link to={`/shipments/${s.id}`} className="inline-flex items-center text-sm text-brand-600 hover:underline">
                      Delivery history
                    </Link>
                    <Link
                      to={`/tracking?shipment=${s.id}`}
                      className="inline-flex items-center text-sm text-surface-800/60 hover:text-brand-600"
                    >
                      Track on map
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={pagination.goToPage}
          />
        </>
      )}

      <DeliveryHistoryFeed shipments={shipments} />

      <Modal
        open={modal != null}
        onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Edit shipment' : 'Create shipment'}
        description="Customer details, routes, resources, and delivery windows."
        size="xl"
      >
        <ShipmentForm
          key={editing?.id ?? 'new'}
          drivers={drivers}
          vehicles={vehicles}
          initial={modal === 'edit' ? shipmentFormValuesFromEntity(editing) : undefined}
          loading={submitting}
          submitLabel={modal === 'edit' ? 'Save shipment' : 'Create shipment'}
          onCancel={() => setModal(null)}
          onSubmit={async (values) => {
            setSubmitting(true)
            try {
              const payload = shipmentPayloadFromForm(values, editing?.route)
              if (modal === 'edit' && editing) {
                await updateShipment(editing.id, payload)
                toast.success('Shipment details updated', { title: 'Saved' })
              } else {
                await createShipment(payload)
                toast.success('New shipment created', { title: 'Created' })
              }
              setModal(null)
            } catch (e) {
              toast.error(e instanceof Error ? e.message : 'Could not save shipment')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      </Modal>
    </div>
  )
}
