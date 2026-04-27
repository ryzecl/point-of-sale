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
    public function getReportData(array $filters): array
    {
        $baseQuery = $this->buildQuery($filters);

        // Agregasi dilakukan di level database (SQL) bukan di memori (PHP) untuk optimasi
        $totalTransactions = (clone $baseQuery)->count();
        $totalRevenue = (float) (clone $baseQuery)->sum('grand_total');
        $totalDiscount = (float) (clone $baseQuery)->sum('discount');
        $averageTransaction = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;

        // Peak Hour
        $peakHours = (clone $baseQuery)
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as total')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // Payment Method (jumlah transaksi)
        $paymentMethods = (clone $baseQuery)
            ->selectRaw('payment_method, COUNT(*) as total')
            ->groupBy('payment_method')
            ->get();

        // Payment Method (berdasarkan revenue 🔥)
        $paymentRevenue = (clone $baseQuery)
            ->selectRaw('payment_method, SUM(grand_total) as total')
            ->groupBy('payment_method')
            ->get();

        // Daily Trend
        $dailyTrend = (clone $baseQuery)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $orders = (clone $baseQuery)
            ->latest()
            ->get();

        return [
            'orders' => $orders,

            'totalTransactions' => $totalTransactions,
            'totalRevenue' => $totalRevenue,
            'totalDiscount' => $totalDiscount,
            'averageTransaction' => (float) $averageTransaction,

            'peakHours' => $peakHours,
            'paymentMethods' => $paymentMethods,
            'paymentRevenue' => $paymentRevenue,
            'dailyTrend' => $dailyTrend,
        ];
    }
}
