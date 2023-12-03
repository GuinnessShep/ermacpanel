<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function list(): ApiResponse
    {
        $permissions = Permission::all()->groupBy(function (Permission $permission) {
            return explode(".", $permission->name)[0];
        })->map(function (Collection $permissions) {
            return $permissions->mapWithKeys(function (Permission $permission) {
                return [$permission->name => $permission->roles->pluck('name')];
            });
        });

        return ApiResponse::success([
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request): ApiResponse
    {
        $this->validate($request, [
            'roles' => 'array',
            'roles.*' => 'in:root,admin,seo,user',
            'permission' => 'string',
        ]);

        $permission = Permission::where('name', $request->get('permission'))->firstOrFail();

        $permission->syncRoles($request->get('roles'));

        [$permissionGroupName] = explode(".", $permission->name);

        return ApiResponse::success([
            'group' => $permissionGroupName,
            'permission' => $permission->name,
            'roles' => $permission->roles->pluck('name'),
        ]);
    }
}