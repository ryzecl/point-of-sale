import { useState, useCallback } from 'react';
import type { OrderSuccessData } from '@/types';

export function useReceiptData() {
    const [receiptData, setReceiptData] = useState<OrderSuccessData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReceipt = useCallback(async (orderId: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/orders/${orderId}/receipt`);

            if (!res.ok) {
                throw new Error('Failed to fetch receipt');
            }

            const data = await res.json();
            setReceiptData(data);
            return data as OrderSuccessData;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clear = useCallback(() => {
        setReceiptData(null);
        setError(null);
    }, []);

    return { receiptData, loading, error, fetchReceipt, clear };
}
