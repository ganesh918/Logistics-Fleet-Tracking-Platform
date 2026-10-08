import { Pencil, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilterPanel } from '../components/filters/FilterPanel'
import { ShipmentForm } from '../components/shipments/ShipmentForm'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { filterShipments } from '../utils/filters'
import { formatDateTime } from '../utils/format'
import { shipmentFormValuesFromEntity, shipmentPayloadFromForm } from '../utils/shipmentForm'
import { shipmentStatusColor, shipmentStatusLabel } from '../utils/statusStyles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { EmptyState, PageError, PageLoader } from '../components/ui/PageStates'

export function ShipmentsPage() {
  const { shipments, drivers, vehicles, filters, loadState, error, refresh, createShipment, updateShipment } =
    useFleet()
  const toast = useToast()
  const [modal, setModal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const filtered = useMemo(() => filterShipments(shipments, filters), [shipments, filters])
  const editing = editingId ? shipments.find((s) => s.id === editingId) : undefined

  if (loadState === 'loading' && shipments.length === 0) return <PageLoader />
  if (loadState === 'error' && shipments.length === 0) {
    return <PageError message={error ?? 'Failed to load shipments'} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-surface-800/60">
          {filtered.length} of {shipments.length} shipments
        </p>
        <Button
          onClick={() => {
            setEditingId(null)
            setModal('create')
          }}
        >
          <Plus className="size-4" />
          Create shipment
        </Button>
      </div>
      <FilterPanel scope="shipments" />

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
        <div className="fleet-stagger grid gap-4">
          {filtered.map((s) => {
            const driver = drivers.find((d) => d.id === s.assignedDriverId)
            const vehicle = vehicles.find((v) => v.id === s.assignedVehicleId)
            return (
              <Card key={s.id} interactive className="group p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/shipments/${s.id}`}
                        className="font-display text-lg font-semibold text-brand-700 hover:underline"
                      >
                        {s.referenceCode}
                      </Link>
                      <Badge className={shipmentStatusColor[s.status]}>{shipmentStatusLabel[s.status]}</Badge>
                      <Badge className="bg-surface-100 text-surface-700 ring-surface-500/20">{s.priority}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-surface-900">{s.customerName}</p>
                    <p className="mt-2 text-xs text-surface-800/60">
                      <span className="font-medium text-emerald-700">Pickup:</span> {s.pickup.address}
                    </p>
                    <p className="text-xs text-surface-800/60">
                      <span className="font-medium text-amber-700">Delivery:</span> {s.delivery.address}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2 text-right text-xs text-surface-800/60">
                    <p>ETA {formatDateTime(s.estimatedDeliveryAt)}</p>
                    <p>
                      {driver ? `${driver.firstName} ${driver.lastName}` : 'No driver'} ·{' '}
                      {vehicle?.plateNumber ?? 'No vehicle'}
                    </p>
                    <div className="flex flex-wrap justify-end gap-2">
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
                      <Link to={`/tracking?shipment=${s.id}`} className="text-brand-600 hover:underline">
                        Track on map
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

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
