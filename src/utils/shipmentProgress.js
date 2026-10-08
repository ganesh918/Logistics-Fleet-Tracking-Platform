const FLOW = ['pending', 'picked_up', 'in_transit', 'delivered']

export const shipmentFlowLabels = ['Created', 'Picked up', 'In transit', 'Delivered']

export function shipmentProgressIndex(status) {
  if (status === 'cancelled') return -1
  if (status === 'delayed') return 2
  const idx = FLOW.indexOf(status)
  return idx >= 0 ? idx : 0
}

export function shipmentProgressPercent(status) {
  const idx = shipmentProgressIndex(status)
  if (idx < 0) return 0
  return Math.round(((idx + 1) / FLOW.length) * 100)
}
