import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from './use-debounce';

interface UseFilterOptions {
    routeName: string;
    initialFilters: Record<string, any>;
}

export function useFilter({ routeName, initialFilters }: UseFilterOptions) {
    // 1. Local state untuk pencarian agar input terasa "enteng" (responsive)
    const [search, setSearch] = useState(initialFilters.search || '');

    // 2. Gunakan debounce pada nilai pencarian
    const debouncedSearch = useDebounce(search, 500);

    // 3. Fungsi utama untuk mengirim request ke server
    const applyFilters = useCallback(
        (newFilters: Record<string, any>) => {
            router.get(
                routeName,
                { ...initialFilters, ...newFilters, page: 1 },
                { preserveState: true, replace: true },
            );
        },
        [routeName, initialFilters],
    );

    // 4. Effect untuk memicu pencarian saat debouncedSearch berubah
    useEffect(() => {
        if (debouncedSearch !== (initialFilters.search || '')) {
            applyFilters({ search: debouncedSearch });
        }
    }, [debouncedSearch, applyFilters, initialFilters.search]);

    // 5. Fungsi untuk reset semua filter
    const handleReset = () => {
        setSearch('');
        router.get(routeName, {}, { replace: true });
    };

    return {
        search,
        setSearch,
        handleReset,
        applyFilters,
    };
}
