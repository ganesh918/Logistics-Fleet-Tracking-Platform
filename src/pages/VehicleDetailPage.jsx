import { ArrowLeft, Fuel, Wrench } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FleetMap } from '../components/tracking/FleetMap';
import { useFleet } from '../context/FleetContext';
import { formatDate, formatNumber } from '../utils/format';
import { vehicleStatusColor, vehicleStatusLabel } from '../utils/statusStyles';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PageError, PageLoader } from '../components/ui/PageStates';
export function VehicleDetailPage() {
    const { id } = useParams();
    const { vehicles, drivers, shipments, loadState, refresh } = useFleet();
    const vehicle = vehicles.find((v) => v.id === id);
    const driver = vehicle?.assignedDriverId
        ? drivers.find((d) => d.id === vehicle.assignedDriverId)
        : undefined;
    const relatedShipments = shipments.filter((s) => s.assignedVehicleId === id);
    const activityLog = useMemo(() => {
        if (!vehicle)
            return [];
        const events = [
            ...vehicle.maintenanceHistory.map((m) => ({
                id: m.id,
                at: m.date,
                title: `Maintenance: ${m.type}`,
                detail: m.notes,
                kind: 'maintenance',
            })),
            ...relatedShipments.map((s) => ({
                id: s.id,
                at: s.createdAt,
                title: `Shipment ${s.referenceCode}`,
                detail: `${s.customerName} · ${s.status}`,
                kind: 'shipment',
                href: `/shipments/${s.id}`,
            })),
        ];
        return events.sort((a, b) => b.at.localeCompare(a.at));
    }, [vehicle, relatedShipments]);
    if (loadState === 'loading' && !vehicle)
        return <PageLoader label="Loading vehicle…"/>;
    if (!vehicle) {
        return (<PageError message="Vehicle not found" onRetry={() => void refresh()}/>);
    }
    return (<div className="space-y-6">
      <Link to="/vehicles">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4"/>
          Back to vehicles
        </Button>
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-surface-900">{vehicle.plateNumber}</h2>
          <p className="text-surface-800/60">
            {vehicle.make} {vehicle.model} ({vehicle.year}) · {vehicle.type}
          </p>
        </div>
        <Badge className={vehicleStatusColor[vehicle.status]}>{vehicleStatusLabel[vehicle.status]}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Live location"/>
          <CardBody className="pt-0">
            <FleetMap vehicles={[vehicle]} height="280px"/>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Assignment & fuel"/>
          <CardBody className="space-y-4 text-sm">
            <div>
              <p className="text-surface-800/50">Assigned driver</p>
              <p className="font-medium">
                {driver ? `${driver.firstName} ${driver.lastName}` : 'Unassigned'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="size-4 text-brand-600"/>
              <span>Fuel {vehicle.fuelLevel}%</span>
            </div>
            <div>
              <p className="text-surface-800/50">Mileage</p>
              <p className="font-medium">{formatNumber(vehicle.mileage)} km</p>
            </div>
            <div>
              <p className="text-surface-800/50">Capacity</p>
              <p className="font-medium">{formatNumber(vehicle.capacityKg)} kg</p>
            </div>
            <div>
              <p className="text-surface-800/50">VIN</p>
              <p className="font-mono text-xs">{vehicle.vin}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Maintenance" description="Service schedule & history"/>
          <CardBody className="space-y-3 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
              <Wrench className="size-4"/>
              Next due: {formatDate(vehicle.nextMaintenanceDue)}
            </div>
            <p className="text-surface-800/60">Last service: {formatDate(vehicle.lastMaintenance)}</p>
            {vehicle.maintenanceHistory.length === 0 ? (<p className="text-xs text-surface-400">No maintenance records yet.</p>) : (<ul className="space-y-2">
                {vehicle.maintenanceHistory.map((m) => (<li key={m.id} className="rounded-lg border border-surface-100 p-3">
                    <p className="font-medium">{m.type}</p>
                    <p className="text-xs text-surface-800/50">
                      {formatDate(m.date)} · ${m.cost}
                    </p>
                    <p className="mt-1 text-xs">{m.notes}</p>
                  </li>))}
              </ul>)}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Activity log" description="Maintenance and shipment history"/>
          <CardBody>
            {activityLog.length === 0 ? (<p className="text-sm text-surface-800/50">No activity recorded for this vehicle.</p>) : (<ul className="space-y-2">
                {activityLog.map((ev) => (<li key={`${ev.kind}-${ev.id}`}>
                    {ev.href ? (<Link to={ev.href} className="fleet-list-row block rounded-lg border border-surface-100 p-3 text-sm dark:border-surface-200/10">
                        <p className="font-medium text-surface-900">{ev.title}</p>
                        <p className="text-xs text-surface-800/55">{ev.detail}</p>
                        <p className="mt-1 text-[10px] text-surface-400">{formatDate(ev.at)}</p>
                      </Link>) : (<div className="rounded-lg border border-surface-100 p-3 text-sm dark:border-surface-200/10">
                        <p className="font-medium text-surface-900">{ev.title}</p>
                        <p className="text-xs text-surface-800/55">{ev.detail}</p>
                        <p className="mt-1 text-[10px] text-surface-400">{formatDate(ev.at)}</p>
                      </div>)}
                  </li>))}
              </ul>)}
          </CardBody>
        </Card>
      </div>
    </div>);
}
