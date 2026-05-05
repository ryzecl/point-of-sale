<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\User;
use App\Services\MidtransService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private User $cashier;
    private Item $item;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Persiapkan Role dan User
        $role = \Spatie\Permission\Models\Role::create(['name' => 'cashier']);
        $permission = \Spatie\Permission\Models\Permission::create(['name' => 'pos.access']);
        $role->givePermissionTo($permission);
        
        $this->cashier = User::factory()->create();
        $this->cashier->assignRole($role);

        // 2. Persiapkan Item dengan kategori (karena ItemFactory pake category_id 1-4)
        // Kita buat kategori dulu agar tidak error constraint
        \Illuminate\Support\Facades\DB::table('categories')->insert([
            ['id' => 1, 'cat_name' => 'Food', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'cat_name' => 'Drink', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'cat_name' => 'Snack', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'cat_name' => 'Other', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->item = Item::factory()->create([
            'category_id' => 1,
            'price' => 10000,
            'stock' => 50
        ]);
    }

    public function test_cashier_can_create_cash_order(): void
    {
        $response = $this->actingAs($this->cashier)->post(route('cashier.store'), [
            'cart' => [
                ['id' => $this->item->id, 'quantity' => 2]
            ],
            'tableNumber' => 5,
            'paymentMethod' => 'cash',
            'paymentAmount' => 30000, // 20k + tax 2k = 22k. 30k is enough.
            'customerName' => 'Test Customer',
            'note' => 'Testing cash'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('orderSuccess');

        // Verifikasi DB
        $this->assertDatabaseHas('orders', [
            'payment_method' => 'cash',
            'status' => 'settlement',
            'table_number' => 5,
            'grand_total' => 22000, // (10000 * 2) + 10% tax
        ]);

        // Verifikasi Stok berkurang
        $this->assertEquals(48, $this->item->fresh()->stock);
    }

    public function test_cashier_can_create_transfer_order_and_receive_snap_token(): void
    {
        // Mock MidtransService agar tidak memanggil API beneran
        $this->mock(MidtransService::class, function (MockInterface $mock) {
            $mock->shouldReceive('createSnapToken')
                ->once()
                ->andReturn('fake-snap-token-123');
        });

        $response = $this->actingAs($this->cashier)->post(route('cashier.store'), [
            'cart' => [
                ['id' => $this->item->id, 'quantity' => 1]
            ],
            'tableNumber' => 10,
            'paymentMethod' => 'transfer',
            'paymentAmount' => 11000, // Sama dengan grand total
            'customerName' => 'Test Customer',
            'note' => 'Testing transfer'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('orderSuccess');

        $orderSuccess = session('orderSuccess');
        $this->assertEquals('fake-snap-token-123', $orderSuccess['snapToken']);

        // Verifikasi DB
        $this->assertDatabaseHas('orders', [
            'payment_method' => 'transfer',
            'status' => 'pending',
            'snap_token' => 'fake-snap-token-123'
        ]);
    }

    public function test_order_creation_fails_if_stock_is_insufficient(): void
    {
        $response = $this->actingAs($this->cashier)->post(route('cashier.store'), [
            'cart' => [
                ['id' => $this->item->id, 'quantity' => 100] // Stok cuma 50
            ],
            'tableNumber' => 12,
            'paymentMethod' => 'cash',
            'paymentAmount' => 1000000,
            'customerName' => 'Test Customer',
        ]);

        // Harusnya error dan balik ke halaman sebelumnya dengan pesan error
        $response->assertSessionHasErrors();
        $this->assertEquals(50, $this->item->fresh()->stock); // Stok tidak boleh berubah
    }
}
