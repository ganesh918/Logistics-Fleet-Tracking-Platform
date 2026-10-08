import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input({ label, error, hint, className, id, ...props }, ref) {
    const inputId = id ?? props.name;
    return (<div className="space-y-1.5">
      {label ? (<label htmlFor={inputId} className="block text-sm font-medium text-surface-800">
          {label}
        </label>) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'fleet-field block w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm placeholder:text-surface-800/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-surface-50 dark:bg-panel',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-surface-800/50">{hint}</p> : null}
    </div>
  )
})
