<?php

namespace App\Services;

use App\Helpers\ApiResponse;
use App\Models\Injection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InjectionsService
{
    public static function import(): ApiResponse
    {
        $storage = Storage::disk('public');

        foreach ($storage->allFiles('injects/html') as $htmlPath) {
            preg_match("|(?<rootFolder>[\S]+)/(?<fileType>[\S]+)/(?<injectType>[\S]+)/(?<application>[\S]+).html|Uis", $htmlPath,
                $matches,
                PREG_UNMATCHED_AS_NULL);

            $imagePath = "{$matches['rootFolder']}/images/{$matches['injectType']}/{$matches['application']}.png";
            $namePath = "{$matches['rootFolder']}/names/{$matches['injectType']}/{$matches['application']}.txt";

            $htmlBlob = file_get_contents(base_path() . "/public/$htmlPath");
            $imageBlob = file_get_contents(base_path() . "/public/$imagePath");
            $nameBlob = file_get_contents(base_path() . "/public/$namePath");

            $injection = Injection::create([
                'application' => $matches['application'],
                'name' => $nameBlob,
                'html' => "/$htmlPath",
                'image' => "/$imagePath",
                'type' => $matches['injectType'],
            ]);

            $injection->files()->create([
                'injection_id' => $injection->id,
                'html_blob' => $htmlBlob,
                'image_blob' => $imageBlob,
            ]);
        }

        return ApiResponse::success();
    }

    public static function export(): ApiResponse
    {
        $storage = Storage::disk('public');

        $injections = Injection::with('files')->get();

        foreach ($injections as $inject) {
            $storage->put("injects/html/{$inject->type}/$inject->application.html", $inject->files->html_blob);
            $storage->put("injects/images/{$inject->type}/$inject->application.png", $inject->files->image_blob);
            $storage->put("injects/names/{$inject->type}/$inject->application.txt", $inject->name);
        }

        return ApiResponse::success();
    }

    public static function exportFromOldPanel(): ApiResponse
    {
        $storage = Storage::disk('public');

        $injections = DB::table('datainjections')->get();

        foreach ($injections as $inject) {
            $storage->put("injects2/html/$inject->type_injects/$inject->app.html", base64_decode($inject->html));
            $storage->put("injects2/images/$inject->type_injects/$inject->app.png", base64_decode($inject->icon));
            $storage->put("injects2/names/$inject->type_injects/$inject->app.txt", $inject->name);
        }

        return ApiResponse::success();
    }
}