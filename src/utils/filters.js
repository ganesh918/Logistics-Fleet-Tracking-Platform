import { parseISO } from 'date-fns';
function matchesSearch(query, ...fields) {
    if (!query.trim())
        return true;
    const q = query.toLowerCase();
    return fields.some((f) => f?.toLowerCase().includes(q));
}
function inDateRange(iso, from, to) {
    if (!from && !to)
        return true;
    const date = parseISO(iso);
    if (from && date < parseISO(from))
        return false;
    if (to && date > parseISO(`${to}T23:59:59`))
        return false;
    return true;
}
export function filterVehicles(vehicles, filters, drivers) {
    return vehicles.filter((v) => {
        const driver = drivers.find((d) => d.id === v.assignedDriverId);
        const location = v.currentLocation.label ?? `${v.currentLocation.lat}, ${v.currentLocation.lng}`;
        if (filters.vehicleStatus !== 'all' && v.status !== filters.vehicleStatus)
            return false;
        if (filters.location &&
            !location.toLowerCase().includes(filters.location.toLowerCase()))
            return false;
        if (!inDateRange(v.lastMaintenance, filters.dateFrom, filters.dateTo))
            return false;
        return matchesSearch(filters.search, v.plateNumber, v.make, v.model, v.type, driver ? `${driver.firstName} ${driver.lastName}` : undefined);
    });
}
export function filterDrivers(drivers, filters, vehicles) {
    return drivers.filter((d) => {
        const vehicle = vehicles.find((v) => v.id === d.assignedVehicleId);
        if (filters.driverStatus !== 'all' && d.status !== filters.driverStatus)
            return false;
        if (filters.location &&
            vehicle?.currentLocation.label &&
            !vehicle.currentLocation.label.toLowerCase().includes(filters.location.toLowerCase()))
            return false;
        if (!inDateRange(d.joinedAt, filters.dateFrom, filters.dateTo))
            return false;
        return matchesSearch(filters.search, d.firstName, d.lastName, d.email, d.phone, d.licenseNumber, vehicle?.plateNumber);
    });
}
export function filterShipments(shipments, filters) {
    return shipments.filter((s) => {
        if (filters.shipmentStatus !== 'all' && s.status !== filters.shipmentStatus)
            return false;
        const loc = `${s.pickup.address} ${s.delivery.address}`;
        if (filters.location && !loc.toLowerCase().includes(filters.location.toLowerCase()))
            return false;
        if (!inDateRange(s.createdAt, filters.dateFrom, filters.dateTo))
            return false;
        return matchesSearch(filters.search, s.referenceCode, s.customerName, s.customerEmail, s.customerPhone, s.pickup.address, s.delivery.address);
    });
}
