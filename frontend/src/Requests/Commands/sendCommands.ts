import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

export interface SendCommandPayload {
    command: string,
    payload: object,
    botIds: string[],
}

const sendCommand = (payload: SendCommandPayload) => {
    axios.post(getApiUrl("api/bots/sendCommand"),
        payload, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        }).then((response: AxiosResponse) => {
        return response;
    }).then((json) => {
        message.success("Command send: Success");
    }).catch((error: Error | AxiosError) => {
        requestErrorsMessage(error, "Command send");
    });
};

export default sendCommand;
