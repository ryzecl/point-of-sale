<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleStoreRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $perPage = request()->query('perPage', 25);
        $query = Role::query();

        $roles = RoleResource::collection($query->paginate($perPage));
        // dd($roles);
        return Inertia::render('role/Index', [
            'roles' => $roles
        ]);
    }

    public function store(RoleStoreRequest $request)
    {
        Role::create($request->all());
        return back()->with('success', 'Data saved successfully.');
    }
}
