import { Pencil, Plus, Trash2, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DriverForm } from '../components/drivers/DriverForm'
import { FilterPanel } from '../components/filters/FilterPanel'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { usePagination } from '../hooks/usePagination'
import { filterDrivers } from '../utils/filters'
import { formatPercent } from '../utils/format'
import { driverStatusColor, driverStatusLabel } from '../utils/statusStyles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState, PageError, PageLoader } from '../components/ui/PageStates'

export function DriversPage() {
  const {
    drivers,
    vehicles,
    filters,
    loadState,
    error,
    refresh,
    createDriver,
    updateDriver,
    deleteDriver,
  } = useFleet()
  const toast = useToast()
  const filtered = useMemo(() => filterDrivers(drivers, filters, vehicles), [drivers, filters, vehicles])
  const pagination = usePagination(filtered, 12)
  const [modal, setModal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    pagination.reset()
  }, [filters, drivers.length])

  const editing = editingId ? drivers.find((d) => d.id === editingId) : undefined

  const mapFormToDriver = (values) => ({
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    licenseNumber: values.licenseNumber,
    status: values.status,
    assignedVehicleId: values.assignedVehicleId || null,
  })

  const onDelete = async (driver) => {
    const confirmed = await toast.confirm({
      title: `Remove ${driver.firstName} ${driver.lastName}?`,
      description: 'This removes the driver profile and unassigns them from any vehicle.',
      confirmLabel: 'Remove driver',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })
    if (!confirmed) return
    await deleteDriver(driver.id)
    toast.success('Driver removed from roster', { title: 'Driver deleted' })
  }

  if (loadState === 'loading' && drivers.length === 0) return <PageLoader />
  if (loadState === 'error' && drivers.length === 0) {
    return <PageError message={error ?? 'Failed to load drivers'} onRetry={() => void refresh()} />
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-surface-800/60">
          {filtered.length} of {drivers.length} drivers · photographic profiles
        </p>
        <Button
          onClick={() => {
            setEditingId(null)
            setModal('create')
          }}
        >
          <Plus className="size-4" />
          Add driver
        </Button>
      </div>
      <FilterPanel scope="drivers" />

      {filtered.length === 0 ? (
        <EmptyState
          title="No drivers match your filters"
          description="Adjust filters or add a new driver to the roster."
          action={
            <Button variant="secondary" onClick={() => setModal('create')}>
              Add driver
            </Button>
          }
        />
      ) : (
        <>
          <div className="fleet-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pagination.items.map((d) => {
              const vehicle = vehicles.find((v) => v.id === d.assignedVehicleId)
              return (
                <Card key={d.id} interactive className="group flex h-full flex-col">
                  <div className="flex flex-1 items-start gap-4 p-5">
                    <Link to={`/drivers/${d.id}`} className="shrink-0">
                      <img
                        src={d.avatarUrl}
                        alt=""
                        loading="lazy"
                        className="size-16 rounded-2xl object-cover ring-2 ring-surface-200 transition-all duration-300 group-hover:scale-105 group-hover:ring-brand-400/50 dark:ring-surface-200/20"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/drivers/${d.id}`} className="font-display font-semibold text-surface-900 hover:text-brand-700">
                          {d.firstName} {d.lastName}
                        </Link>
                        <Badge className={driverStatusColor[d.status]}>{driverStatusLabel[d.status]}</Badge>
                      </div>
                      <p className="mt-1 truncate text-xs text-surface-800/50">{d.email}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-surface-800/70">
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {d.rating.toFixed(1)}
                        </span>
                        <span>{d.totalDeliveries} deliveries</span>
                        <span>{formatPercent(d.onTimeRate)} on-time</span>
                      </div>
                      <p className="mt-2 text-xs">
                        Vehicle:{' '}
                        <span className="font-medium text-surface-900">{vehicle?.plateNumber ?? 'None'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-surface-100 px-4 py-3 dark:border-surface-200/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingId(d.id)
                        setModal('edit')
                      }}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700" onClick={() => void onDelete(d)}>
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
        open={modal != null}
        onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Edit driver' : 'Add driver'}
        description="Manage profile, license, status, and vehicle assignment."
        size="lg"
      >
        <DriverForm
          key={editing?.id ?? 'new'}
          initial={editing}
          vehicles={vehicles}
          loading={submitting}
          submitLabel={modal === 'edit' ? 'Save changes' : 'Add driver'}
          onCancel={() => setModal(null)}
          onSubmit={async (values) => {
            setSubmitting(true)
            try {
              const payload = mapFormToDriver(values)
              if (modal === 'edit' && editing) {
                await updateDriver(editing.id, payload)
                toast.success('Driver profile updated', { title: 'Saved' })
              } else {
                await createDriver(payload)
                toast.success('Driver added to roster', { title: 'Created' })
              }
              setModal(null)
            } catch (e) {
              toast.error(e instanceof Error ? e.message : 'Could not save driver')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      </Modal>
    </div>
  )
}
