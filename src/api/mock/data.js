import {
  daysAgo,
  generateActivities,
  generateDrivers,
  generateNotifications,
  generateVehicles,
} from './generateFleet'

export const mockDrivers = generateDrivers(24)
export const mockVehicles = generateVehicles(32, mockDrivers)

for (let i = 0; i < 20; i++) {
  mockDrivers[i].assignedVehicleId = mockVehicles[i].id
  mockVehicles[i].assignedDriverId = mockDrivers[i].id
}

const route = (points) => points

export const mockShipments = [
  {
    id: 'shp-1001',
    referenceCode: 'FF-2026-1001',
    customerName: 'Nova Retail Pvt Ltd',
    customerEmail: 'ops@novaretail.in',
    customerPhone: '+91 80000 11111',
    pickup: {
      lat: 19.076,
      lng: 72.8777,
      address: 'Mumbai Central Warehouse, Dock 4',
      scheduledAt: daysAgo(1),
    },
    delivery: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'Pune Industrial Park, Gate 2',
      scheduledAt: daysAgo(-0.2),
    },
    status: 'in_transit',
    assignedDriverId: 'drv-001',
    assignedVehicleId: 'veh-001',
    weightKg: 8400,
    priority: 'high',
    estimatedDeliveryAt: daysAgo(-0.1),
    createdAt: daysAgo(2),
    route: route([
      { lat: 19.076, lng: 72.8777 },
      { lat: 18.96, lng: 73.08 },
      { lat: 18.5204, lng: 73.8567 },
    ]),
    timeline: [
      { id: 'tl-1', timestamp: daysAgo(2), status: 'pending', location: 'Mumbai', note: 'Shipment created' },
      { id: 'tl-2', timestamp: daysAgo(1), status: 'picked_up', location: 'Mumbai Central', note: 'Cargo loaded' },
      { id: 'tl-3', timestamp: daysAgo(0.3), status: 'in_transit', location: 'NH-48', note: 'En route' },
    ],
  },
  {
    id: 'shp-1002',
    referenceCode: 'FF-2026-1002',
    customerName: 'TechParts India',
    customerEmail: 'logistics@techparts.in',
    customerPhone: '+91 80000 22222',
    pickup: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore Electronics Hub',
      scheduledAt: daysAgo(0.5),
    },
    delivery: {
      lat: 13.3409,
      lng: 77.101,
      address: 'Tumkur Distribution Center',
      scheduledAt: daysAgo(-0.5),
    },
    status: 'delayed',
    assignedDriverId: 'drv-002',
    assignedVehicleId: 'veh-002',
    weightKg: 3200,
    priority: 'critical',
    estimatedDeliveryAt: daysAgo(0.2),
    createdAt: daysAgo(1),
    route: route([
      { lat: 12.9716, lng: 77.5946 },
      { lat: 13.15, lng: 77.35 },
      { lat: 13.3409, lng: 77.101 },
    ]),
    timeline: [
      { id: 'tl-4', timestamp: daysAgo(1), status: 'pending', location: 'Bangalore', note: 'Confirmed' },
      { id: 'tl-5', timestamp: daysAgo(0.4), status: 'in_transit', location: 'NH-48', note: 'Delay reported' },
      { id: 'tl-6', timestamp: daysAgo(0.1), status: 'delayed', location: 'Nelamangala', note: 'ETA +2h' },
    ],
  },
  {
    id: 'shp-1003',
    referenceCode: 'FF-2026-1003',
    customerName: 'FreshFarm Co-op',
    customerEmail: 'dispatch@freshfarm.co',
    customerPhone: '+91 80000 33333',
    pickup: {
      lat: 28.6139,
      lng: 77.209,
      address: 'Delhi Cold Chain Facility',
      scheduledAt: daysAgo(3),
    },
    delivery: {
      lat: 26.9124,
      lng: 75.7873,
      address: 'Jaipur Market Hub',
      scheduledAt: daysAgo(2),
    },
    status: 'delivered',
    assignedDriverId: 'drv-003',
    assignedVehicleId: 'veh-003',
    weightKg: 5600,
    priority: 'normal',
    estimatedDeliveryAt: daysAgo(2),
    createdAt: daysAgo(4),
    route: route([
      { lat: 28.6139, lng: 77.209 },
      { lat: 27.5, lng: 76.5 },
      { lat: 26.9124, lng: 75.7873 },
    ]),
    timeline: [
      { id: 'tl-7', timestamp: daysAgo(4), status: 'pending', location: 'Delhi', note: 'Created' },
      { id: 'tl-8', timestamp: daysAgo(2), status: 'delivered', location: 'Jaipur', note: 'POD captured' },
    ],
  },
  {
    id: 'shp-1004',
    referenceCode: 'FF-2026-1004',
    customerName: 'Coastal Exports',
    customerEmail: 'ship@coastal.in',
    customerPhone: '+91 80000 44444',
    pickup: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Chennai Port Warehouse',
      scheduledAt: daysAgo(-1),
    },
    delivery: {
      lat: 11.0168,
      lng: 76.9558,
      address: 'Coimbatore FTZ',
      scheduledAt: daysAgo(-2),
    },
    status: 'pending',
    assignedDriverId: 'drv-004',
    assignedVehicleId: 'veh-004',
    weightKg: 11000,
    priority: 'normal',
    estimatedDeliveryAt: daysAgo(-1.5),
    createdAt: daysAgo(0.2),
    route: route([
      { lat: 13.0827, lng: 80.2707 },
      { lat: 12.5, lng: 79.5 },
      { lat: 11.0168, lng: 76.9558 },
    ]),
    timeline: [
      { id: 'tl-9', timestamp: daysAgo(0.2), status: 'pending', location: 'Chennai', note: 'Awaiting pickup' },
    ],
  },
  {
    id: 'shp-1005',
    referenceCode: 'FF-2026-1005',
    customerName: 'Metro Builders',
    customerEmail: 'procurement@metrobuild.in',
    customerPhone: '+91 80000 55555',
    pickup: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'Ahmedabad Steel Yard',
      scheduledAt: daysAgo(5),
    },
    delivery: {
      lat: 21.1702,
      lng: 72.8311,
      address: 'Surat Construction Site B',
      scheduledAt: daysAgo(4),
    },
    status: 'picked_up',
    assignedDriverId: 'drv-005',
    assignedVehicleId: 'veh-005',
    weightKg: 15000,
    priority: 'high',
    estimatedDeliveryAt: daysAgo(3),
    createdAt: daysAgo(6),
    route: route([
      { lat: 23.0225, lng: 72.5714 },
      { lat: 22.3, lng: 72.7 },
      { lat: 21.1702, lng: 72.8311 },
    ]),
    timeline: [
      { id: 'tl-10', timestamp: daysAgo(6), status: 'pending', location: 'Ahmedabad', note: 'Created' },
      { id: 'tl-11', timestamp: daysAgo(4), status: 'picked_up', location: 'Ahmedabad', note: 'Loaded' },
    ],
  },
  {
    id: 'shp-1006',
    referenceCode: 'FF-2026-1006',
    customerName: 'PharmaExpress',
    customerEmail: 'coldchain@pharma.in',
    customerPhone: '+91 80000 66666',
    pickup: {
      lat: 17.385,
      lng: 78.4867,
      address: 'Hyderabad GMP Warehouse',
      scheduledAt: daysAgo(0.3),
    },
    delivery: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore Hospital District',
      scheduledAt: daysAgo(-0.8),
    },
    status: 'in_transit',
    assignedDriverId: 'drv-006',
    assignedVehicleId: 'veh-006',
    weightKg: 2100,
    priority: 'critical',
    estimatedDeliveryAt: daysAgo(-0.2),
    createdAt: daysAgo(1),
    route: route([
      { lat: 17.385, lng: 78.4867 },
      { lat: 15.5, lng: 78.0 },
      { lat: 12.9716, lng: 77.5946 },
    ]),
    timeline: [
      { id: 'tl-12', timestamp: daysAgo(1), status: 'pending', location: 'Hyderabad', note: 'Created' },
      { id: 'tl-13', timestamp: daysAgo(0.2), status: 'in_transit', location: 'NH-44', note: 'Cold chain stable' },
    ],
  },
]

