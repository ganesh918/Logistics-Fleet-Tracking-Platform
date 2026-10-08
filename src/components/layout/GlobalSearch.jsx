import { Package, Search, Truck, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFleet } from '../../context/FleetContext'
import { useDebounce } from '../../hooks/useDebounce'
import { searchFleet } from '../../utils/globalSearch'
import { cn } from '../../utils/cn'

export function GlobalSearch({ className }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debounced = useDebounce(query, 200)
  const { vehicles, drivers, shipments } = useFleet()
  const navigate = useNavigate()
  const rootRef = useRef(null)

  const results = useMemo(
    () => searchFleet(debounced, { vehicles, drivers, shipments }),
    [debounced, vehicles, drivers, shipments],
  )

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const showPanel = open && debounced.trim().length >= 2

  const go = (path) => {
    setOpen(false)
    setQuery('')
    navigate(path)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (results.total > 0) {
            const first =
              results.shipments[0]?.id
                ? `/shipments/${results.shipments[0].id}`
                : results.drivers[0]?.id
                  ? `/drivers/${results.drivers[0].id}`
                  : results.vehicles[0]?.id
                    ? `/vehicles/${results.vehicles[0].id}`
                    : '/vehicles'
            go(first)
          }
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-800/40" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search fleet, plates, shipments…"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          className="fleet-field h-9 w-full rounded-lg border border-surface-200 bg-surface-50 pl-9 pr-3 text-sm text-surface-900 placeholder:text-surface-800/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-200/20 dark:bg-surface-100/50"
        />
      </form>

      {showPanel ? (
        <div
          id="global-search-results"
          className="fleet-modal-panel absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(70vh,420px)] overflow-y-auto rounded-xl border border-surface-200/80 bg-panel py-2 shadow-xl dark:border-surface-200/15"
        >
          {results.total === 0 ? (
            <p className="px-4 py-3 text-sm text-surface-800/55">No matches for “{debounced}”</p>
          ) : (
            <>
              {results.vehicles.length > 0 ? (
                <Section icon={Truck} title="Vehicles">
                  {results.vehicles.map((v) => (
                    <ResultRow
                      key={v.id}
                      label={v.plateNumber}
                      sub={`${v.make} ${v.model}`}
                      onClick={() => go(`/vehicles/${v.id}`)}
                    />
                  ))}
                </Section>
              ) : null}
              {results.drivers.length > 0 ? (
                <Section icon={Users} title="Drivers">
                  {results.drivers.map((d) => (
                    <ResultRow
                      key={d.id}
                      label={`${d.firstName} ${d.lastName}`}
                      sub={d.email}
                      onClick={() => go(`/drivers/${d.id}`)}
                    />
                  ))}
                </Section>
              ) : null}
              {results.shipments.length > 0 ? (
                <Section icon={Package} title="Shipments">
                  {results.shipments.map((s) => (
                    <ResultRow
                      key={s.id}
                      label={s.referenceCode}
                      sub={s.customerName}
                      onClick={() => go(`/shipments/${s.id}`)}
                    />
                  ))}
                </Section>
              ) : null}
            </>
          )}
          <div className="border-t border-surface-100 px-4 py-2 dark:border-surface-200/10">
            <Link to="/vehicles" className="text-xs font-medium text-brand-600 hover:underline" onClick={() => setOpen(false)}>
              Open fleet registry with filters
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="px-2 py-1">
      <p className="flex items-center gap-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-surface-800/45">
        <Icon className="size-3.5" />
        {title}
      </p>
      <ul>{children}</ul>
    </div>
  )
}

function ResultRow({ label, sub, onClick }) {
  return (
    <li>
      <button
        type="button"
        className="fleet-list-row w-full rounded-lg px-3 py-2 text-left"
        onClick={onClick}
      >
        <p className="text-sm font-medium text-surface-900">{label}</p>
        <p className="truncate text-xs text-surface-800/55">{sub}</p>
      </button>
    </li>
  )
}
