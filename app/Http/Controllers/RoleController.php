<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleStoreRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index()
    {
        $perPage = request()->query('perPage', 25);
        $query = Role::query();

        $roles = RoleResource::collection($query->paginate($perPage));
        
        return Inertia::render('role/Index', [
            'roles' => $roles
        ]);
    }

    public function store(RoleStoreRequest $request)
    {
        $this->roleService->createRole($request->all());
        return back()->with('success', 'Data saved successfully.');
    }

    public function update(RoleStoreRequest $request, $role_id)
    {
        $this->roleService->updateRole($role_id, $request->all());
        return back()->with('success', 'Data change update successfully');
    }

    public function destroy($role_id)
    {
        $this->roleService->deleteRole($role_id);

        return back()->with('success', 'Role deleted successfully');
    }
}
