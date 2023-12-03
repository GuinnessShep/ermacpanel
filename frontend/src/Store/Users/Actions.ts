import {
    ADD_USER,
    DELETE_USER,
    DeleteUserPayload,
    EDIT_USER,
    EditUserPayload,
    FETCH_USERS,
    GetUsersPayload,
    UserAddRequestPayload,
    UserEditRequestPayload,
    UsersActionTypes,
} from "./Types";
import getRequest from "../../Requests/Users/GetListRequest";
import editRequest from "../../Requests/Users/EditRequest";
import deleteRequest from "../../Requests/Users/DeleteRequest";
import addRequest from "../../Requests/Users/AddRequest";
import {User} from "../../Model/User";

export const getUsersAction = (payload: GetUsersPayload): UsersActionTypes => {
    return {
        type: FETCH_USERS,
        payload: payload,
    };
};

export const editUserAction = (payload: EditUserPayload): UsersActionTypes => {
    return {
        type: EDIT_USER,
        payload: payload,
    };
};

export const deleteUserAction = (payload: DeleteUserPayload): UsersActionTypes => {
    return {
        type: DELETE_USER,
        payload: payload,
    };
};

export const addUserAction = (user: User): UsersActionTypes => {
    return {
        type: ADD_USER,
        payload: {
            user: user,
        },
    };
};

export const getUsersList = (
    page: number = 1,
    per_page: number = 15,
) => {
    return getRequest(page, per_page);
};

export const editUser = (userId: number, payload: UserEditRequestPayload) => {
    return editRequest(userId, payload);
};

export const deleteUser = (userId: number) => {
    return deleteRequest(userId);
};

export const addUser = (
    payload: UserAddRequestPayload,
) => {
    return addRequest(payload);
};
