import { describe, expect, it } from 'vitest'
import { filterDrivers, filterShipments, filterVehicles } from './filters'

const vehicles = [
  {
    id: 'v1',
    plateNumber: 'MH-01-AB-1000',
    make: 'Tata',
    model: 'Prima',
    type: 'Truck',
    status: 'active',
    lastMaintenance: '2026-01-15T00:00:00.000Z',
    assignedDriverId: 'd1',
    currentLocation: { label: 'Mumbai Hub', lat: 0, lng: 0 },
  },
]

const drivers = [
  {
    id: 'd1',
    firstName: 'Arjun',
    lastName: 'Mehta',
    email: 'arjun@fleetflow.io',
    phone: '+91 9000000000',
    licenseNumber: 'MH-2015-100001',
    status: 'available',
    assignedVehicleId: 'v1',
    joinedAt: '2025-06-01T00:00:00.000Z',
  },
]

const shipments = [
  {
    id: 's1',
    referenceCode: 'FF-2026-1001',
    customerName: 'Acme Corp',
    customerEmail: 'a@acme.io',
    customerPhone: '+91 9111111111',
    status: 'in_transit',
    createdAt: '2026-02-01T00:00:00.000Z',
    pickup: { address: 'Mumbai', lat: 0, lng: 0, scheduledAt: '2026-02-02T00:00:00.000Z' },
    delivery: { address: 'Pune', lat: 0, lng: 0, scheduledAt: '2026-02-03T00:00:00.000Z' },
  },
]

const baseFilters = {
  search: '',
  vehicleStatus: 'all',
  driverStatus: 'all',
  shipmentStatus: 'all',
  dateFrom: '',
  dateTo: '',
  location: '',
}

describe('filterVehicles', () => {
  it('filters by plate search', () => {
    const result = filterVehicles(vehicles, { ...baseFilters, search: 'MH-01' }, drivers)
    expect(result).toHaveLength(1)
  })

  it('filters by vehicle status', () => {
    const result = filterVehicles(vehicles, { ...baseFilters, vehicleStatus: 'idle' }, drivers)
    expect(result).toHaveLength(0)
  })
})

describe('filterDrivers', () => {
  it('filters by name search', () => {
    const result = filterDrivers(drivers, { ...baseFilters, search: 'Arjun' }, vehicles)
    expect(result).toHaveLength(1)
  })
})

describe('filterShipments', () => {
  it('filters by reference code', () => {
    const result = filterShipments(shipments, { ...baseFilters, search: 'FF-2026' })
    expect(result).toHaveLength(1)
  })

  it('filters by shipment status', () => {
    const result = filterShipments(shipments, { ...baseFilters, shipmentStatus: 'delivered' })
    expect(result).toHaveLength(0)
  })
})
