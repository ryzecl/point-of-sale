<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['cat_name' => 'coffe', 'description' => 'Aneka Kopi di Janji Gibran', 'created_at' => now(), 'updated_at' => now()],
            ['cat_name' => 'milk', 'description' => 'Aneka Susu di Janji Gibran', 'created_at' => now(), 'updated_at' => now()],
            ['cat_name' => 'snack', 'description' => 'Aneka Makanan Ringan di Janji Gibran', 'created_at' => now(), 'updated_at' => now()],
            ['cat_name' => 'dessert', 'description' => 'Aneka Makanan Penutup di Janji Gibran', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('categories')->insert($categories);
    }
}
