<?php

namespace App\Http\Resources\BotLog;

use App\Http\Resources\BaseCollection;

class BotLogCollection extends BaseCollection
{
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
