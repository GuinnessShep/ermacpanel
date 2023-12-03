import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {deleteUserAction} from "../../Store/Users/Actions";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

const deleteRequest = (userId: number) => {
    return (dispatch: Dispatch) => {
        axios.delete(getApiUrl(`api/users/${userId}/delete`),
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
                    dispatch(deleteUserAction({
                        userId: json.data.payload.user.id,
                    }));
                    message.success("User deleted");
                }
            })
            .catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "User delete");
            });
    };
};

export default deleteRequest;
