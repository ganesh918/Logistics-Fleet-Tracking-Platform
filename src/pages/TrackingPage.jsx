import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EstimatedDeliveryPanel } from '../components/tracking/EstimatedDeliveryPanel'
import { FleetMap } from '../components/tracking/FleetMap'
import { MapLegend } from '../components/tracking/MapLegend'
import { RouteVisualizationBar } from '../components/tracking/RouteVisualizationBar'
import { VehicleStatusList } from '../components/tracking/VehicleStatusList'
import { useFleet } from '../context/FleetContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { PageLoader } from '../components/ui/PageStates'
import { shipmentStatusLabel } from '../utils/statusStyles'

export function TrackingPage() {
  const [params, setParams] = useSearchParams()
  const shipmentId = params.get('shipment') ?? ''
  const { vehicles, shipments, drivers, loadState, refresh } = useFleet()

  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [showRoute, setShowRoute] = useState(true)

  const trackableShipments = useMemo(
    () =>
      shipments.filter((s) =>
        ['pending', 'picked_up', 'in_transit', 'delayed'].includes(s.status),
      ),
    [shipments],
  )

  const selectedShipment =
    shipments.find((s) => s.id === shipmentId) ??
    trackableShipments.find((s) => ['in_transit', 'delayed', 'picked_up'].includes(s.status))

  const fleetForList = useMemo(
    () => vehicles.filter((v) => v.status === 'active' || v.status === 'idle'),
    [vehicles],
  )

  const mapVehicles = useMemo(() => {
    if (selectedShipment?.assignedVehicleId) {
      const assigned = vehicles.find((v) => v.id === selectedShipment.assignedVehicleId)
      if (assigned) return [assigned]
    }
    if (selectedVehicleId) {
      const v = vehicles.find((x) => x.id === selectedVehicleId)
      if (v) return [v]
    }
    return fleetForList.slice(0, 6)
  }, [selectedShipment, selectedVehicleId, vehicles, fleetForList])

  const assignedDriver = selectedShipment?.assignedDriverId
    ? drivers.find((d) => d.id === selectedShipment.assignedDriverId)
    : null
  const assignedVehicle = selectedShipment?.assignedVehicleId
    ? vehicles.find((v) => v.id === selectedShipment.assignedVehicleId)
    : null

  const onShipmentChange = (id) => {
    setParams(id ? { shipment: id } : {})
    setSelectedVehicleId(null)
  }

  if (loadState === 'loading' && vehicles.length === 0) {
    return <PageLoader label="Loading interactive map…" />
  }

  return (
    <div
      data-page="tracking"
      className="flex w-full flex-col gap-3 pb-4 sm:gap-4"
    >
      <Card className="shrink-0 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-300">
              Live tracking
            </p>
            <p className="mt-0.5 text-sm text-surface-800/55">
              Map · GPS · routes · pickup/delivery · ETA
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end lg:col-span-5">
            <Select
              label="Track shipment"
              className="min-w-0 flex-1"
              value={selectedShipment?.id ?? ''}
              onChange={(e) => onShipmentChange(e.target.value)}
              options={[
                { value: '', label: '— Select shipment —' },
                ...trackableShipments.map((s) => ({
                  value: s.id,
                  label: `${s.referenceCode} (${shipmentStatusLabel[s.status]})`,
                })),
              ]}
            />
          </div>
          <div className="lg:col-span-2 lg:flex lg:justify-end">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => void refresh()}>
              <RefreshCw className="size-4" />
              Sync
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid shrink-0 gap-3 md:grid-cols-3 md:items-stretch">
        <EstimatedDeliveryPanel
          className="min-h-0 md:col-span-1"
          shipment={selectedShipment}
          driverName={
            assignedDriver ? `${assignedDriver.firstName} ${assignedDriver.lastName}` : null
          }
          vehiclePlate={assignedVehicle?.plateNumber}
        />
        <VehicleStatusList
          className="flex h-full min-h-[220px] flex-col md:col-span-2 md:min-h-0"
          scrollBody
          vehicles={fleetForList.slice(0, 8)}
          drivers={drivers}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </div>

      <div className="-mx-4 flex flex-col sm:-mx-6">
        <Card className="fleet-map-frame flex flex-col overflow-hidden rounded-none border-x-0 p-0 sm:rounded-2xl sm:border-x">
          <div className="relative h-[min(58vh,680px)] min-h-[360px] sm:min-h-[420px]">
            <FleetMap
              vehicles={mapVehicles.length ? mapVehicles : fleetForList.slice(0, 6)}
              shipment={selectedShipment}
              selectedVehicleId={selectedVehicleId}
              showRoute={showRoute}
              showGeofence={false}
              height="100%"
              wheelZoomOnHover
              className="h-full rounded-none ring-0"
              livePulse
            />
            <Badge className="pointer-events-none absolute left-3 top-3 z-10 border-0 bg-panel/95 shadow-md backdrop-blur sm:left-4">
              <span className="mr-1.5 inline-block size-2 animate-pulse rounded-full bg-emerald-500" />
              Live GPS
            </Badge>
            <div className="pointer-events-none absolute bottom-3 left-3 z-10 sm:left-4">
              <MapLegend />
            </div>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              className="absolute bottom-3 right-3 z-10 bg-panel/95 shadow-md backdrop-blur sm:right-4"
              onClick={() => setShowRoute((x) => !x)}
            >
              {showRoute ? 'Hide route' : 'Show route'}
            </Button>
          </div>
          <RouteVisualizationBar shipment={selectedShipment} showRoute={showRoute} embedded />
        </Card>
      </div>
    </div>
  )
}
