import { Eye, Fuel, MapPin, Pencil, Plus, Trash2, Truck, User, Wrench } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilterPanel } from '../components/filters/FilterPanel'
import { VehicleForm } from '../components/vehicles/VehicleForm'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { usePagination } from '../hooks/usePagination'
import { filterVehicles } from '../utils/filters'
import { formatDate, formatNumber } from '../utils/format'
import { vehicleStatusColor, vehicleStatusLabel } from '../utils/statusStyles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState, PageError, PageLoader } from '../components/ui/PageStates'

export function VehiclesPage() {
  const { vehicles, drivers, loadState, error, refresh, createVehicle, updateVehicle, deleteVehicle, filters } =
    useFleet()
  const toast = useToast()
  const [modal, setModal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const filtered = useMemo(() => filterVehicles(vehicles, filters, drivers), [vehicles, filters, drivers])
  const pagination = usePagination(filtered, 9)

  useEffect(() => {
    pagination.reset()
  }, [filters, vehicles.length])

  const editing = editingId ? vehicles.find((v) => v.id === editingId) : undefined

  const mapFormToVehicle = (values) => ({
    plateNumber: values.plateNumber,
    make: values.make,
    model: values.model,
    year: values.year,
    type: values.type,
    status: values.status,
    fuelLevel: values.fuelLevel,
    mileage: values.mileage,
    lastMaintenance: new Date(values.lastMaintenance).toISOString(),
    nextMaintenanceDue: new Date(values.nextMaintenanceDue).toISOString(),
    assignedDriverId: values.assignedDriverId || null,
    capacityKg: values.capacityKg,
    vin: values.vin,
    currentLocation: {
      lat: values.lat,
      lng: values.lng,
      label: values.locationLabel,
    },
  })

  const onDelete = async (vehicle) => {
    const confirmed = await toast.confirm({
      title: `Remove ${vehicle.plateNumber}?`,
      description: 'This removes the vehicle from the fleet registry.',
      confirmLabel: 'Remove vehicle',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })
    if (!confirmed) return
    await deleteVehicle(vehicle.id)
    toast.success('Vehicle removed from fleet', { title: 'Deleted' })
  }

  if (loadState === 'loading' && vehicles.length === 0) return <PageLoader />
  if (loadState === 'error' && vehicles.length === 0) {
    return <PageError message={error ?? 'Failed to load vehicles'} onRetry={() => void refresh()} />
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-surface-800/60">
          {filtered.length} of {vehicles.length} vehicles
        </p>
        <Button
          onClick={() => {
            setEditingId(null)
            setModal('create')
          }}
        >
          <Plus className="size-4" />
          Add vehicle
        </Button>
      </div>

      <FilterPanel scope="vehicles" />

      {filtered.length === 0 ? (
        <EmptyState
          title="No vehicles match your filters"
          description="Try adjusting search or status filters, or add a new vehicle."
          action={
            <Button variant="secondary" onClick={() => setModal('create')}>
              Add vehicle
            </Button>
          }
        />
      ) : (
        <>
          <div className="fleet-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pagination.items.map((v) => {
              const driver = drivers.find((d) => d.id === v.assignedDriverId)
              return (
                <Card key={v.id} interactive className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                        <Truck className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/vehicles/${v.id}`}
                          className="font-display text-lg font-semibold text-brand-700 hover:underline"
                        >
                          {v.plateNumber}
                        </Link>
                        <p className="text-sm text-surface-800/70">
                          {v.make} {v.model} · {v.year}
                        </p>
                        <p className="text-xs text-surface-400">{v.type}</p>
                      </div>
                    </div>
                    <Badge className={vehicleStatusColor[v.status]}>{vehicleStatusLabel[v.status]}</Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-surface-800/65">
                    <p className="flex items-center gap-1.5">
                      <User className="size-3.5 shrink-0 text-brand-600" />
                      {driver ? `${driver.firstName} ${driver.lastName}` : 'No driver assigned'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      {v.currentLocation?.label ?? 'Unknown location'}
                    </p>
                    <p>
                      {formatNumber(v.mileage)} km · {formatNumber(v.capacityKg)} kg capacity
                    </p>
                    <p className="font-mono text-[10px] text-surface-400">VIN {v.vin}</p>
                  </div>

                  <div className="mt-4 rounded-xl border border-surface-100 bg-surface-50/50 p-3 dark:border-surface-200/10 dark:bg-surface-100/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 font-medium text-surface-800">
                        <Fuel className="size-3.5 text-brand-600" />
                        Fuel level
                      </span>
                      <span>{v.fuelLevel}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-200/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all"
                        style={{ width: `${v.fuelLevel}%` }}
                      />
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-xs text-surface-800/60">
                      <Wrench className="size-3.5" />
                      Next service {formatDate(v.nextMaintenanceDue)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-surface-100 pt-3 dark:border-surface-200/10">
                    <Link to={`/vehicles/${v.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="size-3.5" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(v.id)
                        setModal('edit')
                      }}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => void onDelete(v)}
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
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

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Edit vehicle' : 'Add vehicle'}
        description="Fleet registry — changes sync to mock store (API-ready)."
        size="xl"
      >
        <VehicleForm
          key={editing?.id ?? 'new'}
          initial={editing}
          drivers={drivers}
          loading={submitting}
          onCancel={() => setModal(null)}
          onSubmit={async (values) => {
            setSubmitting(true)
            try {
              const payload = mapFormToVehicle(values)
              if (modal === 'edit' && editing) {
                await updateVehicle(editing.id, payload)
                toast.success('Vehicle updated', { title: 'Saved' })
              } else {
                await createVehicle(payload)
                toast.success('Vehicle added to fleet', { title: 'Created' })
              }
              setModal(null)
            } catch (e) {
              toast.error(e instanceof Error ? e.message : 'Could not save vehicle')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      </Modal>
    </div>
  )
}
