<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\User\UserResource;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    public function respondWithToken(string $token): ApiResponse
    {
        return ApiResponse::success([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => null,
            'user' => UserResource::make(auth()->user()),
        ]);
    }
}
