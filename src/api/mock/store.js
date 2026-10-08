import { mockActivities, mockDashboardStats, mockDeliveryPerformance, mockDrivers, mockNotifications, mockShipments, mockVehicles, } from './data';
/** In-memory store for mock CRUD — replace with API when backend is ready. */
let vehicles = structuredClone(mockVehicles);
let drivers = structuredClone(mockDrivers);
let shipments = structuredClone(mockShipments);
let notifications = structuredClone(mockNotifications);
let activities = structuredClone(mockActivities);
export const mockStore = {
    getVehicles: () => vehicles,
    setVehicles: (next) => {
        vehicles = next;
    },
    getDrivers: () => drivers,
    setDrivers: (next) => {
        drivers = next;
    },
    getShipments: () => shipments,
    setShipments: (next) => {
        shipments = next;
    },
    getNotifications: () => notifications,
    setNotifications: (next) => {
        notifications = next;
    },
    getActivities: () => activities,
    prependActivity: (item) => {
        activities = [item, ...activities].slice(0, 50);
    },
    getDashboardStats: () => ({
        ...mockDashboardStats,
        totalVehicles: vehicles.length,
        totalDrivers: drivers.length,
        activeShipments: shipments.filter((s) => ['pending', 'picked_up', 'in_transit', 'delayed'].includes(s.status)).length,
        deliveredCount: shipments.filter((s) => s.status === 'delivered').length,
        inTransitCount: shipments.filter((s) => s.status === 'in_transit').length,
        delayedCount: shipments.filter((s) => s.status === 'delayed').length,
    }),
    getDeliveryPerformance: () => mockDeliveryPerformance,
};
