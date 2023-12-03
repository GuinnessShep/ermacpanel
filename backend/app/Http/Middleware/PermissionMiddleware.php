<?php

namespace App\Http\Middleware;

use App\Http\Response\AccessDeniedResponse;
use Closure;

class PermissionMiddleware
{
    public function handle($request, Closure $next, $permission, $guard = null)
    {
        $authGuard = app('auth')->guard($guard);

        if ($authGuard->guest()) {
            return AccessDeniedResponse::response();
        }

        $permissions = is_array($permission)
            ? $permission
            : explode('|', $permission);

        foreach ($permissions as $_permission) {
            if ($authGuard->user()->can($_permission)) {
                return $next($request);
            }
        }

        return AccessDeniedResponse::response();
    }
}
