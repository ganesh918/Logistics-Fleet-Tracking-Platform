import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 focus-visible:ring-brand-500 active:translate-y-0',
  secondary:
    'bg-panel text-surface-900 ring-1 ring-surface-200 hover:-translate-y-0.5 hover:bg-surface-100 hover:shadow-md focus-visible:ring-brand-500 dark:ring-surface-200/25 dark:hover:bg-surface-100/10 active:translate-y-0',
  ghost:
    'text-surface-800 hover:-translate-y-0.5 hover:bg-surface-100 focus-visible:ring-brand-500 dark:hover:bg-surface-100/10 active:translate-y-0',
  danger:
    'bg-rose-600 text-white hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md hover:shadow-rose-600/25 focus-visible:ring-rose-500 active:translate-y-0',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-surface-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
}
