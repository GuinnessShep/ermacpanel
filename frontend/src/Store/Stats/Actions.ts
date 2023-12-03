import {StatsActionTypes, FETCH_STATS, GetStatsPayload} from "./Types";
import getStatsRequest from "../../Requests/Stats/GetStatsRequest";

export const getStatsAction = (payload: GetStatsPayload): StatsActionTypes => {
    return {
        type: FETCH_STATS,
        payload: payload,
    };
};

export const getStatsList = () => {
    return getStatsRequest();
};
