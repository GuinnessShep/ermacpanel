<?php

namespace App\Http\Controllers;

use App\Http\Resources\BotCommand\BotCommandCollection;
use App\Models\BotCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BotCommandController extends Controller
{
    public function list(string $botId, Request $request): JsonResponse
    {
        $routeParamsRequest = new Request($request->route()[2]);

        $this->validate($routeParamsRequest, [
            'botId' => 'exists:bots,id',
        ]);

        $this->validate($request, [
            'per_page' => 'integer',
            'page' => 'integer',
        ]);

        $botCommands = BotCommand::where('bot_id', $botId)
            ->select('bot_commands.*')
            ->join('bots', 'bots.id', '=', 'bot_commands.bot_id');

        if(count(auth()->user()->tagsNames)) {
            $botCommands = $botCommands->whereIn('bots.tag', auth()->user()->tagsNames);
        }

        $botCommands = $botCommands->orderByDesc('id')
            ->paginate($request->get('per_page', 5));

        return BotCommandCollection::make($botCommands)->response();
    }
}