import { createBrowserRouter, Navigate } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from './components/auth/RouteGuards'
import { MainLayout } from './components/layout/MainLayout'
import { FleetProvider } from './context/FleetContext'
import { DashboardPage } from './pages/DashboardPage'
import { DriversPage } from './pages/DriversPage'
import { DriverDetailPage } from './pages/DriverDetailPage'
import { LoginPage } from './pages/LoginPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ShipmentDetailPage } from './pages/ShipmentDetailPage'
import { ShipmentsPage } from './pages/ShipmentsPage'
import { SignupPage } from './pages/SignupPage'
import { TrackingPage } from './pages/TrackingPage'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { VehiclesPage } from './pages/VehiclesPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <SignupPage />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FleetProvider>
          <MainLayout />
        </FleetProvider>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: 'vehicles/:id', element: <VehicleDetailPage /> },
      { path: 'drivers', element: <DriversPage /> },
      { path: 'drivers/:id', element: <DriverDetailPage /> },
      { path: 'shipments', element: <ShipmentsPage /> },
      { path: 'shipments/:id', element: <ShipmentDetailPage /> },
      { path: 'tracking', element: <TrackingPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
