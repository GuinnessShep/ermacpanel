<?php

namespace App\Http\Resources\Bot;

use App\Http\Resources\BaseCollection;

class BotCollection extends BaseCollection
{
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
