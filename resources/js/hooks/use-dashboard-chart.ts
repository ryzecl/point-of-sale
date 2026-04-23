import { useCallback, useEffect, useState } from 'react';
import type { ChartDataResponse, PeriodType } from '@/types/chart';

export function useDashboardChart() {
    const [data, setData] = useState<ChartDataResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<PeriodType>('daily');
    const [date, setDate] = useState(
        () => new Date().toISOString().split('T')[0],
    );
    const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
        {},
    );

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams({
                period,
                date,
                ...(dateRange.from && { from: dateRange.from }),
                ...(dateRange.to && { to: dateRange.to }),
            });
            const res = await fetch(`/dashboard/chart-data?${params}`);
            const json: ChartDataResponse = await res.json();
            setData(json);
        } catch (err) {
            console.error('Chart data fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [period, date, dateRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        period,
        setPeriod,
        date,
        setDate,
        dateRange,
        setDateRange,
        refetch: fetchData,
    };
}
