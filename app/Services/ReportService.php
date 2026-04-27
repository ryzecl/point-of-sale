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
            ->with('user') // Ambil semua kolom user dulu agar lebih aman
            ->whereIn('status', [
                OrderStatus::SETTLEMENT,
                OrderStatus::COOKED,
                OrderStatus::SERVED,
            ])
            ->when(!empty($filters['start_date']), function ($query) use ($filters) {
                $query->where('created_at', '>=', $filters['start_date'] . ' 00:00:00');
            })
            ->when(!empty($filters['end_date']), function ($query) use ($filters) {
                $query->where('created_at', '<=', $filters['end_date'] . ' 23:59:59');
            })
            ->when(!empty($filters['payment_method']), fn($query) => $query->where('payment_method', $filters['payment_method']));
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
