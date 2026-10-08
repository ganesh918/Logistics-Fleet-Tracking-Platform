const now = new Date()
export const daysAgo = (n) => new Date(now.getTime() - n * 86400000).toISOString()

const cities = [
  { label: 'Mumbai Hub', lat: 19.076, lng: 72.8777 },
  { label: 'Bangalore Ring Rd', lat: 12.9716, lng: 77.5946 },
  { label: 'Delhi Service Center', lat: 28.6139, lng: 77.209 },
  { label: 'Chennai Depot', lat: 13.0827, lng: 80.2707 },
  { label: 'Ahmedabad Yard', lat: 23.0225, lng: 72.5714 },
  { label: 'Hyderabad Logistics Park', lat: 17.385, lng: 78.4867 },
  { label: 'Pune Industrial Zone', lat: 18.5204, lng: 73.8567 },
  { label: 'Kolkata Port Gate', lat: 22.5726, lng: 88.3639 },
  { label: 'Jaipur Freight Terminal', lat: 26.9124, lng: 75.7873 },
  { label: 'Kochi Coastal Hub', lat: 9.9312, lng: 76.2673 },
  { label: 'Lucknow North Depot', lat: 26.8467, lng: 80.9462 },
  { label: 'Indore Central Yard', lat: 22.7196, lng: 75.8577 },
]

const makes = [
  ['Volvo', 'FH16', 'Heavy truck', 22000],
  ['Mercedes-Benz', 'Actros', 'Heavy truck', 24000],
  ['Tata', 'Prima', 'Medium truck', 16000],
  ['Ashok Leyland', 'U-Truck', 'Light truck', 12000],
  ['Eicher', 'Pro 6031', 'Medium truck', 18000],
  ['Scania', 'R500', 'Heavy truck', 26000],
  ['MAN', 'TGX', 'Heavy truck', 25000],
  ['Mahindra', 'Blazo', 'Medium truck', 15000],
]

const statuses = ['active', 'active', 'active', 'idle', 'maintenance', 'offline']
const stateCodes = ['MH', 'KA', 'DL', 'TN', 'GJ', 'RJ', 'UP', 'WB', 'TS', 'KL']

const firstNames = [
  'Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Karan', 'Divya', 'Rohan', 'Meera',
  'Aditya', 'Kavya', 'Nikhil', 'Pooja', 'Suresh', 'Lakshmi', 'Manoj', 'Neha', 'Deepak', 'Isha',
  'Harish', 'Tanvi', 'Gaurav', 'Shreya', 'Amit', 'Nandini', 'Varun', 'Ritu', 'Sanjay', 'Preeti',
]

const lastNames = [
  'Mehta', 'Nair', 'Singh', 'Reddy', 'Patel', 'Sharma', 'Iyer', 'Gupta', 'Khan', 'Desai',
  'Joshi', 'Malhotra', 'Verma', 'Chopra', 'Bose', 'Menon', 'Rao', 'Pillai', 'Kulkarni', 'Das',
]

/** Real portrait photos (RandomUser.me — photographic assets). */
function driverPhoto(index, gender) {
  const g = gender === 'women' ? 'women' : 'men'
  const id = (index % 90) + 1
  return `https://randomuser.me/api/portraits/${g}/${id}.jpg`
}

