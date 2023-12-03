import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {deleteInjectAction} from "../../Store/Injections/Actions";
import {message} from "antd";

interface DeleteInjectResponse {
    success: boolean,
    payload: {
        ids: number[],
    },
}

const deleteInjectRequest = (injectIds: number[]) => {
    return (dispatch: Dispatch) => {
        axios.delete<DeleteInjectResponse>(getApiUrl("api/injections/delete"),
            {
                headers: {
                    "Authorization": `Bearer ${getJwtToken()}`,
                },
                data: {
                    ids: injectIds,
                },
            })
            .then((response: AxiosResponse<DeleteInjectResponse>) => {
                return response;
            })
            .then((json) => {
                if (json.data.payload) {
                    dispatch(deleteInjectAction(json.data.payload.ids));
                    message.success("Injection delete: successfully");
                }
            })
            .catch((error: Error | AxiosError | string) => {
                requestErrorsMessage(error, "Injection delete");
            });
    };
};

export default deleteInjectRequest;
