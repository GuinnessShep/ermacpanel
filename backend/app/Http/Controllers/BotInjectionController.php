<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\Bot\BotResource;
use App\Models\Bot;
use App\Models\BotInjection;
use Exception;
use Illuminate\Http\Request;

class BotInjectionController extends Controller
{
    public function update(string $botId, Request $request): ApiResponse
    {
        $routeParamsRequest = new Request($request->route()[2]);

        $this->validate($routeParamsRequest, [
            'botId' => 'exists:bots,id',
        ]);

        $this->validate($request, [
            'application' => 'required|string|exists:injections,application',
            'is_active' => 'required|boolean',
        ]);

        try {
            $botInjection = BotInjection::where('bot_id', $botId)
                ->where('application', $request->get('application'))
                ->firstOrFail();
        } catch (Exception) {
            return ApiResponse::error('Bot inject not found');
        }

        $botInjection->update([
            'is_active' => $request->get('is_active'),
        ]);

        $bot = Bot::findOrFail($botId);

        $bot->update([
            'update_settings' => true,
        ]);

        return ApiResponse::success(BotResource::make($bot));
    }
}