import {Dispatch} from "redux";
import {getApiUrl, getJwtToken} from "../../Util/config";
import axios, {AxiosError, AxiosResponse} from "axios";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {editLogCommentAction} from "../../Store/Logs/Actions";

interface EditLogsResponse {
    success: boolean,
    payload: {
        logIds: number[],
        comment: string,
    },
}

const editLogCommentRequest = (logIds: number[], comment: string) => {
    return (dispatch: Dispatch) => {
        axios.put<EditLogsResponse>(getApiUrl("api/logs/editComment"), {
            logIds: logIds,
            comment: comment,
        },
        {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        }).then((response: AxiosResponse<EditLogsResponse>) => {
            return response;
        }).then((json) => {
            if (json.data.success) {
                dispatch(editLogCommentAction({
                    logIds: json.data.payload.logIds,
                    comment: json.data.payload.comment,
                }));

                message.success("Logs comment: Successfuly updated");
            }
        }).catch((error: Error | AxiosError) => {
            requestErrorsMessage(error, "Logs comment");
        });
    };
};

export default editLogCommentRequest;
