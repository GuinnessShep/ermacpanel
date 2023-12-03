<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AutoCommand extends Model
{
    protected $casts = [
        'data' => 'json',
    ];

    protected $fillable =  [
        'data',
    ];
}
