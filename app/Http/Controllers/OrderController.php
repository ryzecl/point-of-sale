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
    public function index(Request $request, OrderService $orderService)
    {
        $perPage = $request->query('perPage', 25);

        $totalOrderStats = Order::query();
        // Prevent N+1 Problem: Using 'with' to load nested relations
        // - 'user' -> load user/cashier data who processed the order
        // - 'orderItems.item' -> load receipt items along with their respective master detail item objects
        $query = Order::with(['user', 'orderItems.item']);

        // Search by Order Code
        $query = $orderService->applyFilters($query, $request->all());

        $stats = [
            'totalOrderStats' => $totalOrderStats->count(),
            'total' => $query->clone()->count(),
            'pending' => $query->clone()->where('status', 'pending')->count(),
            'settlement' => $query->clone()->where('status', 'settlement')->count(),
            'cooked' => $query->clone()->where('status', 'cooked')->count(),
            'served' => $query->clone()->where('status', 'served')->count(),
            'cancel' => $query->clone()->whereIn('status', ['expire', 'cancel'])->count(),
        ];

        // Always sort from the latest orders (Latest)
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
        if (Auth::user()->role->role_name == 'admin' || Auth::user()->role->role_name == 'cashier') {
            if ($order->status === OrderStatus::PENDING) {
                $order->status = OrderStatus::SETTLEMENT;
            } elseif ($order->status === OrderStatus::COOKED) {
                $order->status = OrderStatus::SERVED;
            }
        } else {
            if ($order->status === OrderStatus::SETTLEMENT) {
                $order->status = OrderStatus::COOKED;
            }
        }
        $order->save();

        return back()->with('success', 'Order status updated successfully');
    }

    public function cancel(Order $order)
    {
        // Ensure only pending orders can be cancelled
        if ($order->status !== OrderStatus::PENDING) {
            return back()->with('error', 'Only pending orders can be cancelled');
        }

        $order->status = OrderStatus::CANCEL;
        $order->save();

        return back()->with('success', 'Order cancelled successfully');
    }
}
