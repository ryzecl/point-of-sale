<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleStoreRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Spatie\Permission\Models\Permission;
use App\Actions\Role\SyncRolePermissions;

class RoleController extends Controller
{
    protected RoleService $roleService;
    protected SyncRolePermissions $syncRolePermissions;

    public function __construct(RoleService $roleService, SyncRolePermissions $syncRolePermissions)
    {
        $this->roleService = $roleService;
        $this->syncRolePermissions = $syncRolePermissions;
    }

    public function index(Request $request)
    {
        $perPage = $request->integer('perPage', 25);
        $query = Role::with('permissions');

        return Inertia::render('role/Index', [
            'roles' => RoleResource::collection($query->paginate($perPage)),
            'all_permissions' => Permission::all()->pluck('name'),
        ]);
    }

    public function store(RoleStoreRequest $request)
    {
        $role = $this->roleService->createRole($request->all());
        
        if ($request->has('permissions')) {
            $this->syncRolePermissions->execute($role, $request->input('permissions'));
        }

        return back()->with('success', 'Data saved successfully.');
    }

    public function update(RoleStoreRequest $request, $role_id)
    {
        $role = $this->roleService->updateRole($role_id, $request->all());

        if ($request->has('permissions')) {
            $this->syncRolePermissions->execute($role, $request->input('permissions'));
        }

        return back()->with('success', 'Data change update successfully');
    }

    public function destroy($role_id)
    {
        $this->roleService->deleteRole($role_id);

        return back()->with('success', 'Role deleted successfully');
    }
}
