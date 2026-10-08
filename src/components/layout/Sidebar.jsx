import {
  Bell,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Package,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFleet } from '../../context/FleetContext'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils/cn'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/shipments', label: 'Shipments', icon: Package },
  { to: '/tracking', label: 'Live tracking', icon: MapPinned },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

function NavItem({ to, label, icon: Icon, end, badge, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out',
          isActive
            ? 'translate-x-0.5 bg-white/15 text-white shadow-inner ring-1 ring-white/10'
            : 'text-brand-100/90 hover:translate-x-1 hover:bg-white/10 hover:text-white hover:shadow-md hover:shadow-black/10',
        )
      }
    >
      <Icon
        className="size-5 shrink-0 opacity-90 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"
        aria-hidden
      />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 ? (
        <span className="fleet-nav-badge-pulse rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { unreadNotificationCount } = useFleet()
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const confirmed = await toast.confirm({
      title: 'Log out of FleetFlow?',
      description: 'You will need to sign in again to access the dashboard, fleet data, and live tracking.',
      confirmLabel: 'Log out',
      cancelLabel: 'Stay signed in',
      variant: 'danger',
    })
    if (!confirmed) {
      toast.info('Logout cancelled', { duration: 2800 })
      return
    }
    logout()
    onNavigate?.()
    toast.success('You have been signed out safely', { title: 'Logged out' })
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-transform duration-300 hover:scale-105 hover:rotate-3">
          <Truck className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold tracking-tight text-white">FleetFlow</p>
          <p className="text-xs text-brand-200/80">Logistics command</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {links.map(({ to, label, icon, end }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            icon={icon}
            end={end}
            onNavigate={onNavigate}
            badge={to === '/notifications' ? unreadNotificationCount : undefined}
          />
        ))}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        {user ? (
          <div className="rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-brand-200/75">{user.email}</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-100/90 transition-all duration-200 hover:bg-rose-500/15 hover:text-white hover:shadow-md hover:shadow-black/10"
        >
          <LogOut className="size-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Log out
        </button>
      </div>
    </>
  )
}

export function Sidebar({ mobileOpen, onMobileClose }) {
  const closeMobile = () => onMobileClose()

  return (
    <>
      {/* Desktop — fixed, does not scroll with page */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-gradient-to-b from-brand-950 via-brand-900 to-surface-950 shadow-xl shadow-brand-950/40 lg:flex">
        <SidebarContent onNavigate={undefined} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-surface-950/60 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <aside className="relative flex h-full w-72 max-w-[min(85vw,20rem)] flex-col bg-gradient-to-b from-brand-950 to-brand-900 shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-5 z-20 rounded-lg p-1.5 text-brand-100 hover:bg-white/10"
              aria-label="Close menu"
              onClick={closeMobile}
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={closeMobile} />
          </aside>
        </div>
      ) : null}
    </>
  )
}
