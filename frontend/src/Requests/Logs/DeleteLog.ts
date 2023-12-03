import {Dispatch} from "redux";
import {getApiUrl, getJwtToken} from "../../Util/config";
import axios, {AxiosError, AxiosResponse} from "axios";
import {deleteLogsAction} from "../../Store/Logs/Actions";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface DeleteLogResponse {
    success: boolean,
    payload: {
        logIds: number[],
    },
}

const deleteLogRequest = (logIds: number[]) => {
    return (dispatch: Dispatch) => {
        axios.delete<DeleteLogResponse>(getApiUrl("api/logs/delete"), {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
            data: {
                logIds: logIds,
            },
        }).then((response: AxiosResponse<DeleteLogResponse>) => {
            return response;
        }).then((json) => {
            if (json.data.success) {
                dispatch(deleteLogsAction({
                    logIds: json.data.payload.logIds,
                }));

                message.success("Log action: Successful deleted");
            }
        }).catch((error: Error | AxiosError) => {
            requestErrorsMessage(error, "Log delete");
        });
    };
};

export default deleteLogRequest;
