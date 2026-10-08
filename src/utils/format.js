import { format, formatDistanceToNow, parseISO } from 'date-fns';
export function formatDate(iso, pattern = 'MMM d, yyyy') {
    try {
        return format(parseISO(iso), pattern);
    }
    catch {
        return iso;
    }
}
export function formatDateTime(iso) {
    return formatDate(iso, 'MMM d, yyyy · h:mm a');
}
export function formatRelative(iso) {
    try {
        return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    }
    catch {
        return iso;
    }
}
export function formatPercent(value, digits = 0) {
    return `${value.toFixed(digits)}%`;
}
export function formatNumber(value) {
    return new Intl.NumberFormat().format(value);
}
