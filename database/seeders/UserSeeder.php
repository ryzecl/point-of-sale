<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = [
            'name' => config('user.superadmin.name'),
            'email' => config('user.superadmin.email'),
            'password' => Hash::make(config('user.superadmin.password')),
            'role_id' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ];

        $admin = [
            'name' => config('user.admin.name'),
            'email' => config('user.admin.email'),
            'password' => Hash::make(config('user.admin.password')),
            'role_id' => 2,
            'created_at' => now(),
            'updated_at' => now()
        ];

        $employees = [
            ['name' => 'cashier', 'email' => 'cashier@gmail.com', 'password' => Hash::make('password'), 'role_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'chef', 'email' => 'chef@gmail.com', 'password' => Hash::make('password'), 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('users')->insert([$superadmin, $admin, ...$employees]);
    }
}
