import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {Inject} from "../../Model/Inject";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {InjectEditRequestPayload} from "../../Store/Injections/Types";
import {editInjectAction} from "../../Store/Injections/Actions";
import {message} from "antd";

interface CreateInjectResponse {
    success: boolean,
    payload: Inject,
}

const editInjectRequest = (injectId: number, payload: InjectEditRequestPayload) => {
    return (dispatch: Dispatch) => {
        const formData = new FormData();

        const payloads = payload as Record<string, any>;
        // eslint-disable-next-line guard-for-in
        for (const key in payloads) {
            formData.append(key, payloads[key]);
        }

        axios.post<CreateInjectResponse>(getApiUrl(`api/injections/${injectId}/edit`),
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${getJwtToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response: AxiosResponse<CreateInjectResponse>) => {
                return response;
            })
            .then((json) => {
                if (json.data.payload) {
                    dispatch(editInjectAction(json.data.payload));
                    message.success("Injection edit: successfully");
                }
            })
            .catch((error: Error | AxiosError | string) => {
                requestErrorsMessage(error, "Injection edit");
            });
    };
};

export default editInjectRequest;
