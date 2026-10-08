import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { fleetApi } from '../api/fleetApi'
import { defaultFilters } from '../types'

const initialState = {
  vehicles: [],
  drivers: [],
  shipments: [],
  notifications: [],
  dashboardStats: null,
  deliveryPerformance: [],
  activities: [],
  filters: defaultFilters,
  loadState: 'idle',
  error: null,
  initialized: false,
}

function filtersEqual(a, b) {
  return (
    a.search === b.search &&
    a.vehicleStatus === b.vehicleStatus &&
    a.driverStatus === b.driverStatus &&
    a.shipmentStatus === b.shipmentStatus &&
    a.dateFrom === b.dateFrom &&
    a.dateTo === b.dateTo &&
    a.location === b.location
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loadState: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loadState: 'success',
        initialized: true,
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, loadState: 'error', error: action.error, initialized: true }
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.vehicles }
    case 'SET_DRIVERS':
      return { ...state, drivers: action.drivers }
    case 'SET_SHIPMENTS':
      return { ...state, shipments: action.shipments }
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.notifications }
    case 'SET_FILTERS': {
      const next = { ...state.filters, ...action.filters }
      if (filtersEqual(state.filters, next)) return state
      return { ...state, filters: next }
    }
    case 'RESET_FILTERS':
      if (filtersEqual(state.filters, defaultFilters)) return state
      return { ...state, filters: defaultFilters }
    default:
      return state
  }
}

const FleetContext = createContext(null)

export function FleetProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refresh = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })
    try {
      const [dashboard, vehicles, drivers, shipments, notifications] = await Promise.all([
        fleetApi.fetchDashboard(),
        fleetApi.fetchVehicles(),
        fleetApi.fetchDrivers(),
        fleetApi.fetchShipments(),
        fleetApi.fetchNotifications(),
      ])
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: {
          vehicles,
          drivers,
          shipments,
          notifications,
          dashboardStats: dashboard.stats,
          deliveryPerformance: dashboard.performance,
          activities: dashboard.activities,
        },
      })
    } catch (e) {
      dispatch({
        type: 'LOAD_ERROR',
        error: e instanceof Error ? e.message : 'Failed to load fleet data',
      })
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', filters })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' })
  }, [])

  const unreadNotificationCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  )

  const createVehicle = useCallback(async (payload) => {
    const vehicle = await fleetApi.createVehicle(payload)
    dispatch({ type: 'SET_VEHICLES', vehicles: [vehicle, ...state.vehicles] })
    return vehicle
  }, [state.vehicles])

  const updateVehicle = useCallback(async (id, payload) => {
    const vehicle = await fleetApi.updateVehicle(id, payload)
    dispatch({
      type: 'SET_VEHICLES',
      vehicles: state.vehicles.map((v) => (v.id === id ? vehicle : v)),
    })
    return vehicle
  }, [state.vehicles])

  const deleteVehicle = useCallback(async (id) => {
    await fleetApi.deleteVehicle(id)
    dispatch({
      type: 'SET_VEHICLES',
      vehicles: state.vehicles.filter((v) => v.id !== id),
    })
  }, [state.vehicles])

  const createDriver = useCallback(async (payload) => {
    const driver = await fleetApi.createDriver(payload)
    dispatch({ type: 'SET_DRIVERS', drivers: [driver, ...state.drivers] })
    return driver
  }, [state.drivers])

  const updateDriver = useCallback(async (id, payload) => {
    const driver = await fleetApi.updateDriver(id, payload)
    dispatch({
      type: 'SET_DRIVERS',
      drivers: state.drivers.map((d) => (d.id === id ? driver : d)),
    })
    return driver
  }, [state.drivers])

  const deleteDriver = useCallback(async (id) => {
    await fleetApi.deleteDriver(id)
    dispatch({
      type: 'SET_DRIVERS',
      drivers: state.drivers.filter((d) => d.id !== id),
    })
    dispatch({
      type: 'SET_VEHICLES',
      vehicles: state.vehicles.map((v) =>
        v.assignedDriverId === id ? { ...v, assignedDriverId: null } : v,
      ),
    })
  }, [state.drivers, state.vehicles])

  const createShipment = useCallback(async (payload) => {
    const shipment = await fleetApi.createShipment(payload)
    dispatch({
      type: 'SET_SHIPMENTS',
      shipments: [shipment, ...state.shipments],
    })
    return shipment
  }, [state.shipments])

  const updateShipment = useCallback(async (id, payload) => {
    const shipment = await fleetApi.updateShipment(id, payload)
    dispatch({
      type: 'SET_SHIPMENTS',
      shipments: state.shipments.map((s) => (s.id === id ? shipment : s)),
    })
    return shipment
  }, [state.shipments])

  const markNotificationRead = useCallback(async (id) => {
    await fleetApi.markNotificationRead(id)
    dispatch({
      type: 'SET_NOTIFICATIONS',
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })
  }, [state.notifications])

  const markAllNotificationsRead = useCallback(async () => {
    await fleetApi.markAllNotificationsRead()
    dispatch({
      type: 'SET_NOTIFICATIONS',
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })
  }, [state.notifications])

  const value = useMemo(
    () => ({
      ...state,
      refresh,
      unreadNotificationCount,
      setFilters,
      resetFilters,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      createDriver,
      updateDriver,
      deleteDriver,
      createShipment,
      updateShipment,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      state,
      refresh,
      unreadNotificationCount,
      setFilters,
      resetFilters,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      createDriver,
      updateDriver,
      deleteDriver,
      createShipment,
      updateShipment,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  )

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleet() {
  const ctx = useContext(FleetContext)
  if (!ctx) throw new Error('useFleet must be used within FleetProvider')
  return ctx
}
