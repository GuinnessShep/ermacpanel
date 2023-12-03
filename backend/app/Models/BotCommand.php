<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\BotCommand
 *
 * @property int $id
 * @property string $bot_id
 * @property array $command json массив настроек: {command:"sendSMS",payload:{phone:"123456",text:"52314234"}}
 * @property bool $is_processed Флаг, по которому можно понять - обработана ли команда, или нет
 * @property string|null $run_at Запуск комманды в указанное время, формат Y-m-d H:i:s. Если указано NULL - запускать сразу
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\BotCommandFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand query()
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereBotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereCommand($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereIsProcessed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereRunAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BotCommand whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class BotCommand extends Model
{
    use HasFactory;

    protected $casts = [
        'is_processed' => 'boolean',
        'command' => 'array',
    ];

    protected $fillable = [
        'bot_id',
        'command',
        'run_at',
        'is_processed',
    ];
}
