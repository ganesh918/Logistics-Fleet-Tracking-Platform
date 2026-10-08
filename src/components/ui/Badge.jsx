import { cn } from '../../utils/cn';
export function Badge({ className, children }) {
    return (<span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-transform duration-200 hover:scale-105', className)}>
      {children}
    </span>);
}
