import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Bot} from "../../Model/Bot";
import {updateBotSettingsValueAction} from "../../Store/Bots/Actions";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface BotsResponse {
    success: boolean,
    payload: Bot,
}

const updateSettingsValueRequest = (botId: string, type: string, value: boolean) => {
    return (dispatch: Dispatch) => {
        axios.put<BotsResponse>(getApiUrl(`api/bots/${botId}/settings/update`), {
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
                    dispatch(updateBotSettingsValueAction({
                        bot: json.data.payload,
                    }));
                    message.success("Bot settings update: Successfully");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bot settings update");
            });
    };
};

export default updateSettingsValueRequest;
