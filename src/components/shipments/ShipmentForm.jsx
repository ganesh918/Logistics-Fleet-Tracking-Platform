import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { shipmentStatusLabel } from '../../utils/statusStyles'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  pickupAddress: z.string().min(5),
  deliveryAddress: z.string().min(5),
  pickupLat: z.coerce.number(),
  pickupLng: z.coerce.number(),
  deliveryLat: z.coerce.number(),
  deliveryLng: z.coerce.number(),
  pickupScheduledAt: z.string().min(1),
  deliveryScheduledAt: z.string().min(1),
  status: z.enum(['pending', 'picked_up', 'in_transit', 'delivered', 'delayed', 'cancelled']),
  assignedDriverId: z.string(),
  assignedVehicleId: z.string(),
  weightKg: z.coerce.number().min(1),
  priority: z.enum(['low', 'normal', 'high', 'critical']),
  estimatedDeliveryAt: z.string().min(1),
})

const emptyDefaults = {
  status: 'pending',
  priority: 'normal',
  assignedDriverId: '',
  assignedVehicleId: '',
  pickupLat: 19.076,
  pickupLng: 72.8777,
  deliveryLat: 18.5204,
  deliveryLng: 73.8567,
}

export function ShipmentForm({
  drivers,
  vehicles,
  initial,
  onSubmit,
  onCancel,
  loading,
  submitLabel = 'Create shipment',
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial ?? emptyDefaults,
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(v))}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Customer name" error={errors.customerName?.message} {...register('customerName')} />
        <Input label="Customer phone" error={errors.customerPhone?.message} {...register('customerPhone')} />
        <Input
          label="Customer email"
          className="sm:col-span-2"
          error={errors.customerEmail?.message}
          {...register('customerEmail')}
        />
        <Input
          label="Pickup address"
          className="sm:col-span-2"
          error={errors.pickupAddress?.message}
          {...register('pickupAddress')}
        />
        <Input
          label="Delivery address"
          className="sm:col-span-2"
          error={errors.deliveryAddress?.message}
          {...register('deliveryAddress')}
        />
        <Input label="Pickup lat" type="number" step="any" {...register('pickupLat')} />
        <Input label="Pickup lng" type="number" step="any" {...register('pickupLng')} />
        <Input label="Delivery lat" type="number" step="any" {...register('deliveryLat')} />
        <Input label="Delivery lng" type="number" step="any" {...register('deliveryLng')} />
        <Input
          label="Pickup scheduled"
          type="datetime-local"
          error={errors.pickupScheduledAt?.message}
          {...register('pickupScheduledAt')}
        />
        <Input
          label="Delivery scheduled"
          type="datetime-local"
          error={errors.deliveryScheduledAt?.message}
          {...register('deliveryScheduledAt')}
        />
        <Input
          label="Estimated delivery"
          type="datetime-local"
          error={errors.estimatedDeliveryAt?.message}
          {...register('estimatedDeliveryAt')}
        />
        <Select
          label="Status"
          options={Object.entries(shipmentStatusLabel).map(([value, label]) => ({ value, label }))}
          {...register('status')}
        />
        <Select
          label="Priority"
          options={[
            { value: 'low', label: 'Low' },
            { value: 'normal', label: 'Normal' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ]}
          {...register('priority')}
        />
        <Select
          label="Driver"
          options={[
            { value: '', label: 'Unassigned' },
            ...drivers.map((d) => ({ value: d.id, label: `${d.firstName} ${d.lastName}` })),
          ]}
          {...register('assignedDriverId')}
        />
        <Select
          label="Vehicle"
          options={[
            { value: '', label: 'Unassigned' },
            ...vehicles.map((v) => ({ value: v.id, label: v.plateNumber })),
          ]}
          {...register('assignedVehicleId')}
        />
        <Input label="Weight (kg)" type="number" error={errors.weightKg?.message} {...register('weightKg')} />
      </div>
      <div className="flex justify-end gap-2 border-t border-surface-100 pt-4 dark:border-surface-200/15">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
