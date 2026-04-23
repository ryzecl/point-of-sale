<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 25);
        $query = Order::with(['user', 'orderItems.item']);

        // Search by Order Code
        $query = $this->orderService->applyFilters($query, $request->all());

        $stats = [
            'totalOrderStats' => Order::count(),
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'settlement' => (clone $query)->where('status', 'settlement')->count(),
            'cooked' => (clone $query)->where('status', 'cooked')->count(),
            'served' => (clone $query)->where('status', 'served')->count(),
            'cancel' => (clone $query)->whereIn('status', ['expire', 'cancel'])->count(),
        ];

        $orders = OrderResource::collection($query->latestDeterministic()->paginate((int) $perPage)->withQueryString());

        return Inertia::render('order/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'perPage', 'date', 'date_from', 'date_to', 'payment_method']),
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('order/Show', [
            'order' => new OrderResource($order->load(['user', 'orderItems.item'])),
        ]);
    }

    public function updateStatus(Order $order)
    {
        $this->orderService->updateStatus($order, Auth::user());
        
        return back()->with('success', 'Order status updated successfully');
    }

    public function cancel(Order $order)
    {
        if (!$this->orderService->cancelOrder($order)) {
            return back()->with('error', 'Only pending orders can be cancelled');
        }

        return back()->with('success', 'Order cancelled successfully');
    }
}
