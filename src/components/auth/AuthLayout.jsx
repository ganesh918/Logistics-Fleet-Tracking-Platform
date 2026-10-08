import { Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../ui/ThemeToggle'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-brand-950 via-brand-900 to-surface-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 size-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-96 rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/login" className="flex items-center gap-3 text-white transition-opacity hover:opacity-90">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/40">
            <Truck className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">FleetFlow</p>
            <p className="text-xs text-brand-200/80">Logistics command</p>
          </div>
        </Link>
        <ThemeToggle className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:border-white/15 dark:bg-white/10 dark:text-white" />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 pt-4 sm:px-6">
        <div className="fleet-empty-enter w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-panel/95 p-6 shadow-2xl shadow-brand-950/30 backdrop-blur-md sm:p-8 dark:border-surface-200/10 dark:bg-panel/95">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight text-surface-900">{title}</h1>
              {subtitle ? <p className="mt-1.5 text-sm text-surface-800/60">{subtitle}</p> : null}
            </div>
            {children}
          </div>
          {footer ? <div className="mt-6 text-center text-sm text-brand-100/90">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
