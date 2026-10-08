import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'

export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false)
  const inputId = id ?? props.name

  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-surface-800">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          autoComplete={props.autoComplete ?? 'current-password'}
          className={cn(
            'fleet-field block w-full rounded-lg border border-surface-200 bg-white py-2 pl-3 pr-10 text-sm text-surface-900 shadow-sm placeholder:text-surface-800/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-panel',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
          )}
          {...props}
        />
        <button
          type="button"
          className="fleet-icon-btn absolute right-1 top-1/2 -translate-y-1/2 p-2 text-surface-800/50 hover:text-brand-600"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-surface-800/50">{hint}</p> : null}
    </div>
  )
})
