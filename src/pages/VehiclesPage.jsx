import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/ui/Pagination';
import { Link } from 'react-router-dom';
import { FilterPanel } from '../components/filters/FilterPanel';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { useFleet } from '../context/FleetContext';
import { filterVehicles } from '../utils/filters';
import { formatDate, formatNumber } from '../utils/format';
import { vehicleStatusColor, vehicleStatusLabel } from '../utils/statusStyles';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmptyState, PageError, PageLoader } from '../components/ui/PageStates';
export function VehiclesPage() {
    const { vehicles, drivers, loadState, error, refresh, createVehicle, updateVehicle, deleteVehicle, filters } = useFleet();
    const [modal, setModal] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const filtered = useMemo(() => filterVehicles(vehicles, filters, drivers), [vehicles, filters, drivers]);
    const pagination = usePagination(filtered, 10);
    useEffect(() => {
        pagination.reset();
    }, [filters, vehicles.length]);
    const editing = editingId ? vehicles.find((v) => v.id === editingId) : undefined;
    if (loadState === 'loading' && vehicles.length === 0)
        return <PageLoader />;
    if (loadState === 'error' && vehicles.length === 0) {
        return <PageError message={error ?? 'Failed to load vehicles'} onRetry={() => void refresh()}/>;
    }
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
    });
    return (<div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-surface-800/60">
          {filtered.length} of {vehicles.length} vehicles
        </p>
        <Button onClick={() => {
            setEditingId(null);
            setModal('create');
        }}>
          <Plus className="size-4"/>
          Add vehicle
        </Button>
      </div>
      <FilterPanel scope="vehicles"/>

      {filtered.length === 0 ? (<EmptyState title="No vehicles match your filters" description="Try adjusting search or status filters, or add a new vehicle." action={<Button variant="secondary" onClick={() => setModal('create')}>
              Add vehicle
            </Button>}/>) : (<Card className="overflow-x-auto">
          <table className="fleet-table min-w-full text-left text-sm">
            <thead className="border-b border-surface-100 bg-surface-50/80 text-xs uppercase tracking-wide text-surface-800/50">
              <tr>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Driver</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Fuel</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Maintenance</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {pagination.items.map((v) => {
                const driver = drivers.find((d) => d.id === v.assignedDriverId);
                return (<tr key={v.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-surface-900">{v.plateNumber}</p>
                      <p className="text-xs text-surface-800/50">
                        {v.make} {v.model} · {formatNumber(v.mileage)} km
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={vehicleStatusColor[v.status]}>{vehicleStatusLabel[v.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {driver ? `${driver.firstName} ${driver.lastName}` : '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-200">
                          <div className="h-full rounded-full bg-brand-500" style={{ width: `${v.fuelLevel}%` }}/>
                        </div>
                        <span className="text-xs">{v.fuelLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-surface-800/60">
                      Due {formatDate(v.nextMaintenanceDue)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link to={`/vehicles/${v.id}`}>
                          <Button variant="ghost" size="sm" aria-label="View">
                            <Eye className="size-4"/>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" aria-label="Edit" onClick={() => {
                        setEditingId(v.id);
                        setModal('edit');
                    }}>
                          <Pencil className="size-4"/>
                        </Button>
                        <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => {
                        if (confirm(`Remove ${v.plateNumber}?`))
                            void deleteVehicle(v.id);
                    }}>
                          <Trash2 className="size-4 text-rose-600"/>
                        </Button>
                      </div>
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>
        </Card>)}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={pagination.goToPage}
      />

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit vehicle' : 'Add vehicle'} description="Fleet registry — changes sync to mock store (API-ready)." size="xl">
        <VehicleForm key={editing?.id ?? 'new'} initial={editing} drivers={drivers} loading={submitting} onCancel={() => setModal(null)} onSubmit={async (values) => {
            setSubmitting(true);
            try {
                const payload = mapFormToVehicle(values);
                if (modal === 'edit' && editing) {
                    await updateVehicle(editing.id, payload);
                }
                else {
                    await createVehicle(payload);
                }
                setModal(null);
            }
            finally {
                setSubmitting(false);
            }
        }}/>
      </Modal>
    </div>);
}
