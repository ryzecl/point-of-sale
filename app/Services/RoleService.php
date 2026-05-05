<?php

namespace App\Services;

use App\Models\Role;

class RoleService
{
    /**
     * Create a new role.
     */
    public function createRole(array $data): Role
    {
        if (isset($data['role_name'])) {
            $data['name'] = $data['role_name'];
            unset($data['role_name']);
        }
        return Role::create($data);
    }

    /**
     * Update an existing role.
     */
    public function updateRole($role_id, array $data): Role
    {
        $role = Role::findOrFail($role_id);
        if (isset($data['role_name'])) {
            $data['name'] = $data['role_name'];
            unset($data['role_name']);
        }
        $role->update($data);
        return $role;
    }

    /**
     * Delete a role.
     */
    public function deleteRole($role_id): bool
    {
        $role = Role::findOrFail($role_id);
        return $role->delete();
    }
}
