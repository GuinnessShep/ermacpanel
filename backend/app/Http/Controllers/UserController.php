<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\User\UserCollection;
use App\Http\Resources\User\UserResource;
use App\Models\Bot;
use App\Models\User;
use App\Models\UserTag;
use App\Models\UserTimestamp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Throwable;

class UserController extends Controller
{
    public function list(Request $request): JsonResponse
    {
        $this->validate($request, [
            'per_page' => 'integer',
        ]);

        $users = User::orderBy('id')
            ->when(auth()->user()->role === 'admin', function ($query) {
                $query->role(['user', 'seo'])->where('created_user_id', auth()->user()->id)->orWhere('id', '=', auth()->user()->id);
            })
            ->when(auth()->user()->role === 'user', function ($query) {
                $query->role(['seo']);
            })
            ->when(auth()->user()->role === 'seo', function ($query) {
                $query->role(['seo']);
            })
            ->paginate($request->get('per_page', 15));

        return UserCollection::make($users)->response();
    }

    public function edit(int $userId, Request $request): ApiResponse
    {
        $request = new Request($this->validate($request, [
            'userId' => 'exists:users,id',
            'token' => "string|unique:users,token,$userId",
            'name' => 'string',
            'email' => 'email|nullable',
            'is_paused' => 'boolean',
            'expired_at' => 'dateformat:"Y-m-d H:i:s"|nullable',
            'tags' => 'array',
            'password' => 'string',
            'role' => [Rule::in(Role::all()->pluck('name'))],
        ]));

        $user = User::find($userId);

        $user->fill($request->all());

        if ($request->has('token') && $request->get('token') !== $user->token) {
            $user->token = $request->get('token');
        }

        if ($request->has('password')) {
            $user->password = app('hash')->make($request->get('password'));
        }

        if ($request->has('tags')) {
            $userTags = $user->tags->pluck('tag');
            $tagsCollection = collect($request->get('tags'));

            $tagsForDelete = $userTags->diff($tagsCollection);
            $tagsForCreate = $tagsCollection->diff($userTags);

            if ($tagsForDelete->count()) {
                $user->tags()->whereIn('tag', $tagsForDelete)->delete();
            }

            if ($tagsForCreate->count()) {
                foreach ($tagsForCreate as $tag) {
                    UserTag::create([
                        'user_id' => $user->id,
                        'tag' => $tag,
                    ]);
                }
            }
        }

        if ($request->has('expired_at') && $request->get('expired_at') === null) {
            $user->expired_at = null;
        }

        if ($request->has('role') && auth()->user()->id !== $userId) {
            $user->syncRoles([$request->get('role')]);
        }

        if (!$user->save()) {
            return ApiResponse::error('Cant save user');
        }

        return ApiResponse::success([
            'user' => UserResource::make($user)->toArray(),
        ]);
    }

    public function delete(int $userId): ApiResponse
    {
        $user = User::find($userId);

        if (!$user) {
            return ApiResponse::error('User not found');
        }

        if ($user->id === auth()->user()->id) {
            return ApiResponse::error('User id equal to current user');
        }

        if (!$user->delete()) {
            return ApiResponse::error('Api error');
        }

        return ApiResponse::success([
            'user' => [
                'id' => $userId,
            ],
        ]);
    }

    public function create(Request $request): ApiResponse
    {
        $request = new Request($this->validate($request, [
            'token' => "required|string|unique:users,token",
            'name' => 'required|string',
            'role' => ['required', Rule::in(Role::all()->pluck('name'))],
            'tags' => 'array',
            'email' => 'email|nullable',
            'expired_at' => 'dateformat:"Y-m-d H:i:s"|nullable',
        ]));

        try {
            $user = new User;
            $user->fill($request->all());
            $user->password = app('hash')->make($request->get('token'));
            $user->expired_at = $request->get('expired_at');
            $user->created_user_id = auth()->user()->id;
            $user->save();

            if ($request->has('tags')) {
                $tagsCollection = collect($request->get('tags'));

                if ($tagsCollection->count()) {
                    foreach ($tagsCollection as $tag) {
                        UserTag::create([
                            'user_id' => $user->id,
                            'tag' => $tag,
                        ]);
                    }
                }
            }

            $user->entitiesTimestamps()->save(new UserTimestamp());

            $user->assignRole($request->get('role'));
        } catch (Throwable $e) {
            return ApiResponse::error([
                'error' => $e->getMessage(),
            ], 409);
        }

        return ApiResponse::success([
            'user' => UserResource::make($user)->toArray(),
        ]);
    }
}
