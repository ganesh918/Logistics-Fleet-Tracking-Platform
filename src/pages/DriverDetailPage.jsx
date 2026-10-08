import { ArrowLeft, Mail, Phone, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useFleet } from '../context/FleetContext';
import { formatDate, formatPercent } from '../utils/format';
import { driverStatusColor, driverStatusLabel, shipmentStatusLabel } from '../utils/statusStyles';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { PageError, PageLoader } from '../components/ui/PageStates';
export function DriverDetailPage() {
    const { id } = useParams();
    const { drivers, vehicles, shipments, loadState, refresh, updateDriver } = useFleet();
    const driver = drivers.find((d) => d.id === id);
    const vehicle = driver?.assignedVehicleId
        ? vehicles.find((v) => v.id === driver.assignedVehicleId)
        : undefined;
    const history = useMemo(() => shipments
        .filter((s) => s.assignedDriverId === id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [shipments, id]);
    if (loadState === 'loading' && !driver)
        return <PageLoader />;
    if (!driver)
        return <PageError message="Driver not found" onRetry={() => void refresh()}/>;
    const delivered = history.filter((s) => s.status === 'delivered').length;
    return (<div className="space-y-6">
      <Link to="/drivers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4"/>
          Back to drivers
        </Button>
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <img src={driver.avatarUrl} alt="" className="size-24 rounded-2xl object-cover ring-2 ring-surface-200 dark:ring-surface-200/20"/>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold">
              {driver.firstName} {driver.lastName}
            </h2>
            <Badge className={driverStatusColor[driver.status]}>{driverStatusLabel[driver.status]}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-surface-800/70">
            <span className="inline-flex items-center gap-1">
              <Mail className="size-4"/> {driver.email}
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="size-4"/> {driver.phone}
            </span>
          </div>
          <p className="mt-2 text-sm">License {driver.licenseNumber} · Joined {formatDate(driver.joinedAt)}</p>
        </div>
        <div className="w-full max-w-xs">
          <Select label="Update status" value={driver.status} onChange={(e) => void updateDriver(driver.id, { status: e.target.value })} options={Object.entries(driverStatusLabel).map(([value, label]) => ({ value, label }))}/>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-sm text-surface-800/50">Rating</p>
            <p className="font-display text-2xl font-bold inline-flex items-center gap-1">
              <Star className="size-5 fill-amber-400 text-amber-400"/>
              {driver.rating}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-surface-800/50">On-time rate</p>
            <p className="font-display text-2xl font-bold">{formatPercent(driver.onTimeRate)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-surface-800/50">Deliveries (sample)</p>
            <p className="font-display text-2xl font-bold">{delivered}/{history.length}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Assigned vehicle"/>
        <CardBody>
          {vehicle ? (<Link to={`/vehicles/${vehicle.id}`} className="font-medium text-brand-600 hover:underline">
              {vehicle.plateNumber} — {vehicle.make} {vehicle.model}
            </Link>) : (<p className="text-sm text-surface-800/50">No vehicle assigned</p>)}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Delivery history" description="Shipments assigned to this driver"/>
        <CardBody className="overflow-x-auto">
          {history.length === 0 ? (<p className="text-sm text-surface-800/50">No shipment history yet.</p>) : (<table className="fleet-table min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-surface-800/50">
                <tr>
                  <th className="pb-2">Reference</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {history.map((s) => (<tr key={s.id}>
                    <td className="py-2">
                      <Link to={`/shipments/${s.id}`} className="font-medium text-brand-600">
                        {s.referenceCode}
                      </Link>
                    </td>
                    <td className="py-2">{s.customerName}</td>
                    <td className="py-2">{shipmentStatusLabel[s.status]}</td>
                  </tr>))}
              </tbody>
            </table>)}
        </CardBody>
      </Card>
    </div>);
}
