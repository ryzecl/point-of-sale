<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 25);

        // Mencegah N+1 Problem: Menggunakan 'with' untuk memuat Relasi berlapis
        // - 'user' -> load data user/kasir yg memproses
        // - 'orderItems.item' -> load isi struk beserta objek master detail item-nya masing-masing
        $query = Order::with(['user', 'orderItems.item']);

        // Pencarian (Search) by Order Code
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('order_code', 'like', "%{$search}%");
        }

        // Filter berdasarkan Status Pesanan
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Selalu urutkan dari pesanan terbaru (Latest)
        $orders = OrderResource::collection($query->latest()->paginate((int) $perPage)->withQueryString());

        return Inertia::render('order/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
