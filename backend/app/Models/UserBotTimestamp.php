<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBotTimestamp extends Model
{
    public $timestamps = false;

    protected $table = 'user_bot_timestamp';

    protected $fillable = [
        'user_id',
        'bot_id',
        'application',
        'visited_at',
    ];

    protected $primaryKey = 'user_id';
}