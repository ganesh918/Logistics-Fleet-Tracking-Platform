import { describe, expect, it } from 'vitest'
import { searchFleet } from './globalSearch'

const data = {
  vehicles: [{ id: 'v1', plateNumber: 'KA-99-ZZ', make: 'Volvo', model: 'FH', vin: 'VIN123' }],
  drivers: [{ id: 'd1', firstName: 'Priya', lastName: 'Nair', email: 'priya@fleetflow.io', licenseNumber: 'KA-1' }],
  shipments: [
    {
      id: 's1',
      referenceCode: 'FF-2026-5555',
      customerName: 'Globex',
      customerEmail: 'x@globex.io',
      pickup: { address: 'Bangalore' },
      delivery: { address: 'Chennai' },
    },
  ],
}

describe('searchFleet', () => {
  it('returns empty for short query', () => {
    expect(searchFleet('a', data).total).toBe(0)
  })

  it('finds vehicle by plate', () => {
    const r = searchFleet('KA-99', data)
    expect(r.vehicles).toHaveLength(1)
    expect(r.total).toBeGreaterThan(0)
  })

  it('finds shipment by customer', () => {
    const r = searchFleet('Globex', data)
    expect(r.shipments).toHaveLength(1)
  })
})
