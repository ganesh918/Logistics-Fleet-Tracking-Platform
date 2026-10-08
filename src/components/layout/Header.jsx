import { Bell, Menu, RefreshCw } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useFleet } from '../../context/FleetContext'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'
import { GlobalSearch } from './GlobalSearch'

const titles = {
  '/': 'Operations dashboard',
  '/vehicles': 'Vehicle management',
  '/drivers': 'Driver management',
  '/shipments': 'Shipment management',
  '/tracking': 'Live fleet tracking',
  '/notifications': 'Alerts & notifications',
}

export function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const base = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/'
  const title = titles[base] ?? 'FleetFlow'
  const { refresh, loadState, unreadNotificationCount } = useFleet()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-surface-200/80 bg-panel/95 px-4 backdrop-blur-md sm:gap-4 sm:px-6 dark:border-surface-200/15">
      <button
        type="button"
        className="fleet-icon-btn p-2 text-surface-800 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-semibold text-surface-900 transition-all duration-300 sm:text-xl">
          {title}
        </h1>
      </div>
      <GlobalSearch className="hidden md:flex max-w-xs flex-1 xl:max-w-md" />
      <ThemeToggle />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => void refresh()}
        loading={loadState === 'loading'}
        className="hidden sm:inline-flex"
      >
        <RefreshCw className="size-4" />
        Refresh
      </Button>
      <Link
        to="/notifications"
        className="fleet-icon-btn relative p-2 text-surface-700"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {unreadNotificationCount > 0 ? (
          <span className="fleet-nav-badge-pulse absolute right-1 top-1 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-surface-900" />
        ) : null}
      </Link>
    </header>
  )
}