export function generateDrivers(count = 24) {
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[(i * 3) % lastNames.length]
    const gender = i % 3 === 0 ? 'women' : 'men'
    const id = `drv-${String(i + 1).padStart(3, '0')}`
    const statusPool = ['available', 'on_delivery', 'on_delivery', 'off_duty', 'unavailable']
    return {
      id,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@fleetflow.io`,
      phone: `+91 9${String(100000000 + i * 1234567).slice(0, 9)}`,
      licenseNumber: `${stateCodes[i % stateCodes.length]}-20${10 + (i % 15)}-${100000 + i}`,
      status: statusPool[i % statusPool.length],
      assignedVehicleId: i < 20 ? `veh-${String(i + 1).padStart(3, '0')}` : null,
      rating: Math.round((4.1 + (i % 9) * 0.1) * 10) / 10,
      totalDeliveries: 180 + i * 47,
      onTimeRate: 85 + (i % 14),
      avatarUrl: driverPhoto(i, gender),
      joinedAt: daysAgo(400 + i * 45),
    }
  })
}

export function generateVehicles(count = 32, drivers) {
  return Array.from({ length: count }, (_, i) => {
    const [make, model, type, capacity] = makes[i % makes.length]
    const city = cities[i % cities.length]
    const status = statuses[i % statuses.length]
    const id = `veh-${String(i + 1).padStart(3, '0')}`
    const driver = drivers[i]
    const sc = stateCodes[i % stateCodes.length]
    return {
      id,
      plateNumber: `${sc}-${String(10 + (i % 89)).padStart(2, '0')}-FL-${4000 + i}`,
      make,
      model,
      year: 2018 + (i % 7),
      type,
      status,
      fuelLevel: 12 + ((i * 17) % 88),
      mileage: 32000 + i * 5840,
      lastMaintenance: daysAgo(15 + (i % 120)),
      nextMaintenanceDue: daysAgo(-20 + (i % 40)),
      assignedDriverId: driver?.id ?? null,
      currentLocation: { ...city, label: city.label },
      capacityKg: capacity,
      vin: `VIN${String(1000000000000 + i * 99991).slice(0, 14)}`,
      maintenanceHistory:
        i % 4 === 0
          ? [
              {
                id: `mnt-${i}`,
                date: daysAgo(30 + i),
                type: 'Scheduled service',
                cost: 650 + (i % 8) * 120,
                notes: 'Filters, fluids, brake inspection',
              },
            ]
          : [],
    }
  })
}

export function generateNotifications(vehicles, drivers, shipments) {
  const templates = [
    (v) => ({
      type: 'maintenance_due',
      title: `Maintenance due: ${v.plateNumber}`,
      message: `Service window ends in ${2 + (v.id.length % 5)} days. Schedule at ${v.currentLocation.label}.`,
      severity: 'warning',
      relatedEntityType: 'vehicle',
      relatedEntityId: v.id,
    }),
    (d) => ({
      type: 'driver_status',
      title: `Driver ${d.firstName} ${d.lastName} — ${d.status.replace('_', ' ')}`,
      message: `Status updated. On-time rate ${d.onTimeRate}%.`,
      severity: 'info',
      relatedEntityType: 'driver',
      relatedEntityId: d.id,
    }),
    (s) => ({
      type: s.status === 'delayed' ? 'shipment_delayed' : 'delivery_update',
      title: `${s.referenceCode} ${s.status.replace('_', ' ')}`,
      message: `Customer ${s.customerName}. Priority: ${s.priority}.`,
      severity: s.status === 'delayed' ? 'critical' : 'info',
      relatedEntityType: 'shipment',
      relatedEntityId: s.id,
    }),
  ]

  const items = []
  let n = 0
  for (const v of vehicles.slice(0, 12)) {
    const t = templates[0](v)
    items.push({
      id: `ntf-${++n}`,
      ...t,
      createdAt: daysAgo(0.05 + n * 0.08),
      read: n % 4 === 0,
    })
  }
  for (const d of drivers.slice(0, 8)) {
    const t = templates[1](d)
    items.push({
      id: `ntf-${++n}`,
      ...t,
      createdAt: daysAgo(0.1 + n * 0.06),
      read: n % 5 === 0,
    })
  }
  for (const s of shipments) {
    const t = templates[2](s)
    items.push({
      id: `ntf-${++n}`,
      ...t,
      createdAt: daysAgo(0.02 + n * 0.04),
      read: n % 3 === 0,
    })
  }

  const extras = [
    {
      type: 'system',
      title: 'Fleet telematics sync complete',
      message: 'GPS positions refreshed for all active units.',
      severity: 'info',
    },
    {
      type: 'shipment_delayed',
      title: 'Weather alert — Western corridor',
      message: 'Heavy rain may affect ETAs on NH-48 for 6 hours.',
      severity: 'critical',
    },
    {
      type: 'maintenance_due',
      title: 'Bulk service reminder',
      message: '8 vehicles due for quarterly inspection this week.',
      severity: 'warning',
    },
    {
      type: 'delivery_update',
      title: 'Customer satisfaction pulse',
      message: 'Weekly CSAT 4.7/5 from 128 delivered orders.',
      severity: 'info',
    },
  ]

  for (const e of extras) {
    items.push({
      id: `ntf-${++n}`,
      ...e,
      createdAt: daysAgo(0.15 + n * 0.03),
      read: false,
    })
  }

  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function generateActivities(drivers, vehicles) {
  const acts = []
  let i = 0
  for (const d of drivers.slice(0, 6)) {
    acts.push({
      id: `act-${++i}`,
      timestamp: daysAgo(0.1 * i),
      actor: `${d.firstName} ${d.lastName}`,
      action: 'Completed pre-trip inspection',
      entityType: 'driver',
      entityId: d.id,
    })
  }
  for (const v of vehicles.slice(0, 6)) {
    acts.push({
      id: `act-${++i}`,
      timestamp: daysAgo(0.08 * i),
      actor: 'System',
      action: `Fuel level synced for ${v.plateNumber}`,
      entityType: 'vehicle',
      entityId: v.id,
    })
  }
  return acts
}
