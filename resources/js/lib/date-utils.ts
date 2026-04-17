import { formatDistanceToNow, format } from 'date-fns';
import { enUS, id } from 'date-fns/locale';

/**
 * Memformat tanggal menjadi waktu relatif (misal: "5 menit yang lalu")
 * Menggunakan bahasa Indonesia secara default.
 */
export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    return formatDistanceToNow(d, {
        addSuffix: true,
        locale: enUS,
    });
}

/**
 * Memformat tanggal menjadi format tertentu (misal: "17 Apr 2024, 15:30")
 */
export function formatDateTime(
    date: string | Date,
    pattern: string = 'dd MMM yyyy, HH:mm',
): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    return format(d, pattern, { locale: id });
}
