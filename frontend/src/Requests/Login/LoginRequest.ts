import {Dispatch} from "redux";
import axios, {AxiosResponse} from "axios";
import {getApiUrl} from "../../Util/config";
import {authorizeAction} from "../../Store/Auth/Actions";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

const loginRequest = (token: string, password: string) => {
    return (dispatch: Dispatch) => {
        axios.post(getApiUrl("api/login"), {
            token: token,
            password: password,
        }).then((response: AxiosResponse) => {
            return response;
        }).then((json) => {
            if (json.data.payload.user && json.data.payload.token) {
                dispatch(authorizeAction(json.data.payload.token, json.data.payload.user));
            }
        }).catch((reason) => {
            requestErrorsMessage(reason, "Login error");
        });
    };
};

export default loginRequest;
