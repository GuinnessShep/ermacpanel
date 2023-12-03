import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {ACChangeCommandFieldsPayload} from "../../Store/AutoCommands/Types";
import {acChangeCommandFieldsAction} from "../../Store/AutoCommands/Actions";

interface AutoCommandsResponse {
    success: boolean,
    payload: ACChangeCommandFieldsPayload,
}

const autoCommandsUpdate = (data: ACChangeCommandFieldsPayload) => {
    return (dispatch: Dispatch) => {
        axios.put<AutoCommandsResponse>(getApiUrl("api/auto_commands/update"), {
            data: data,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<AutoCommandsResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.success) {
                    dispatch(acChangeCommandFieldsAction(json.data.payload));
                    message.success("Auto commands update: Successfully");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Auto commands update");
            });
    };
};

export default autoCommandsUpdate;
