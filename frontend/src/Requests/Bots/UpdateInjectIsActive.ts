import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Bot} from "../../Model/Bot";
import {updateBotInjectIsActiveAction} from "../../Store/Bots/Actions";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface BotsResponse {
    success: boolean,
    payload: Bot,
}

const updateInjectIsActiveRequest = (botId: string, application: string, is_active: boolean) => {
    return (dispatch: Dispatch) => {
        axios.put<BotsResponse>(getApiUrl(`api/bots/${botId}/injections/update`), {
            application: application,
            is_active: is_active,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<BotsResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.success) {
                    dispatch(updateBotInjectIsActiveAction({
                        bot: json.data.payload,
                    }));
                    message.success("Bot injection update is active: Successfully");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bot injection update is active");
            });
    };
};

export default updateInjectIsActiveRequest;
