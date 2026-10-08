import { apiRequest } from './client';
import { USE_MOCK_API } from './config';
import { mockDelay } from './mock/delay';
import { mockStore } from './mock/store';
export const fleetApi = {
    async fetchDashboard() {
        if (USE_MOCK_API) {
            await mockDelay();
            return {
                stats: mockStore.getDashboardStats(),
                performance: mockStore.getDeliveryPerformance(),
                activities: mockStore.getActivities(),
            };
        }
        return apiRequest('/dashboard');
    },
    async fetchVehicles() {
        if (USE_MOCK_API) {
            await mockDelay();
            return mockStore.getVehicles();
        }
        return apiRequest('/vehicles');
    },
    async fetchVehicle(id) {
        if (USE_MOCK_API) {
            await mockDelay();
            const vehicle = mockStore.getVehicles().find((v) => v.id === id);
            if (!vehicle)
                throw new Error('Vehicle not found');
            return vehicle;
        }
        return apiRequest(`/vehicles/${id}`);
    },
    async createVehicle(payload) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            const vehicle = {
                ...payload,
                id: `veh-${crypto.randomUUID().slice(0, 8)}`,
                maintenanceHistory: [],
            };
            mockStore.setVehicles([vehicle, ...mockStore.getVehicles()]);
            return vehicle;
        }
        return apiRequest('/vehicles', { method: 'POST', body: payload });
    },
    async updateVehicle(id, payload) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            const list = mockStore.getVehicles();
            const idx = list.findIndex((v) => v.id === id);
            if (idx === -1)
                throw new Error('Vehicle not found');
            const updated = { ...list[idx], ...payload, id };
            list[idx] = updated;
            mockStore.setVehicles([...list]);
            return updated;
        }
        return apiRequest(`/vehicles/${id}`, { method: 'PATCH', body: payload });
    },
    async deleteVehicle(id) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            mockStore.setVehicles(mockStore.getVehicles().filter((v) => v.id !== id));
            return;
        }
        return apiRequest(`/vehicles/${id}`, { method: 'DELETE' });
    },
    async fetchDrivers() {
        if (USE_MOCK_API) {
            await mockDelay();
            return mockStore.getDrivers();
        }
        return apiRequest('/drivers');
    },
    async fetchDriver(id) {
        if (USE_MOCK_API) {
            await mockDelay();
            const driver = mockStore.getDrivers().find((d) => d.id === id);
            if (!driver)
                throw new Error('Driver not found');
            return driver;
        }
        return apiRequest(`/drivers/${id}`);
    },
    async createDriver(payload) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            const driver = {
                ...payload,
                id: `drv-${crypto.randomUUID().slice(0, 8)}`,
                rating: payload.rating ?? 4.5,
                totalDeliveries: payload.totalDeliveries ?? 0,
                onTimeRate: payload.onTimeRate ?? 100,
                joinedAt: payload.joinedAt ?? new Date().toISOString(),
                avatarUrl:
                    payload.avatarUrl ??
                    `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 90) + 1}.jpg`,
            };
            mockStore.setDrivers([driver, ...mockStore.getDrivers()]);
            return driver;
        }
        return apiRequest('/drivers', { method: 'POST', body: payload });
    },
    async updateDriver(id, payload) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            const list = mockStore.getDrivers();
            const idx = list.findIndex((d) => d.id === id);
            if (idx === -1)
                throw new Error('Driver not found');
            const updated = { ...list[idx], ...payload, id };
            list[idx] = updated;
            mockStore.setDrivers([...list]);
            return updated;
        }
        return apiRequest(`/drivers/${id}`, { method: 'PATCH', body: payload });
    },
    async deleteDriver(id) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            mockStore.setDrivers(mockStore.getDrivers().filter((d) => d.id !== id));
            const vehicles = mockStore.getVehicles().map((v) =>
                v.assignedDriverId === id ? { ...v, assignedDriverId: null } : v,
            );
            mockStore.setVehicles(vehicles);
            return;
        }
        return apiRequest(`/drivers/${id}`, { method: 'DELETE' });
    },
    async fetchShipments() {
        if (USE_MOCK_API) {
            await mockDelay();
            return mockStore.getShipments();
        }
        return apiRequest('/shipments');
    },
    async fetchShipment(id) {
        if (USE_MOCK_API) {
            await mockDelay();
            const shipment = mockStore.getShipments().find((s) => s.id === id);
            if (!shipment)
                throw new Error('Shipment not found');
            return shipment;
        }
        return apiRequest(`/shipments/${id}`);
    },
    async createShipment(payload) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            const shipment = {
                ...payload,
                id: `shp-${crypto.randomUUID().slice(0, 8)}`,
                referenceCode: `FF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                createdAt: new Date().toISOString(),
                timeline: [
                    {
                        id: `tl-${crypto.randomUUID().slice(0, 6)}`,
                        timestamp: new Date().toISOString(),
                        status: payload.status,
                        location: payload.pickup.address,
                        note: 'Shipment created',
                    },
                ],
            };
            mockStore.setShipments([shipment, ...mockStore.getShipments()]);
            return shipment;
        }
        return apiRequest('/shipments', { method: 'POST', body: payload });
    },
    async updateShipment(id, payload) {
        if (USE_MOCK_API) {
            await mockDelay(300);
            const list = mockStore.getShipments();
            const idx = list.findIndex((s) => s.id === id);
            if (idx === -1)
                throw new Error('Shipment not found');
            const updated = { ...list[idx], ...payload, id };
            list[idx] = updated;
            mockStore.setShipments([...list]);
            return updated;
        }
        return apiRequest(`/shipments/${id}`, { method: 'PATCH', body: payload });
    },
    async fetchNotifications() {
        if (USE_MOCK_API) {
            await mockDelay();
            return mockStore.getNotifications();
        }
        return apiRequest('/notifications');
    },
    async markNotificationRead(id) {
        if (USE_MOCK_API) {
            await mockDelay(150);
            mockStore.setNotifications(mockStore.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)));
            return;
        }
        return apiRequest(`/notifications/${id}/read`, { method: 'POST' });
    },
    async markAllNotificationsRead() {
        if (USE_MOCK_API) {
            await mockDelay(150);
            mockStore.setNotifications(mockStore.getNotifications().map((n) => ({ ...n, read: true })));
            return;
        }
        return apiRequest('/notifications/read-all', { method: 'POST' });
    },
};
