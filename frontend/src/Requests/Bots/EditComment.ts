import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Bot} from "../../Model/Bot";
import {editBotsCommentAction} from "../../Store/Bots/Actions";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface EditBotsCommentResponse {
    success: boolean,
    payload: Pick<Bot, "id" | "comment">[],
}

const editBotsCommentRequest = (botIds: string[], comment: string) => {
    return (dispatch: Dispatch) => {
        axios.put<EditBotsCommentResponse>(getApiUrl("api/bots/editComment"), {
            botIds: botIds,
            comment: comment,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<EditBotsCommentResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.success) {
                    dispatch(editBotsCommentAction({
                        bots: json.data.payload,
                    }));
                    message.success("Bots comment: Updated successfully");
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bots comment");
            });
    };
};

export default editBotsCommentRequest;
