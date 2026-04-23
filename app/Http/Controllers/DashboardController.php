<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'todayRevenue' => Order::whereDate('created_at', today())->sum('grand_total'),
            'ThisMonthRevenue' => Order::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('grand_total'),
            'totalOrdersToday' => Order::whereDate('created_at', today())->count(),
            'averageRevenue' => Order::average('grand_total'),
            'lowStockCount' => Item::where('stock', '>', 0)->whereColumn('stock', '<=', 'min_stock')->count(),
            'outOfStockCount' => Item::where('stock', 0)->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }

    public function chartData(Request $request): JsonResponse
    {
        $period = $request->input('period', 'daily');
        $date = Carbon::parse($request->input('date', today()));

        // Tentukan range waktu
        [$start, $end] = match ($period) {
            'daily'   => [$date->copy()->startOfDay(), $date->copy()->endOfDay()],
            'weekly'  => [$date->copy()->startOfWeek(), $date->copy()->endOfWeek()],
            'monthly' => [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()],
            'yearly'  => [$date->copy()->startOfYear(), $date->copy()->endOfYear()],
        };

        // Query dasar — hanya transaksi yang sudah dibayar (atau status tertentu)
        $baseQuery = Order::whereBetween('created_at', [$start, $end])
            ->whereNotIn('status', ['cancel', 'expire']);

        // === TREND DATA ===
        $selectRaw = match ($period) {
            'daily'   => "HOUR(created_at) as time_key",
            'weekly'  => "DATE(created_at) as time_key",
            'monthly' => "DAY(created_at) as time_key",
            'yearly'  => "MONTH(created_at) as time_key",
        };

        $trendRaw = (clone $baseQuery)
            ->selectRaw("{$selectRaw}, SUM(grand_total) as revenue, COUNT(*) as orders")
            ->groupByRaw('time_key')
            ->orderByRaw('time_key')
            ->get()
            ->keyBy('time_key');

        // Generate semua slot (termasuk yang kosong) agar chart tidak bolong
        $trendData = $this->fillTimeSlots($period, $start, $end, $trendRaw);

        // === PAYMENT DISTRIBUTION ===
        $paymentDistribution = (clone $baseQuery)
            ->selectRaw("payment_method as method, SUM(grand_total) as total, COUNT(*) as count")
            ->groupBy('payment_method')
            ->get()
            ->map(fn($item) => [
                'method' => $item->method,
                'total'  => (float) $item->total,
                'count'  => (int) $item->count,
            ]);

        // === SUMMARY ===
        $summary = [
            'totalRevenue'  => (clone $baseQuery)->sum('grand_total'),
            'totalOrders'   => (clone $baseQuery)->count(),
            'avgOrderValue' => round((clone $baseQuery)->avg('grand_total') ?? 0),
        ];

        return response()->json([
            'trendData'           => $trendData,
            'paymentDistribution' => $paymentDistribution,
            'summary'             => $summary,
            'meta' => [
                'period'     => $period,
                'date'       => $date->toDateString(),
                'rangeStart' => $start->toDateTimeString(),
                'rangeEnd'   => $end->toDateTimeString(),
            ],
        ]);
    }

    /**
     * Isi slot waktu yang kosong (0 revenue/orders) agar chart kontinu.
     */
    private function fillTimeSlots(string $period, Carbon $start, Carbon $end, $data): array
    {
        $slots = [];
        $dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                           'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        match ($period) {
            'daily' => (function () use (&$slots, $data) {
                for ($h = 0; $h < 24; $h++) {
                    $row = $data->get($h);
                    $slots[] = [
                        'label'   => sprintf('%02d:00', $h),
                        'revenue' => (float) ($row->revenue ?? 0),
                        'orders'  => (int) ($row->orders ?? 0),
                    ];
                }
            })(),

            'weekly' => (function () use (&$slots, $data, $start, $dayNames) {
                for ($d = 0; $d < 7; $d++) {
                    $currentDate = $start->copy()->addDays($d);
                    $key = $currentDate->toDateString();
                    $row = $data->get($key);
                    $slots[] = [
                        'label'   => $dayNames[$currentDate->dayOfWeek],
                        'revenue' => (float) ($row->revenue ?? 0),
                        'orders'  => (int) ($row->orders ?? 0),
                    ];
                }
            })(),

            'monthly' => (function () use (&$slots, $data, $start) {
                $daysInMonth = $start->daysInMonth;
                for ($d = 1; $d <= $daysInMonth; $d++) {
                    $row = $data->get($d);
                    $slots[] = [
                        'label'   => (string) $d,
                        'revenue' => (float) ($row->revenue ?? 0),
                        'orders'  => (int) ($row->orders ?? 0),
                    ];
                }
            })(),

            'yearly' => (function () use (&$slots, $data, $monthNames) {
                for ($m = 1; $m <= 12; $m++) {
                    $row = $data->get($m);
                    $slots[] = [
                        'label'   => $monthNames[$m],
                        'revenue' => (float) ($row->revenue ?? 0),
                        'orders'  => (int) ($row->orders ?? 0),
                    ];
                }
            })(),
        };

        return $slots;
    }
}

