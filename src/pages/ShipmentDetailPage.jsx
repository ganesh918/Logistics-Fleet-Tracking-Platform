import { ArrowLeft, MapPin, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShipmentForm } from '../components/shipments/ShipmentForm'
import { FleetMap } from '../components/tracking/FleetMap'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { formatDateTime } from '../utils/format'
import { shipmentFormValuesFromEntity, shipmentPayloadFromForm } from '../utils/shipmentForm'
import { shipmentStatusColor, shipmentStatusLabel } from '../utils/statusStyles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Select } from '../components/ui/Select'
import { PageError, PageLoader } from '../components/ui/PageStates'

export function ShipmentDetailPage() {
  const { id } = useParams()
  const { shipments, drivers, vehicles, loadState, refresh, updateShipment } = useFleet()
  const toast = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const shipment = shipments.find((s) => s.id === id)
  const driver = shipment?.assignedDriverId
    ? drivers.find((d) => d.id === shipment.assignedDriverId)
    : undefined
  const vehicle = shipment?.assignedVehicleId
    ? vehicles.find((v) => v.id === shipment.assignedVehicleId)
    : undefined
  const mapVehicles = vehicle ? [vehicle] : []

  if (loadState === 'loading' && !shipment) return <PageLoader />
  if (!shipment) return <PageError message="Shipment not found" onRetry={() => void refresh()} />

  return (
    <div className="space-y-6">
      <Link to="/shipments">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4" />
          Back to shipments
        </Button>
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">{shipment.referenceCode}</h2>
          <p className="text-surface-800/60">{shipment.customerName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={shipmentStatusColor[shipment.status]}>
            {shipmentStatusLabel[shipment.status]}
          </Badge>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit shipment
          </Button>
          <Select
            className="min-w-[160px]"
            value={shipment.status}
            onChange={(e) => void updateShipment(shipment.id, { status: e.target.value })}
            options={Object.entries(shipmentStatusLabel).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Route & tracking" />
          <CardBody className="space-y-4 pt-0">
            <FleetMap vehicles={mapVehicles} shipment={shipment} height="300px" />
            <Link to={`/tracking?shipment=${shipment.id}`}>
              <Button variant="secondary" size="sm">
                Open full tracking view
              </Button>
            </Link>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Customer & assignment" />
          <CardBody className="space-y-3 text-sm">
            <div>
              <p className="text-surface-800/50">Contact</p>
              <p>{shipment.customerEmail}</p>
              <p>{shipment.customerPhone}</p>
            </div>
            <div>
              <p className="text-surface-800/50">Driver</p>
              <p className="font-medium">
                {driver ? `${driver.firstName} ${driver.lastName}` : 'Unassigned'}
              </p>
            </div>
            <div>
              <p className="text-surface-800/50">Vehicle</p>
              <p className="font-medium">{vehicle?.plateNumber ?? 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-surface-800/50">Weight</p>
              <p>{shipment.weightKg} kg</p>
            </div>
            <div>
              <p className="text-surface-800/50">Estimated delivery</p>
              <p>{formatDateTime(shipment.estimatedDeliveryAt)}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Locations" />
          <CardBody className="space-y-4 text-sm">
            <div className="flex gap-2">
              <MapPin className="size-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-surface-800/60">{shipment.pickup.address}</p>
                <p className="text-xs text-surface-400">{formatDateTime(shipment.pickup.scheduledAt)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <MapPin className="size-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-surface-800/60">{shipment.delivery.address}</p>
                <p className="text-xs text-surface-400">{formatDateTime(shipment.delivery.scheduledAt)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Delivery timeline" />
          <CardBody>
            <ol className="relative space-y-4 border-l border-surface-200 pl-4 dark:border-surface-200/15">
              {shipment.timeline.map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-brand-500 ring-4 ring-panel" />
                  <p className="text-sm font-medium">{shipmentStatusLabel[ev.status]}</p>
                  <p className="text-xs text-surface-800/60">{ev.note}</p>
                  <p className="text-[11px] text-surface-400">
                    {ev.location} · {formatDateTime(ev.timestamp)}
                  </p>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit shipment"
        description="Update customer, locations, assignments, and schedule."
        size="xl"
      >
        <ShipmentForm
          key={shipment.id}
          drivers={drivers}
          vehicles={vehicles}
          initial={shipmentFormValuesFromEntity(shipment)}
          loading={submitting}
          submitLabel="Save shipment"
          onCancel={() => setEditOpen(false)}
          onSubmit={async (values) => {
            setSubmitting(true)
            try {
              await updateShipment(shipment.id, shipmentPayloadFromForm(values, shipment.route))
              toast.success('Shipment updated successfully', { title: 'Saved' })
              setEditOpen(false)
            } catch (e) {
              toast.error(e instanceof Error ? e.message : 'Update failed')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      </Modal>
    </div>
  )
}
