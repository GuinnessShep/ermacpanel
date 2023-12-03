import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl} from "../../Util/config";
import {authorizeCheckAction} from "../../Store/Auth/Actions";
import {Dispatch} from "redux";
import {User} from "../../Model/User";
import {message} from "antd";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

const meRequest = (token: string|null) => {
    return (dispatch: Dispatch) => {
        if (!token) {
            dispatch(authorizeCheckAction(token, {} as User, false));
            return null;
        }

        return axios.get(getApiUrl("api/me"), {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response: AxiosResponse) => {
                return response;
            })
            .then((json) => {
                if (json.data.payload.user) {
                    dispatch(authorizeCheckAction(token, json.data.payload.user, true));
                } else {
                    message.error("Check auth error");
                }
            }).catch((error: Error | AxiosError) => {
                dispatch(authorizeCheckAction(token, {} as User, false));
                requestErrorsMessage(error, "Check auth");
            });
    };
};

export default meRequest;
