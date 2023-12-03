import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Bot} from "../../Model/Bot";
import {getBotsAction} from "../../Store/Bots/Actions";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {BotsFilters} from "../../Store/Bots/Types";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface BotsResponse {
    isLoaded: boolean,
    bots: Bot[]
}

const getRequest = (page: number, per_page: number, filters: BotsFilters) => {
    return (dispatch: Dispatch) => {
        axios.post<BotsResponse>(getApiUrl("api/bots/list"), {
            page: page,
            per_page: per_page,
            filters: filters,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse) => {
                return response;
            }).then((json) => {
                if (json.data.payload) {
                    dispatch(getBotsAction({
                        bots: json.data.payload,
                        total: json.data.meta.total,
                        loaded_page: json.data.meta.current_page,
                        loaded_per_page: per_page,
                        per_page: json.data.meta.per_page,
                    }));
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Get bots list");
            });
    };
};

export default getRequest;
