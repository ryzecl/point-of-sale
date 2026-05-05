<?php

namespace App\Actions\Role;

use Spatie\Permission\Models\Role;

class SyncRolePermissions
{
    /**
     * Sync permissions for a specific role.
     *
     * @param Role $role
     * @param array $permissions
     * @return Role
     */
    public function execute(Role $role, array $permissions): Role
    {
        return $role->syncPermissions($permissions);
    }
}
