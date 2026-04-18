<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request, OrderService $orderService)
    {
        $perPage = $request->query('perPage', 25);
        // Mencegah N+1 Problem: Menggunakan 'with' untuk memuat Relasi berlapis
        // - 'user' -> load data user/kasir yg memproses
        // - 'orderItems.item' -> load isi struk beserta objek master detail item-nya masing-masing
        $query = Order::with(['user', 'orderItems.item']);

        // Pencarian (Search) by Order Code
        $query = $orderService->applyFilters($query, $request->all());

        // $stats = [
        //     'total' => (clone $query)->count(),
        //     'inactive' => (clone $query)->where('is_active', 0)->count(),
        //     'low_stock' => (clone $query)->whereColumn('stock', '<=', 'min_stock')->count(),
        // ];

        // Selalu urutkan dari pesanan terbaru (Latest)
        $orders = OrderResource::collection($query->latestDeterministic()->paginate((int) $perPage)->withQueryString());

        return Inertia::render('order/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
