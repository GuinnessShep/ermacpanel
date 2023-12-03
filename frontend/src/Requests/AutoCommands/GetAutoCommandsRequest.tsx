import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {AutoCommandsState} from "../../Store/AutoCommands/Types";
import {acChangeCommandFieldsAction} from "../../Store/AutoCommands/Actions";

interface AutoCommandsResponse {
    success: boolean,
    payload: Omit<AutoCommandsState, "is_loaded">,
}

const getAutoCommands = () => {
    return (dispatch: Dispatch) => {
        axios.post<AutoCommandsResponse>(getApiUrl("api/auto_commands/list"), {}, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<AutoCommandsResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.success) {
                    dispatch(acChangeCommandFieldsAction(json.data.payload));
                    message.success("Auto commands list: Successfully");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Auto commands list");
            });
    };
};

export default getAutoCommands;
