<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var Auth
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param Auth $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param string|null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if ($this->auth->guard($guard)->guest()) {
            return response()->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        if(auth()->user()->is_paused) {
            return response()->json([
                'error' => 'Your token suspended. Refresh page.',
            ], 401);
        }

        if(auth()->user()?->expired_at !== null && auth()->user()?->expired_at <= Carbon::now()) {
            return response()->json([
                'error' => 'Your token expired. Refresh page.',
            ], 401);
        }

        return $next($request);
    }
}
