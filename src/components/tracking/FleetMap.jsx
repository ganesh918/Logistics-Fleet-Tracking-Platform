import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { map as mapColors } from '../../utils/themeColors'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

function vehicleIcon(selected, live) {
  const color = selected ? mapColors.vehicleSelected : mapColors.vehicle
  const size = selected ? 18 : 14
  const pulse = selected && live ? 'fleet-marker-pulse' : ''
  return new L.DivIcon({
    className: '',
    html: `<div class="${pulse}" style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px ${color}55, 0 4px 12px rgba(0,0,0,.25)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const pickupIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:${mapColors.pickup};min-width:22px;height:22px;border-radius:6px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700">P</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const deliveryIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:${mapColors.delivery};min-width:22px;height:22px;border-radius:6px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700">D</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function FitBounds({ points, focusId, shipmentId, showRoute }) {
  const map = useMap()
  const pointsRef = useRef(points)
  pointsRef.current = points

  useEffect(() => {
    const pts = pointsRef.current
    if (pts.length === 0) return
    const bounds = L.latLngBounds(pts.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: focusId ? 11 : 10 })
  }, [map, focusId, shipmentId, showRoute])

  return null
}

/** Wheel zoom only while the pointer is over the map (page scroll elsewhere). */
function ScrollWheelZoomOnHover() {
  const map = useMap()
  useEffect(() => {
    map.scrollWheelZoom.disable()
    const el = map.getContainer()
    const onEnter = () => map.scrollWheelZoom.enable()
    const onLeave = () => map.scrollWheelZoom.disable()
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      map.scrollWheelZoom.disable()
    }
  }, [map])
  return null
}

function MapResizeSync() {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer()
    const ro = new ResizeObserver(() => {
      map.invalidateSize()
    })
    ro.observe(el)
    map.invalidateSize()
    return () => ro.disconnect()
  }, [map])
  return null
}

function MapThemeSync() {
  const map = useMap()
  const { isDark } = useTheme()
  useEffect(() => {
    map.invalidateSize()
  }, [isDark, map])
  return null
}

const TILES = {
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
}

export function FleetMap({
  vehicles,
  shipment,
  height = '420px',
  selectedVehicleId,
  showRoute = true,
  showGeofence = false,
  livePulse = true,
  className = '',
  scrollWheelZoom = true,
  wheelZoomOnHover = false,
}) {
  const { isDark } = useTheme()
  const tiles = isDark ? TILES.dark : TILES.light

  const center = shipment
    ? [shipment.pickup.lat, shipment.pickup.lng]
    : vehicles[0]
      ? [vehicles[0].currentLocation.lat, vehicles[0].currentLocation.lng]
      : [20.5937, 78.9629]

  const boundsPoints = useMemo(
    () => [
      ...vehicles.map((v) => v.currentLocation),
      ...(shipment && showRoute ? [shipment.pickup, shipment.delivery, ...shipment.route] : []),
    ],
    [vehicles, shipment, showRoute],
  )

  const routePositions = shipment?.route?.map((p) => [p.lat, p.lng]) ?? []

  const shellClass =
    className.includes('h-full') || height === '100%'
      ? 'relative h-full min-h-[360px] overflow-hidden'
      : 'relative overflow-hidden rounded-2xl ring-1 ring-brand-600/15 dark:ring-brand-400/20'

  return (
    <div className={`${shellClass} ${className}`} style={height !== '100%' ? { height } : undefined}>
      <MapContainer
        center={center}
        zoom={6}
        className="z-0 h-full w-full"
        zoomControl
        doubleClickZoom
        touchZoom
        scrollWheelZoom={wheelZoomOnHover ? false : scrollWheelZoom}
      >
        <TileLayer key={isDark ? 'dark' : 'light'} attribution={tiles.attribution} url={tiles.url} />
        <MapThemeSync />
        <MapResizeSync />
        {wheelZoomOnHover ? <ScrollWheelZoomOnHover /> : null}
        <FitBounds
          points={boundsPoints}
          focusId={selectedVehicleId}
          shipmentId={shipment?.id}
          showRoute={showRoute}
        />

        {shipment && showRoute && routePositions.length > 1 ? (
          <>
            <Polyline
              positions={routePositions}
              pathOptions={{ color: mapColors.routeGlow, weight: 8, opacity: 0.35 }}
            />
            <Polyline
              positions={routePositions}
              pathOptions={{ color: mapColors.route, weight: 4, opacity: 0.9 }}
            />
            {routePositions.length > 2 ? (
              <Polyline
                positions={routePositions}
                pathOptions={{
                  color: mapColors.routeGlow,
                  weight: 2,
                  opacity: 0.6,
                  dashArray: '8 10',
                }}
              />
            ) : null}
            <Marker position={[shipment.pickup.lat, shipment.pickup.lng]} icon={pickupIcon}>
              <Popup>
                <strong>Pickup point</strong>
                <br />
                {shipment.pickup.address}
              </Popup>
            </Marker>
            <Marker position={[shipment.delivery.lat, shipment.delivery.lng]} icon={deliveryIcon}>
              <Popup>
                <strong>Delivery point</strong>
                <br />
                {shipment.delivery.address}
              </Popup>
            </Marker>
          </>
        ) : null}

        {showGeofence &&
          vehicles.map((v) => (
            <CircleMarker
              key={`geo-${v.id}`}
              center={[v.currentLocation.lat, v.currentLocation.lng]}
              radius={12}
              pathOptions={{
                color: mapColors.vehicle,
                fillColor: mapColors.vehicle,
                fillOpacity: 0.08,
                weight: 1,
                opacity: 0.4,
              }}
            />
          ))}

        {vehicles.map((v) => {
          const selected = v.id === selectedVehicleId
          return (
            <Marker
              key={v.id}
              position={[v.currentLocation.lat, v.currentLocation.lng]}
              icon={vehicleIcon(selected, livePulse)}
              zIndexOffset={selected ? 1000 : 0}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-brand-800">{v.plateNumber}</p>
                  <p className="text-surface-600">
                    {v.make} {v.model} · {v.status}
                  </p>
                  <p className="text-xs text-surface-500">{v.currentLocation.label}</p>
                  <p className="mt-1 text-xs">Fuel {v.fuelLevel}%</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