export const mockNotifications = generateNotifications(mockVehicles, mockDrivers, mockShipments)
export const mockActivities = generateActivities(mockDrivers, mockVehicles)

export const mockDashboardStats = {
  totalVehicles: mockVehicles.length,
  totalDrivers: mockDrivers.length,
  activeShipments: mockShipments.filter((s) =>
    ['pending', 'picked_up', 'in_transit', 'delayed'].includes(s.status),
  ).length,
  deliveredCount: mockShipments.filter((s) => s.status === 'delivered').length,
  inTransitCount: mockShipments.filter((s) => s.status === 'in_transit').length,
  delayedCount: mockShipments.filter((s) => s.status === 'delayed').length,
  onTimeDeliveryRate: 94.2,
  avgFleetUtilization: 82,
  fuelEfficiencyScore: 88,
}

export const mockDeliveryPerformance = [
  { date: 'Sep 30', delivered: 42, delayed: 3, onTimeRate: 93 },
  { date: 'Oct 1', delivered: 38, delayed: 2, onTimeRate: 95 },
  { date: 'Oct 2', delivered: 45, delayed: 5, onTimeRate: 90 },
  { date: 'Oct 3', delivered: 51, delayed: 4, onTimeRate: 92 },
  { date: 'Oct 4', delivered: 47, delayed: 2, onTimeRate: 96 },
  { date: 'Oct 5', delivered: 44, delayed: 6, onTimeRate: 88 },
  { date: 'Oct 6', delivered: 29, delayed: 3, onTimeRate: 91 },
]
