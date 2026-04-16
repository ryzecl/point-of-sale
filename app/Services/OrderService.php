<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private readonly MidtransService $midtransService
    ) {}

    /**
     * Membuat pesanan offline (Kasir POS).
     *
     * @return array{order: Order, snapToken: string|null}
     */
    public function createOfflineOrder(array $data, int $userId): array
    {
        $order = DB::transaction(function () use ($data, $userId) {
            // 1. Validasi Stok dan Kalkulasi Total
            $cartItems = $data['cart'];
            $subtotal = 0;
            $preparedItems = [];

            foreach ($cartItems as $cartItem) {
                // lockForUpdate mencegah Race Condition
                $item = Item::lockForUpdate()->findOrFail($cartItem['id']);

                if ($item->stock < $cartItem['quantity']) {
                    throw new \Exception("Stok {$item->name} tidak cukup. Sisa: {$item->stock}");
                }

                $itemSubtotal = $item->price * $cartItem['quantity'];
                $itemTax = $itemSubtotal * 0.10; // Pajak 10% per item

                $subtotal += $itemSubtotal;

                // Siapkan data untuk tabel order_items (Sesuaikan dengan Model OrderItem)
                $preparedItems[] = [
                    'item_id'     => $item->id,
                    'quantity'    => $cartItem['quantity'],
                    'price'       => $item->price,
                    'tax'         => $itemTax,
                    'total_price' => $itemSubtotal + $itemTax,
                ];

                // Kurangi stok
                $item->decrement('stock', $cartItem['quantity']);
            }

            // 2. Kalkulasi Pajak dan Kembalian
            $tax = $subtotal * 0.10; // Pajak 10%
            $grandTotal = $subtotal + $tax;
            $paymentAmount = $data['paymentAmount'];

            // Hitung kembalian jika uang tunai >= tagihan
            $changeAmount = $paymentAmount >= $grandTotal ? $paymentAmount - $grandTotal : 0;

            // 3. Logika Status
            // Jika Cash = langsung berstatus settlement. Jika Transfer = pending menunggu konfirmasi/webhook
            $status = $data['paymentMethod'] === 'cash' ? 'settlement' : 'pending';

            // 4. Record Data Pesanan Utama (Order)
            $order = Order::create([
                'order_code'     => $this->generateOrderCode(),
                'user_id'        => $userId,
                'subtotal'       => $subtotal,
                'tax'            => $tax,
                'grand_total'    => $grandTotal,
                'status'         => $status,
                'table_number'   => $data['tableNumber'],
                'payment_method' => $data['paymentMethod'],
                'payment_amount' => $paymentAmount,
                'change_amount'  => $changeAmount,
                'note'           => $data['note'] ?? null,
                'discount'       => 0,
            ]);

            // 5. Masukkan rincian isi pesanan (Order Items)
            $order->orderItems()->createMany($preparedItems);

            // Return beserta relasi (opsional jika dibutuhkan controller)
            return $order->load('orderItems.item', 'user');
        });

        $snapToken = null;
        if ($data['paymentMethod'] === 'transfer') {
            $snapToken = $this->midtransService->createSnapToken($order);
            $order->update(['snap_token' => $snapToken]);
        }

        return [
            'order' => $order,
            'snapToken' => $snapToken,
        ];
    }

    private function generateOrderCode(): string
    {
        return 'TRX-' . now()->format('Ymd') . '-' . strtoupper(Str::random(4));
    }
}
