<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UserTimestamp
 *
 * @property int $user_id
 * @property string|null $bots
 * @property string|null $banks
 * @property string|null $stealers
 * @property string|null $crypt
 * @property string|null $shops
 * @property string|null $email
 * @property string|null $wallets
 * @method static Builder|UserTimestamp newModelQuery()
 * @method static Builder|UserTimestamp newQuery()
 * @method static Builder|UserTimestamp query()
 * @method static Builder|UserTimestamp whereBanks($value)
 * @method static Builder|UserTimestamp whereBots($value)
 * @method static Builder|UserTimestamp whereCrypt($value)
 * @method static Builder|UserTimestamp whereEmail($value)
 * @method static Builder|UserTimestamp whereShops($value)
 * @method static Builder|UserTimestamp whereStealers($value)
 * @method static Builder|UserTimestamp whereUserId($value)
 * @method static Builder|UserTimestamp whereWallets($value)
 * @mixin \Eloquent
 */
class UserTimestamp extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'bots',
        'banks',
        'stealers',
        'crypt',
        'shops',
        'emails',
        'wallets',
        'credit_cards',
        'permissionless_bots',
        'events',
    ];

    protected $primaryKey = 'user_id';
}