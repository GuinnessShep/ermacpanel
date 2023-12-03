<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $roles = ['root', 'admin', 'seo', 'user'];

        $rootPermissions = [
            'bots.list',
            'bots.delete',
            'bots.comment',

            'users.list',
            'users.create',
            'users.createRoot',
            'users.createAdmin',
            'users.createSeo',
            'users.createUser',
            'users.edit',
            'users.delete',
            'users.token',

            'banks.list',
            'banks.delete',
            'banks.editComment',

            'credit_cards.list',
            'credit_cards.delete',
            'credit_cards.editComment',

            'stealers.list',
            'stealers.delete',
            'stealers.editComment',

            'injections.list',
            'injections.create',
            'injections.edit',
            'injections.delete',

            'crypt.list',
            'crypt.delete',
            'crypt.editComment',

            'shops.list',
            'shops.delete',
            'shops.editComment',

            'emails.list',
            'emails.delete',
            'emails.editComment',

            'wallets.list',
            'wallets.delete',
            'wallets.editComment',

            'permissions.list',
            'permissions.change',

            'stats.list',

            'sms.list',

            'events.list',

            'googleauth.list',

            'hidesms.list',

            'keylogger.list',

            'mail.list',

            'otheraccounts.list',

            'phonenumber.list',

            'pushlist.list',

            'ussd.list',

            'datakeylogger.list',

            'applist.list',

            'smslist.list',

            'autoCommands.list',
            'autoCommands.edit',
        ];

        $adminPermissions = [
            'bots.list',
            'bots.delete',
            'bots.comment',

            'users.list',
            'users.create',
            'users.createSeo',
            'users.createUser',
            'users.edit',
            'users.delete',

            'banks.list',
            'banks.delete',

            'credit_cards.list',
            'credit_cards.delete',

            'stealers.list',
            'stealers.delete',

            'injections.list',
            'injections.delete',

            'crypt.list',
            'crypt.delete',

            'shops.list',
            'shops.delete',

            'emails.list',
            'emails.delete',

            'wallets.list',
            'wallets.delete',

            'sms.list',

            'events.list',

            'googleauth.list',

            'hidesms.list',

            'keylogger.list',

            'mail.list',

            'otheraccounts.list',

            'phonenumber.list',

            'pushlist.list',

            'ussd.list',

            'datakeylogger.list',

            'applist.list',

            'smslist.list',
        ];

        $seoPermissions = [
            'bots.list',

            'users.list',

            'banks.list',

            'credit_cards.list',

            'stealers.list',

            'injections.list',

            'crypt.list',

            'shops.list',

            'emails.list',

            'wallets.list',

            'sms.list',

            'events.list',

            'googleauth.list',

            'hidesms.list',

            'keylogger.list',

            'mail.list',

            'otheraccounts.list',

            'phonenumber.list',

            'pushlist.list',

            'ussd.list',

            'datakeylogger.list',

            'applist.list',

            'smslist.list',
        ];

        $userPermissions = [
            'bots.list',

            'users.list',

            'banks.list',

            'credit_cards.list',

            'stealers.list',

            'injections.list',

            'crypt.list',

            'shops.list',

            'emails.list',

            'wallets.list',

            'sms.list',

            'events.list',

            'googleauth.list',

            'hidesms.list',

            'keylogger.list',

            'mail.list',

            'otheraccounts.list',

            'phonenumber.list',

            'pushlist.list',

            'ussd.list',

            'datakeylogger.list',

            'applist.list',

            'smslist.list',
        ];

        $rolesPermissions = [
            'root' => $rootPermissions,
            'admin' => $adminPermissions,
            'seo' => $seoPermissions,
            'user' => $userPermissions,
        ];

        foreach ($rootPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        foreach ($roles as $_role) {
            $role = Role::firstOrCreate(['name' => $_role]);
            foreach ($rolesPermissions[$_role] as $permission) {
                $role->givePermissionTo($permission);
            }
        }
    }
}
