import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Bot} from "../../Model/Bot";
import {setBotTypeValueAction} from "../../Store/Bots/Actions";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface BotsResponse {
    success: boolean,
    payload: Bot,
}

const setTypeValueRequest = (botId: string, type: string, value: boolean) => {
    return (dispatch: Dispatch) => {
        axios.put<BotsResponse>(getApiUrl(`api/bots/${botId}/setType`), {
            type: type,
            value: value,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<BotsResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.success) {
                    dispatch(setBotTypeValueAction({
                        bot: json.data.payload,
                    }));
                    message.success("Bots set type: Successfully");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bots set type");
            });
    };
};

export default setTypeValueRequest;
