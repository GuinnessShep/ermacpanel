import {AUTH_CHECK, AUTH_LOGIN, AUTH_LOGOUT, AuthTypes} from "./Types";
import {User} from "../../Model/User";
import loginRequest from "../../Requests/Login/LoginRequest";
import meRequest from "../../Requests/Me/MeRequest";

export const authorizeAction = (token: string, user: User): AuthTypes => {
    return {
        type: AUTH_LOGIN,
        payload: {
            token: token,
            user: user,
        },
    };
};

export const authorize = (token: string, password: string) => {
    return loginRequest(token, password);
};

export const authorizeCheckAction = (token: string|null, user: User, isAuthorized: boolean): AuthTypes => {
    return {
        type: AUTH_CHECK,
        payload: {
            token: token,
            user: user,
            isAuthorized: isAuthorized,
        },
    };
};

export const authorizeCheck = (token: string|null) => {
    return meRequest(token);
};

export const logout = (): AuthTypes => {
    return {
        type: AUTH_LOGOUT,
    };
};
