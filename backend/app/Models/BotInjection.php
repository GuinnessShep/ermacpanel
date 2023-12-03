<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\BotInjection
 *
 * @property int $id
 * @property string $bot_id
 * @property string $application Название пакета приложения. Пример: org.app.name
 * @property int $is_active
 * @method static \Database\Factories\BotInjectionFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection query()
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection whereApplication($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection whereBotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotInjection whereIsActive($value)
 * @mixin \Eloquent
 */
class BotInjection extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_active',
    ];
    
    public $timestamps = false;

    public function botLogs(): HasMany
    {
        return $this->hasMany(BotLog::class, 'application', 'application');
    }

    public function injection(): HasOne
    {
        return $this->hasOne(Injection::class, 'application', 'application');
    }

    public function logs(): HasManyThrough
    {
        return $this->hasManyThrough(UserBotTimestamp::class, BotLog::class, 'bot_id', 'applicatiosn', secondLocalKey: 'application');
    }
}
