import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { vehicleStatusLabel } from '../../utils/statusStyles';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
const schema = z.object({
    plateNumber: z.string().min(4, 'Plate number is required'),
    make: z.string().min(2, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
    type: z.string().min(2, 'Type is required'),
    status: z.enum(['active', 'idle', 'maintenance', 'offline']),
    fuelLevel: z.coerce.number().min(0).max(100),
    mileage: z.coerce.number().min(0),
    lastMaintenance: z.string().min(1),
    nextMaintenanceDue: z.string().min(1),
    assignedDriverId: z.string(),
    capacityKg: z.coerce.number().min(100),
    vin: z.string().min(8, 'VIN is required'),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    locationLabel: z.string().min(2),
});
// fix typo min2 -> min
const schemaFixed = schema.extend({
    make: z.string().min(2, 'Make is required'),
});
export function VehicleForm({ initial, drivers, onSubmit, onCancel, loading, }) {
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schemaFixed),
        defaultValues: initial
            ? {
                plateNumber: initial.plateNumber,
                make: initial.make,
                model: initial.model,
                year: initial.year,
                type: initial.type,
                status: initial.status,
                fuelLevel: initial.fuelLevel,
                mileage: initial.mileage,
                lastMaintenance: initial.lastMaintenance.slice(0, 10),
                nextMaintenanceDue: initial.nextMaintenanceDue.slice(0, 10),
                assignedDriverId: initial.assignedDriverId ?? '',
                capacityKg: initial.capacityKg,
                vin: initial.vin,
                lat: initial.currentLocation.lat,
                lng: initial.currentLocation.lng,
                locationLabel: initial.currentLocation.label ?? '',
            }
            : {
                status: 'idle',
                fuelLevel: 100,
                year: new Date().getFullYear(),
                assignedDriverId: '',
                lat: 20.5937,
                lng: 78.9629,
                locationLabel: 'Depot',
            },
    });
    const statusOptions = Object.entries(vehicleStatusLabel).map(([value, label]) => ({
        value,
        label,
    }));
    const driverOptions = [
        { value: '', label: 'Unassigned' },
        ...drivers.map((d) => ({ value: d.id, label: `${d.firstName} ${d.lastName}` })),
    ];
    return (<form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(v))}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Plate number" error={errors.plateNumber?.message} {...register('plateNumber')}/>
        <Input label="VIN" error={errors.vin?.message} {...register('vin')}/>
        <Input label="Make" error={errors.make?.message} {...register('make')}/>
        <Input label="Model" error={errors.model?.message} {...register('model')}/>
        <Input label="Year" type="number" error={errors.year?.message} {...register('year')}/>
        <Input label="Vehicle type" error={errors.type?.message} {...register('type')}/>
        <Select label="Status" options={statusOptions} error={errors.status?.message} {...register('status')}/>
        <Select label="Assigned driver" options={driverOptions} {...register('assignedDriverId')}/>
        <Input label="Fuel level (%)" type="number" error={errors.fuelLevel?.message} {...register('fuelLevel')}/>
        <Input label="Mileage (km)" type="number" error={errors.mileage?.message} {...register('mileage')}/>
        <Input label="Capacity (kg)" type="number" error={errors.capacityKg?.message} {...register('capacityKg')}/>
        <Input label="Location label" error={errors.locationLabel?.message} {...register('locationLabel')}/>
        <Input label="Latitude" type="number" step="any" error={errors.lat?.message} {...register('lat')}/>
        <Input label="Longitude" type="number" step="any" error={errors.lng?.message} {...register('lng')}/>
        <Input label="Last maintenance" type="date" error={errors.lastMaintenance?.message} {...register('lastMaintenance')}/>
        <Input label="Next maintenance due" type="date" error={errors.nextMaintenanceDue?.message} {...register('nextMaintenanceDue')}/>
      </div>
      <div className="flex justify-end gap-2 border-t border-surface-100 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Save changes' : 'Add vehicle'}
        </Button>
      </div>
    </form>);
}
