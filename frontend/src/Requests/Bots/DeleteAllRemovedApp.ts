import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {deleteRemovedAppBotsAction} from "../../Store/Bots/Actions";

interface BotsDeleteResponse {
    payload: {
        success: boolean,
        botIds: string[]
    }
}

const deleteAllRemovedApp = () => {
    return (dispatch: Dispatch) => {
        axios.delete<BotsDeleteResponse>(getApiUrl("api/bots/deleteAllRemovedApp"), {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<BotsDeleteResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.payload) {
                    dispatch(deleteRemovedAppBotsAction({
                        botIds: json.data.payload.botIds,
                    }));
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bots delete");
            });
    };
};

export default deleteAllRemovedApp;
