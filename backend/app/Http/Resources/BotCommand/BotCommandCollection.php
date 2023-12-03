<?php

namespace App\Http\Resources\BotCommand;

use App\Http\Resources\BaseCollection;

class BotCommandCollection extends BaseCollection
{
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
