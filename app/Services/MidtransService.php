<?php

namespace App\Services;

use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = true;
        Config::$is3ds        = true;
    }

    /**
     * Generate Snap Token dari data Order yang sudah tersimpan di database.
     */
    public function createSnapToken(Order $order): string
    {
        $itemDetails = $order->orderItems->map(function ($orderItem) {
            return [
                'id'       => $orderItem->item_id,
                'price'    => (int) $orderItem->price,
                'quantity' => $orderItem->quantity,
                'name'     => $orderItem->item->name ?? 'Item #' . $orderItem->item_id,
            ];
        })->toArray();

        // Tambahkan PPN sebagai item terpisah agar grand total cocok
        $itemDetails[] = [
            'id'       => 'TAX-PPN',
            'price'    => (int) $order->tax,
            'quantity' => 1,
            'name'     => 'PPN 10%',
        ];

        $params = [
            'transaction_details' => [
                'order_id'     => $order->order_code,
                'gross_amount' => (int) $order->grand_total,
            ],
            'item_details' => $itemDetails,
            'customer_details' => [
                'first_name' => $order->user->name ?? 'Kasir',
                'email'      => $order->user->email ?? 'kasir@gmail.com',
            ],
        ];

        return Snap::getSnapToken($params);
    }

    /**
     * Proses notifikasi webhook dari Midtrans.
     * Mengembalikan object Notification untuk dibaca oleh controller.
     */
    public function handleNotification(): Notification
    {
        return new Notification();
    }
}
