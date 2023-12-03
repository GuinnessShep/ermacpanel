<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UserTag
 *
 * @property int $id
 * @property int $user_id
 * @property string $tag
 * @method static \Illuminate\Database\Eloquent\Builder|UserTag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserTag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserTag query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserTag whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserTag whereTag($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserTag whereUserId($value)
 * @mixin \Eloquent
 */
class UserTag extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'tag',
    ];
}
