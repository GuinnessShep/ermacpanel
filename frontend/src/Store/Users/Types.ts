import {User} from "../../Model/User";
import {WithPaginationFields} from "../../Interfaces/WithPaginationFields";

export const FETCH_USERS = "FETCH_USERS";
export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";
export const ADD_USER = "ADD_USER";

export interface UsersState extends WithPaginationFields {
    users: User[],
    isLoaded: boolean,
    tags: string[],
}

export interface GetUsersPayload extends WithPaginationFields {
    users: User[],
    tags: string[],
}

export interface GetUsersAction {
    type: typeof FETCH_USERS,
    payload: GetUsersPayload,
}

export interface EditUserPayload {
    user: User,
}

export interface EditUserAction {
    type: typeof EDIT_USER,
    payload: EditUserPayload,
}

export interface DeleteUserPayload {
    userId: number,
}

export interface DeleteUserAction {
    type: typeof DELETE_USER,
    payload: DeleteUserPayload,
}

export interface UserEditRequestPayload{
    token?: string,
    name?: string,
    email?: string,
    is_paused?: boolean,
    expired_at?: string,
    tags?: string[],
    role?: string,
}

export interface UserAddRequestPayload{
    token?: string,
    name?: string,
    email?: string,
    is_paused?: boolean,
    expired_at?: string,
    tags?: string[],
    role?: string,
}

export interface AddUserPayload {
    user: User,
}

export interface AddUserAction {
    type: typeof ADD_USER,
    payload: AddUserPayload,
}

export type UsersActionTypes = GetUsersAction | EditUserAction | DeleteUserAction | AddUserAction;
