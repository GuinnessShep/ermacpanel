<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Store a new user.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function register(Request $request): ApiResponse
    {
        

        try {
           
            return ApiResponse::error([
                'message' => $e->getMessage(),
                'entity' => 'users',
                'action' => 'create',
                'result' => 'failed'
            ], 409);

        } catch (Exception $e) {
            return ApiResponse::error([
                'message' => $e->getMessage(),
                'entity' => 'users',
                'action' => 'create',
                'result' => 'failed'
            ], 409);
        }
    }

    /**
     * Get a JWT via given credentials.
     *
     * @throws ValidationException
     */
    public function login(Request $request): ApiResponse
    {
        $this->validate($request, [
            'token' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = [
            'token' => $request->get('token'),
            'password' => $request->get('password'),
        ];

        $user = User::where([
            'token' => $request->get('token'),
        ])->first();

        if($user?->is_paused) {
            return ApiResponse::error('Your token suspended', 403);
        }

        if($user?->expired_at !== null && $user?->expired_at <= Carbon::now()) {
            return ApiResponse::error('Your token expired', 403);
        }

        if (!$token = Auth::attempt($credentials)) {
            return ApiResponse::error('Bad token or password', 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get user details.
     */
    public function me(): ApiResponse
    {
        return ApiResponse::success([
            'user' => UserResource::make(auth()->user())->toArray(),
        ]);
    }
}
