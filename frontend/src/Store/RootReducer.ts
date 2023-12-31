import {BotsState} from "./Bots/Types";
import {combineReducers} from "redux";
import BotsReducer from "./Bots/Reducer";
import {AuthState} from "./Auth/Types";
import AuthReducer from "./Auth/Reducer";
import FiltersReducer from "./Filters/Reducer";
import {FiltersState} from "./Filters/Types";
import {LogsState} from "./Logs/Types";
import LogsReducer from "./Logs/Reducer";
import {InjectsState} from "./Injections/Types";
import InjectsReducer from "./Injections/Reducer";
import {UsersState} from "./Users/Types";
import UsersReducer from "./Users/Reducer";
import PermissionsReducer from "./Permissions/Reducer";
import {PermissionsState} from "./Permissions/Types";
import CountsReducer from "./Counts/Reducer";
import {CountsState} from "./Counts/Types";
import BotCommandsReducer from "./BotCommands/Reducer";
import {BotCommandsState} from "./BotCommands/Types";
import {StatsState} from "./Stats/Types";
import StatsReducer from "./Stats/Reducer";
import {AutoCommandsState} from "./AutoCommands/Types";
import acReducer from "./AutoCommands/Reducer";

export interface AppState {
    bots: BotsState,
    auth: AuthState,
    filters: FiltersState,
    logs: LogsState,
    injects: InjectsState,
    users: UsersState,
    permissions: PermissionsState,
    counts: CountsState,
    botCommands: BotCommandsState,
    stats: StatsState,
    autoCommands: AutoCommandsState,
}

const RootReducer = combineReducers({
    bots: BotsReducer,
    auth: AuthReducer,
    filters: FiltersReducer,
    logs: LogsReducer,
    injects: InjectsReducer,
    users: UsersReducer,
    permissions: PermissionsReducer,
    counts: CountsReducer,
    botCommands: BotCommandsReducer,
    stats: StatsReducer,
    autoCommands: acReducer,
});

export default RootReducer;
