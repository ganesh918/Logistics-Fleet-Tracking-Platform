import { cn } from '../../utils/cn';
export function Select({ label, error, options, className, id, ...props }) {
    const selectId = id ?? props.name;
    return (<div className="space-y-1.5">
      {label ? (<label htmlFor={selectId} className="block text-sm font-medium text-surface-800">
          {label}
        </label>) : null}
      <select
        id={selectId}
        className={cn(
          'fleet-field block w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-panel',
          error && 'border-rose-400',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (<option key={opt.value} value={opt.value}>
            {opt.label}
          </option>))}
      </select>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>);
}
