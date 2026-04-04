<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['role_name' => 'superadmin', 'description' => 'Bussines Owner', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'admin', 'description' => 'Administrator', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'cashier', 'description' => 'Kasir', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'chef', 'description' => 'Koki', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'internship', 'description' => 'Anak Magang', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'customer', 'description' => 'Pembeli', 'created_at' => now(), 'updated_at' => now()]
        ];

        DB::table('roles')->insert($roles);
    }
}
