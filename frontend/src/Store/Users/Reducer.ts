import {
    ADD_USER,
    AddUserPayload,
    DELETE_USER,
    DeleteUserPayload,
    EDIT_USER,
    EditUserPayload,
    FETCH_USERS,
    GetUsersPayload,
    UsersActionTypes,
    UsersState,
} from "./Types";
import {User} from "../../Model/User";

const initialState: UsersState = {
    users: [],
    total: 0,
    per_page: 15,
    page: 1,
    isLoaded: false,
    tags: [],
};

const getUsers = (state: UsersState, payload: GetUsersPayload): UsersState => {
    return {
        ...payload,
        isLoaded: true,
    };
};

const editUser = (state: UsersState, payload: EditUserPayload): UsersState => {
    const userIndex = state.users.findIndex((user: User) => user.id === payload.user.id);
    state.users[userIndex] = payload.user;

    return {
        ...state,
        users: [...state.users],
    };
};

const deleteUser = (state: UsersState, payload: DeleteUserPayload): UsersState => {
    return {
        ...state,
        users: state.users.filter((user: User) => user.id !== payload.userId),
    };
};

const addUser = (state: UsersState, payload: AddUserPayload): UsersState => {
    state.users.push(payload.user);

    return {
        ...state,
        users: [...state.users],
    };
};

const UsersReducer = (state: UsersState = initialState, action: UsersActionTypes): UsersState => {
    switch (action.type) {
    case FETCH_USERS:
        return getUsers(state, action.payload);
    case EDIT_USER:
        return editUser(state, action.payload);
    case DELETE_USER:
        return deleteUser(state, action.payload);
    case ADD_USER:
        return addUser(state, action.payload);
    default:
        return state;
    }
};

export default UsersReducer;
