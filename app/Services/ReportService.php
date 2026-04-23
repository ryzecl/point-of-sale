<?php

namespace App\Services;

use App\Models\Order;
use App\Enums\OrderStatus;

class ReportService
{
    /**
     * Membangun base query berdasarkan filter
     */
    public function buildQuery(array $filters)
    {
        return Order::query()
            ->with('user:id,name') // Eager loading untuk optimasi N+1
            ->whereIn('status', [
                OrderStatus::SETTLEMENT,
                OrderStatus::COOKED,
                OrderStatus::SERVED,
            ]) // Mengambil semua pesanan yang sudah dibayar/proses/selesai
            ->when(!empty($filters['start_date']), fn ($query) => $query->whereDate('created_at', '>=', $filters['start_date']))
            ->when(!empty($filters['end_date']), fn ($query) => $query->whereDate('created_at', '<=', $filters['end_date']))
            ->when(!empty($filters['payment_method']), fn ($query) => $query->where('payment_method', $filters['payment_method']));
    }

    /**
     * Mengambil summary metrik
     */
    public function getSummary(array $filters): array
    {
        $query = $this->buildQuery($filters);

        // Agregasi dilakukan di level database (SQL) bukan di memori (PHP) untuk optimasi
        $totalSales = (float) $query->sum('grand_total');
        $totalTransactions = $query->count();
        $totalDiscount = (float) $query->sum('discount');
        $averageTransaction = $totalTransactions > 0 ? $totalSales / $totalTransactions : 0;

        return [
            'totalSales' => $totalSales,
            'totalTransactions' => $totalTransactions,
            'totalDiscount' => $totalDiscount,
            'averageTransaction' => (float) $averageTransaction,
        ];
    }
}
