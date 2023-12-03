import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {UserEditRequestPayload} from "../../Store/Users/Types";
import {editUserAction} from "../../Store/Users/Actions";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

const editRequest = (userId: number, payload: UserEditRequestPayload) => {
    return (dispatch: Dispatch) => {
        axios.put(getApiUrl(`api/users/${userId}/edit`),
            payload,
            {
                headers: {
                    "Authorization": `Bearer ${getJwtToken()}`,
                },
            })
            .then((response: AxiosResponse) => {
                return response;
            })
            .then((json) => {
                if (json.data.payload) {
                    dispatch(editUserAction({
                        user: json.data.payload.user,
                    }));
                    message.success("User edit: success");
                }
            })
            .catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "User edit");
            });
    };
};

export default editRequest;
