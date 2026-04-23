<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class DashboardService
{
    /**
     * Get basic dashboard statistics.
     */
    public function getBasicStats(): array
    {
        return [
            'todayRevenue' => Order::whereDate('created_at', today())->sum('grand_total'),
            'ThisMonthRevenue' => Order::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('grand_total'),
            'totalOrdersToday' => Order::whereDate('created_at', today())->count(),
            'averageRevenue' => Order::average('grand_total'),
            'lowStockCount' => Item::where('stock', '>', 0)->whereColumn('stock', '<=', 'min_stock')->count(),
            'outOfStockCount' => Item::where('stock', 0)->count(),
        ];
    }

    /**
     * Get chart and detailed analytics data based on period.
     */
    public function getChartAnalytics(string $period, Carbon $date): array
    {
        [$start, $end] = $this->getDateRange($period, $date);

        // Base query — only transactions that are paid (or specific status)
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

        // === TOP SELLING ITEMS ===
        $topItems = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('items', 'items.id', '=', 'order_items.item_id')
            ->whereBetween('orders.created_at', [$start, $end])
            ->whereNotIn('orders.status', ['cancel', 'expire'])
            ->selectRaw('items.name, items.img, SUM(order_items.quantity) as total_qty, SUM(order_items.total_price) as total_revenue')
            ->groupBy('items.id', 'items.name', 'items.img')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name'          => $item->name,
                'img'           => $item->img ? asset('storage/' . $item->img) : null,
                'total_qty'     => (int) $item->total_qty,
                'total_revenue' => (float) $item->total_revenue,
            ]);

        // === SUMMARY ===
        $summary = [
            'totalRevenue'  => (float) (clone $baseQuery)->sum('grand_total'),
            'totalOrders'   => (int) (clone $baseQuery)->count(),
            'avgOrderValue' => (float) round((clone $baseQuery)->avg('grand_total') ?? 0),
        ];

        // === RECENT ORDERS ===
        $recentOrders = Order::query()
            ->select('id', 'customer_name', 'grand_total', 'status', 'created_at')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($order) => [
                'id'            => $order->id,
                'customer_name' => $order->customer_name,
                'grand_total'   => (float) $order->grand_total,
                'status'        => $order->status,
                'created_at'    => $order->created_at->diffForHumans(),
            ]);

        return [
            'trendData'           => $trendData,
            'paymentDistribution' => $paymentDistribution,
            'topItems'            => $topItems,
            'recentOrders'        => $recentOrders,
            'summary'             => $summary,
            'meta' => [
                'period'     => $period,
                'date'       => $date->toDateString(),
                'from'       => $start->toDateString(),
                'to'         => $end->toDateString(),
                'rangeStart' => $start->toDateTimeString(),
                'rangeEnd'   => $end->toDateTimeString(),
            ],
        ];
    }

    /**
     * Get start and end date based on period.
     */
    private function getDateRange(string $period, Carbon $date): array
    {
        return match ($period) {
            'daily'   => [$date->copy()->startOfDay(), $date->copy()->endOfDay()],
            'weekly'  => [$date->copy()->startOfWeek(), $date->copy()->endOfWeek()],
            'monthly' => [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()],
            'yearly'  => [$date->copy()->startOfYear(), $date->copy()->endOfYear()],
            default   => [$date->copy()->startOfDay(), $date->copy()->endOfDay()],
        };
    }

    /**
     * Fill empty time slots (0 revenue/orders) to ensure a continuous chart.
     */
    private function fillTimeSlots(string $period, Carbon $start, Carbon $end, $data): array
    {
        $slots = [];
        $dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

            'custom' => (function () use (&$slots, $data, $start, $end) {
                $periodRange = CarbonPeriod::create($start, $end);
                $limitedRange = $periodRange->take(31);
                foreach ($limitedRange as $date) {
                    $key = $date->toDateString();
                    $row = $data->get($key);
                    $slots[] = [
                        'label'   => $date->format('d M'),
                        'revenue' => (float) ($row->revenue ?? 0),
                        'orders'  => (int) ($row->orders ?? 0),
                    ];
                }
            })(),
        };

        return $slots;
    }
}
