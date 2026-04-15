import { useEffect, useState } from 'react';

/**
 * Hook untuk menunda pembaruan nilai (debouncing)
 * @param value Nilai yang ingin di-debounce
 * @param delay Waktu tunda dalam milidetik (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
