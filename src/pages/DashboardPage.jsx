import { DeliveryPerformanceChart, FleetOverviewChart } from '../components/dashboard/Charts'
import { AlertsPanel, RecentActivity } from '../components/dashboard/ActivityAlerts'
import { FleetHealthPanel } from '../components/dashboard/FleetHealthPanel'
import { QuickActions } from '../components/dashboard/QuickActions'
import { ShipmentStatusStrip, StatCards } from '../components/dashboard/StatCards'
import { FleetMap } from '../components/tracking/FleetMap'
import { useFleet } from '../context/FleetContext'
import { PageError, PageLoader } from '../components/ui/PageStates'

export function DashboardPage() {
  const {
    loadState,
    error,
    refresh,
    dashboardStats,
    deliveryPerformance,
    activities,
    notifications,
    vehicles,
  } = useFleet()

  if (loadState === 'loading' && !dashboardStats) {
    return <PageLoader />
  }
  if (loadState === 'error' || !dashboardStats) {
    return (
      <PageError message={error ?? 'Unable to load dashboard'} onRetry={() => void refresh()} />
    )
  }

  const activeVehicles = vehicles.filter((v) => v.status === 'active' || v.status === 'idle')

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <StatCards stats={dashboardStats} />
      <QuickActions />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
        <div className="fleet-dashboard-stagger space-y-6 xl:col-span-8">
          <ShipmentStatusStrip stats={dashboardStats} />
          <div className="grid gap-6 md:grid-cols-2">
            <DeliveryPerformanceChart data={deliveryPerformance} />
            <FleetOverviewChart stats={dashboardStats} />
          </div>
          <div>
            <h2 className="mb-3 font-display text-base font-semibold text-surface-900">
              Fleet map snapshot
            </h2>
            <div className="fleet-map-frame relative isolate overflow-hidden rounded-2xl ring-1 ring-brand-500/10">
              <FleetMap vehicles={activeVehicles} height="320px" />
            </div>
          </div>
        </div>

        <div className="fleet-dashboard-stagger flex flex-col gap-4 xl:col-span-4">
          <FleetHealthPanel />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <AlertsPanel
              notifications={notifications}
              compact
              limit={4}
              maxBodyHeight="max-h-[11.5rem]"
            />
            <RecentActivity
              items={activities}
              compact
              limit={5}
              maxBodyHeight="max-h-[11.5rem]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
