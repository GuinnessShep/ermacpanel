<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\InjectionFile
 *
 * @property int $injection_id
 * @property mixed|null $html_blob
 * @property mixed|null $image_blob
 * @method static \Illuminate\Database\Eloquent\Builder|InjectionFile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InjectionFile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InjectionFile query()
 * @method static \Illuminate\Database\Eloquent\Builder|InjectionFile whereHtmlBlob($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InjectionFile whereImageBlob($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InjectionFile whereInjectionId($value)
 * @mixin \Eloquent
 */
class InjectionFile extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'image_blob',
        'html_blob',
    ];
}
