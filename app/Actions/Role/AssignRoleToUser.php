<?php

namespace App\Actions\Role;

use App\Models\User;

class AssignRoleToUser
{
    /**
     * Assign a role to a user.
     *
     * @param User $user
     * @param string|array $roles
     * @return User
     */
    public function execute(User $user, string|array $roles): User
    {
        return $user->syncRoles($roles);
    }
}
