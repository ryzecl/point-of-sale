<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(2, true);

        return [
            'name' => $name,
            'category_id' => fake()->numberBetween(1, 4),
            'price' => fake()->numberBetween(5000, 150000), // Harga dalam rupiah lebih realistis
            'description' => fake()->sentence(),

            // 2. Gunakan UI-Avatars dengan inisial nama barang
            // background=random akan memberikan warna warni yang berbeda tiap item
            'img' => 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=random&color=fff&size=512',

            'is_active' => fake()->boolean(90), // 90% kemungkinan aktif
            'stock' => fake()->numberBetween(10, 100),
            'min_stock' => 5,
        ];
    }
}
