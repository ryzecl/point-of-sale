<?php

namespace App\Services;

use App\Models\User;

use App\Actions\Role\AssignRoleToUser;

class UserService
{
    protected AssignRoleToUser $assignRoleToUser;

    public function __construct(AssignRoleToUser $assignRoleToUser)
    {
        $this->assignRoleToUser = $assignRoleToUser;
    }

    /**
     * Create a new user.
     */
    public function createUser(array $data): User
    {
        $role = $data['role'] ?? null;
        unset($data['role'], $data['role_id']);

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        if ($role) {
            $this->assignRoleToUser->execute($user, $role);
        }

        return $user;
    }

    /**
     * Update an existing user.
     */
    public function updateUser(User $user, array $data): bool
    {
        $role = $data['role'] ?? null;
        unset($data['role'], $data['role_id']);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        $updated = $user->update($data);

        if ($updated && $role) {
            $this->assignRoleToUser->execute($user, $role);
        }

        return $updated;
    }

    /**
     * Delete a user.
     */
    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }
}
