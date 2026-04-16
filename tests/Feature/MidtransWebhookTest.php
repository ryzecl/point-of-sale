<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use App\Services\MidtransService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MidtransWebhookTest extends TestCase
{
    use RefreshDatabase;

    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        // Persiapkan data dasar
        Role::factory()->create(['id' => 1, 'role_name' => 'cashier']);
        $user = User::factory()->create(['role_id' => 1]);

        $this->order = Order::create([
            'order_code' => 'TRX-TEST-001',
            'user_id' => $user->id,
            'subtotal' => 10000,
            'tax' => 1000,
            'grand_total' => 11000,
            'status' => OrderStatus::PENDING,
            'table_number' => 'B-01',
            'payment_method' => 'transfer',
            'payment_amount' => 11000,
            'change_amount' => 0,
            'discount' => 0,
        ]);
    }

    public function test_webhook_updates_order_to_settlement(): void
    {
        // Mock MidtransService untuk mengembalikan notifikasi sukses
        $this->mock(MidtransService::class, function ($mock) {
            $notification = \Mockery::mock(\Midtrans\Notification::class);
            $notification->order_id = 'TRX-TEST-001';
            $notification->transaction_status = 'settlement';
            $notification->fraud_status = 'accept';
            $notification->transaction_id = 'midtrans-tx-001';

            $mock->shouldReceive('handleNotification')->andReturn($notification);
        });

        $response = $this->postJson('/api/webhook/midtrans', []);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Webhook processed']);

        // Verifikasi database berubah
        $this->order->refresh();
        $this->assertEquals(OrderStatus::SETTLEMENT, $this->order->status);
        $this->assertEquals('midtrans-tx-001', $this->order->midtrans_transaction_id);
    }

    public function test_webhook_updates_order_to_cancel(): void
    {
        $this->mock(MidtransService::class, function ($mock) {
            $notification = \Mockery::mock(\Midtrans\Notification::class);
            $notification->order_id = 'TRX-TEST-001';
            $notification->transaction_status = 'cancel';
            $notification->transaction_id = 'midtrans-tx-002';

            $mock->shouldReceive('handleNotification')->andReturn($notification);
        });

        $response = $this->postJson('/api/webhook/midtrans', []);

        $response->assertStatus(200);

        $this->order->refresh();
        $this->assertEquals(OrderStatus::CANCEL, $this->order->status);
    }

    public function test_webhook_returns_404_if_order_not_found(): void
    {
        $this->mock(MidtransService::class, function ($mock) {
            $notification = \Mockery::mock(\Midtrans\Notification::class);
            $notification->order_id = 'UNKNOWN-TRX';
            $notification->transaction_status = 'settlement';

            $mock->shouldReceive('handleNotification')->andReturn($notification);
        });

        $response = $this->postJson('/api/webhook/midtrans', []);

        $response->assertStatus(404);
        $response->assertJson(['message' => 'Order not found']);
    }

    public function test_webhook_ignores_already_settled_order(): void
    {
        // Set order ke settlement dulu
        $this->order->update(['status' => OrderStatus::SETTLEMENT]);

        $this->mock(MidtransService::class, function ($mock) {
            $notification = \Mockery::mock(\Midtrans\Notification::class);
            $notification->order_id = 'TRX-TEST-001';
            $notification->transaction_status = 'settlement';

            $mock->shouldReceive('handleNotification')->andReturn($notification);
        });

        $response = $this->postJson('/api/webhook/midtrans', []);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Already settled']);
    }
}
