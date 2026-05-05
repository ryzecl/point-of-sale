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
        // test ssh key github (tadinya pake gpg males jir)
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $perPage = $request->integer('perPage', 25);
        $query = User::with('roles');

        $rolesQuery = Role::query();
        if (!$request->user()->hasRole('super_admin')) {
            $rolesQuery->where('name', '!=', 'super_admin');
        }

        return Inertia::render('user/Index', [
            'users' => UserResource::collection($query->paginate($perPage)),
            'roles' => RoleResource::collection($rolesQuery->get())
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        if ($request->input('role') === 'super_admin' && !$request->user()->hasRole('super_admin')) {
            abort(403, 'Only Super Admin can assign the Super Admin role.');
        }

        $this->userService->createUser($request->validated());

        return back()->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        return Inertia::render('user/Show', [
            'user' => new UserResource($user->load('roles'))
        ]);
    }

    public function update(UserStoreRequest $request, User $user)
    {
        if ($user->hasRole('super_admin') && !$request->user()->hasRole('super_admin')) {
            abort(403, 'Cannot modify a Super Admin user.');
        }
        if ($request->input('role') === 'super_admin' && !$request->user()->hasRole('super_admin')) {
            abort(403, 'Only Super Admin can assign the Super Admin role.');
        }

        $this->userService->updateUser($user, $request->validated());

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->hasRole('super_admin') && !$request->user()->hasRole('super_admin')) {
            abort(403, 'Cannot delete a Super Admin user.');
        }

        $this->userService->deleteUser($user);

        return back()->with('success', 'User deleted successfully.');
    }
}
