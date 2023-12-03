import {AUTH_CHECK, AUTH_LOGIN, AUTH_LOGOUT, AuthCheckPayload, AuthState, AuthTypes} from "./Types";
import {User} from "../../Model/User";
import {message} from "antd";

const initialState: AuthState = {
    isAuthorized: false,
    user: {} as User,
    token: null,
    isLoaded: false,
};

const authorize = (state: AuthState, user: User, token: string): AuthState => {
    localStorage.setItem("token", token);
    message.success("Successfully authorized");

    return {
        user: user,
        token: token,
        isAuthorized: true,
        isLoaded: true,
    };
};

const checkAuth = (state: AuthState, payload: AuthCheckPayload): AuthState => {
    if (!payload.isAuthorized && payload.token) {
        message.error("Bad token");
        localStorage.removeItem("token");
    }

    return {
        ...payload,
        isLoaded: true,
    };
};

const logout = () => {
    localStorage.removeItem("token");
    message.success("Successfully logout");
    return {
        ...initialState,
        isLoaded: true,
    };
};

const AuthReducer = (state: AuthState = initialState, action: AuthTypes): AuthState => {
    switch (action.type) {
    case AUTH_LOGIN:
        return authorize(state, action.payload.user, action.payload.token);
    case AUTH_CHECK:
        return checkAuth(state, action.payload);
    case AUTH_LOGOUT:
        return logout();
    default:
        return state;
    }
};

export default AuthReducer;
