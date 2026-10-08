import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'

export function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'fleet-icon-btn relative inline-flex h-9 w-9 items-center justify-center border border-surface-200/80 bg-surface-50 text-surface-800 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:rotate-12 hover:[&_svg]:scale-110',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
