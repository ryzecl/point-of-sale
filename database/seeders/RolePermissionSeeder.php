<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Enums\PermissionName;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        foreach (PermissionName::cases() as $permission) {
            Permission::firstOrCreate(['name' => $permission->value]);
        }

        // Create Roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $cashier = Role::firstOrCreate(['name' => 'cashier']);
        $chef = Role::firstOrCreate(['name' => 'chef']);
        $internship = Role::firstOrCreate(['name' => 'internship']);
        $customer = Role::firstOrCreate(['name' => 'customer']);

        // Give permissions to roles
        $admin->givePermissionTo([
            PermissionName::USER_VIEW->value,
            PermissionName::USER_CREATE->value,
            PermissionName::USER_UPDATE->value,
            PermissionName::ROLE_VIEW->value,
            PermissionName::ROLE_CREATE->value,
            PermissionName::ROLE_UPDATE->value,
            PermissionName::CATEGORY_VIEW->value,
            PermissionName::CATEGORY_CREATE->value,
            PermissionName::CATEGORY_UPDATE->value,
            PermissionName::ITEM_VIEW->value,
            PermissionName::ITEM_CREATE->value,
            PermissionName::ITEM_UPDATE->value,
            PermissionName::REPORT_VIEW->value,
        ]);

        $cashier->givePermissionTo([
            PermissionName::POS_ACCESS->value,
            PermissionName::REPORT_VIEW->value,
        ]);

        // Assign roles to seeded users
        $users = User::all();
        foreach ($users as $user) {
            if ($user->email === config('user.superadmin.email')) {
                $user->assignRole($superAdmin);
            } elseif ($user->email === config('user.admin.email')) {
                $user->assignRole($admin);
            } elseif ($user->email === 'cashier@gmail.com') {
                $user->assignRole($cashier);
            } elseif ($user->email === 'chef@gmail.com') {
                $user->assignRole($chef);
            }
        }
    }
}
