<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    public function __construct(
        private readonly MidtransService $midtransService,
        private readonly OrderService $orderService
    ) {}

    public function handle(Request $request): JsonResponse
    {
        try {
            $notification = $this->midtransService->handleNotification();

            $orderId           = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus       = $notification->fraud_status ?? null;
            $transactionId     = $notification->transaction_id ?? null;

            Log::info('Midtrans Webhook Received', [
                'order_id' => $orderId,
                'status'   => $transactionStatus,
                'fraud'    => $fraudStatus,
            ]);

            // Find order by order_code
            $order = Order::where('order_code', $orderId)->first();

            if (!$order) {
                Log::warning("Midtrans Webhook: Order {$orderId} not found.");
                return response()->json(['message' => 'Order not found'], 404);
            }

            // Idempotency check: Do not update if already settled
            if ($order->status === OrderStatus::SETTLEMENT) {
                return response()->json(['message' => 'Already settled']);
            }

            // Update status based on Midtrans notification
            match ($transactionStatus) {
                'capture' => $this->handleCapture($order, $fraudStatus, $transactionId),
                'settlement' => $this->updateOrderStatus($order, OrderStatus::SETTLEMENT, $transactionId),
                'pending' => $this->updateOrderStatus($order, OrderStatus::PENDING, $transactionId),
                'deny', 'cancel' => $this->handleCancellation($order, OrderStatus::CANCEL, $transactionId),
                'expire' => $this->handleCancellation($order, OrderStatus::EXPIRE, $transactionId),
                default => Log::info("Midtrans: Unhandled status '{$transactionStatus}' for {$orderId}"),
            };

            return response()->json(['message' => 'Webhook processed']);
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error'], 500);
        }
    }

    private function handleCancellation(Order $order, OrderStatus $status, ?string $transactionId): void
    {
        try {
            DB::transaction(function () use ($order, $status, $transactionId) {
                $this->orderService->restoreStock($order);
                $order->update([
                    'status' => $status,
                    'midtrans_transaction_id' => $transactionId,
                ]);
            });
            Log::info("Order {$order->order_code} cancelled/expired and stock restored.");
        } catch (\Exception $e) {
            Log::error("Webhook Cancellation Error: " . $e->getMessage());
        }
    }

    private function handleCapture(Order $order, ?string $fraudStatus, ?string $transactionId): void
    {
        if ($fraudStatus === 'accept') {
            $this->updateOrderStatus($order, OrderStatus::SETTLEMENT, $transactionId);
        } else {
            Log::warning("Midtrans Capture with fraud status: {$fraudStatus}");
        }
    }

    private function updateOrderStatus(Order $order, OrderStatus $status, ?string $transactionId): void
    {
        $order->update([
            'status' => $status,
            'midtrans_transaction_id' => $transactionId,
        ]);

        Log::info("Order {$order->order_code} updated to {$status->value}");
    }
}
