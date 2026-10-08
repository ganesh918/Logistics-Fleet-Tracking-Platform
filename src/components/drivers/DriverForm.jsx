import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { driverStatusLabel } from '../../utils/statusStyles'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  status: z.enum(['available', 'on_delivery', 'off_duty', 'unavailable']),
  assignedVehicleId: z.string(),
})

export function DriverForm({ initial, vehicles, onSubmit, onCancel, loading, submitLabel = 'Save driver' }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          firstName: initial.firstName,
          lastName: initial.lastName,
          email: initial.email,
          phone: initial.phone,
          licenseNumber: initial.licenseNumber,
          status: initial.status,
          assignedVehicleId: initial.assignedVehicleId ?? '',
        }
      : {
          status: 'available',
          assignedVehicleId: '',
        },
  })

  const statusOptions = Object.entries(driverStatusLabel).map(([value, label]) => ({ value, label }))
  const vehicleOptions = [
    { value: '', label: 'Unassigned' },
    ...vehicles.map((v) => ({ value: v.id, label: v.plateNumber })),
  ]

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(v))}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
        <Input
          label="License number"
          className="sm:col-span-2"
          error={errors.licenseNumber?.message}
          {...register('licenseNumber')}
        />
        <Select label="Status" options={statusOptions} error={errors.status?.message} {...register('status')} />
        <Select label="Assigned vehicle" options={vehicleOptions} {...register('assignedVehicleId')} />
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
