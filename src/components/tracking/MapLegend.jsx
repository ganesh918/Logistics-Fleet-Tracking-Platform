import { map as mapColors } from '../../utils/themeColors'

export function MapLegend() {
  const items = [
    { color: mapColors.vehicle, label: 'Vehicle (live GPS)' },
    { color: mapColors.route, label: 'Planned route' },
    { color: mapColors.pickup, label: 'Pickup point', shape: 'square' },
    { color: mapColors.delivery, label: 'Delivery point', shape: 'square' },
  ]

  return (
    <div className="rounded-xl border border-surface-200/80 bg-panel/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur dark:border-surface-200/15">
      <p className="mb-2 font-semibold text-surface-900">Map legend</p>
      <ul className="space-y-1.5">
        {items.map(({ color, label, shape }) => (
          <li key={label} className="flex items-center gap-2 text-surface-800/70">
            <span
              className="size-2.5 shrink-0 border-2 border-white shadow-sm"
              style={{
                background: color,
                borderRadius: shape === 'square' ? '3px' : '9999px',
              }}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
