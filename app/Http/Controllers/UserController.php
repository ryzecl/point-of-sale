<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $perPage = request()->query('perPage', 25);
        $query = User::with('role');

        $users = UserResource::collection($query->paginate($perPage));
        $roles = RoleResource::collection(Role::all());

        return Inertia::render('user/Index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $this->userService->createUser($request->validated());

        return back()->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        return Inertia::render('user/Show', [
            'user' => new UserResource($user->load('role'))
        ]);
    }

    public function update(UserStoreRequest $request, User $user)
    {
        $this->userService->updateUser($user, $request->validated());

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->userService->deleteUser($user);

        return back()->with('success', 'User deleted successfully.');
    }
}
