import {User} from "../../Model/User";

export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_CHECK = "AUTH_CHECK";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

export interface AuthState {
    isAuthorized: boolean,
    user: User,
    token: null | string,
    isLoaded: boolean,
}

export interface AuthLoginPayload {
    token: string,
    user: User,
}

export interface AuthLoginAction {
    type: typeof AUTH_LOGIN,
    payload: AuthLoginPayload
}

export interface AuthCheckPayload {
    token: string|null,
    user: User,
    isAuthorized: boolean,
}

export interface AuthCheckAction {
    type: typeof AUTH_CHECK,
    payload: AuthCheckPayload
}

export interface AuthLogoutAction {
    type: typeof AUTH_LOGOUT,
}

export type AuthTypes = AuthLoginAction | AuthCheckAction | AuthLogoutAction
