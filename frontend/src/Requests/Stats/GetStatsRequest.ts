import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {getStatsAction} from "../../Store/Stats/Actions";
import {GetStatsPayload} from "../../Store/Stats/Types";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {message} from "antd";

interface GetStatsResponse {
    payload: GetStatsPayload,
    success: boolean,
}

const getStatsRequest = () => {
    return (dispatch: Dispatch) => {
        axios.post<GetStatsResponse>(getApiUrl("api/stats/list"), {}, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<GetStatsResponse>) => {
                return response;
            }).then((json:AxiosResponse<GetStatsResponse>) => {
                if (json.data.payload) {
                    dispatch(getStatsAction(json.data.payload));

                    message.success("Stats: success");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Stats");
            });
    };
};

export default getStatsRequest;
