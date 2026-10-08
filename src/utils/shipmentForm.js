function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function shipmentFormValuesFromEntity(s) {
  if (!s) return undefined
  return {
    customerName: s.customerName,
    customerEmail: s.customerEmail,
    customerPhone: s.customerPhone,
    pickupAddress: s.pickup.address,
    deliveryAddress: s.delivery.address,
    pickupLat: s.pickup.lat,
    pickupLng: s.pickup.lng,
    deliveryLat: s.delivery.lat,
    deliveryLng: s.delivery.lng,
    pickupScheduledAt: toLocalInput(s.pickup.scheduledAt),
    deliveryScheduledAt: toLocalInput(s.delivery.scheduledAt),
    status: s.status,
    assignedDriverId: s.assignedDriverId ?? '',
    assignedVehicleId: s.assignedVehicleId ?? '',
    weightKg: s.weightKg,
    priority: s.priority,
    estimatedDeliveryAt: toLocalInput(s.estimatedDeliveryAt),
  }
}

export function shipmentPayloadFromForm(v, existingRoute) {
  const route = existingRoute ?? [
    { lat: v.pickupLat, lng: v.pickupLng },
    { lat: (v.pickupLat + v.deliveryLat) / 2, lng: (v.pickupLng + v.deliveryLng) / 2 },
    { lat: v.deliveryLat, lng: v.deliveryLng },
  ]
  return {
    customerName: v.customerName,
    customerEmail: v.customerEmail,
    customerPhone: v.customerPhone,
    pickup: {
      address: v.pickupAddress,
      lat: v.pickupLat,
      lng: v.pickupLng,
      scheduledAt: new Date(v.pickupScheduledAt).toISOString(),
    },
    delivery: {
      address: v.deliveryAddress,
      lat: v.deliveryLat,
      lng: v.deliveryLng,
      scheduledAt: new Date(v.deliveryScheduledAt).toISOString(),
    },
    status: v.status,
    assignedDriverId: v.assignedDriverId || null,
    assignedVehicleId: v.assignedVehicleId || null,
    weightKg: v.weightKg,
    priority: v.priority,
    estimatedDeliveryAt: new Date(v.estimatedDeliveryAt).toISOString(),
    route,
  }
}
