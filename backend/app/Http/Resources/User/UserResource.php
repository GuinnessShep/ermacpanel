<?php

namespace App\Http\Resources\User;

use App\Http\Resources\BaseResource;

class UserResource extends BaseResource
{
    public function toArray($request = null): array
    {
        $permissions = collect($this->getAllPermissions())
            ->pluck('name')
            ->toArray();

        $this->load('tags');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'token' => $this->token,
            'email' => $this->email,
            'is_paused' => $this->is_paused,
            'expired_at' => $this->expired_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'role' => $this->getRoleNames()->first(),
            'tags' => $this->tags->pluck('tag'),
            'permissions' => $permissions,
        ];
    }
}
