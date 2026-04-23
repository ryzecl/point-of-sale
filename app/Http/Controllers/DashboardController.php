<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
