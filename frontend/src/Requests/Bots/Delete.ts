import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Bot} from "../../Model/Bot";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {deleteBotsAction} from "../../Store/Bots/Actions";
import {message} from "antd";

interface BotsDeleteResponse {
    isLoaded: boolean,
    bots: Bot[]
}

const deleteRequest = (botIds: string[]) => {
    return (dispatch: Dispatch) => {
        axios.delete<BotsDeleteResponse>(getApiUrl("api/bots/delete"), {
            data: {
                botIds: botIds,
            },
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse) => {
                return response;
            }).then((json) => {
                if (json.data.payload) {
                    dispatch(deleteBotsAction({
                        botIds: botIds,
                    }));
                    message.success("Bots delete: success");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bots delete");
            });
    };
};

export default deleteRequest;
