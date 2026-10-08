const LIMIT = 5

function scoreMatch(query, text) {
  if (!text) return 0
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (t === q) return 100
  if (t.startsWith(q)) return 80
  if (t.includes(q)) return 50
  return 0
}

export function searchFleet(query, { vehicles, drivers, shipments }) {
  const q = query.trim()
  if (q.length < 2) {
    return { vehicles: [], drivers: [], shipments: [], total: 0 }
  }

  const vehicleHits = vehicles
    .map((v) => ({
      item: v,
      score: Math.max(
        scoreMatch(q, v.plateNumber),
        scoreMatch(q, v.make),
        scoreMatch(q, v.model),
        scoreMatch(q, v.vin),
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((x) => x.item)

  const driverHits = drivers
    .map((d) => ({
      item: d,
      score: Math.max(
        scoreMatch(q, d.firstName),
        scoreMatch(q, d.lastName),
        scoreMatch(q, `${d.firstName} ${d.lastName}`),
        scoreMatch(q, d.email),
        scoreMatch(q, d.licenseNumber),
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((x) => x.item)

  const shipmentHits = shipments
    .map((s) => ({
      item: s,
      score: Math.max(
        scoreMatch(q, s.referenceCode),
        scoreMatch(q, s.customerName),
        scoreMatch(q, s.customerEmail),
        scoreMatch(q, s.pickup.address),
        scoreMatch(q, s.delivery.address),
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((x) => x.item)

  return {
    vehicles: vehicleHits,
    drivers: driverHits,
    shipments: shipmentHits,
    total: vehicleHits.length + driverHits.length + shipmentHits.length,
  }
}
