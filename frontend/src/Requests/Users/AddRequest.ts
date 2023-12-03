import {Dispatch} from "redux";
import {User} from "../../Model/User";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {addUserAction} from "../../Store/Users/Actions";
import {UserAddRequestPayload} from "../../Store/Users/Types";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

export interface UsersResponse {
    users: User[],
    isLoaded: boolean,
}

const addRequest = (payload: UserAddRequestPayload) => {
    return (dispatch: Dispatch) => {
        axios.post<UsersResponse>(getApiUrl("api/users/create"),
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
                    dispatch(addUserAction(json.data.payload.user));
                }
            })
            .catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "User create");
            });
    };
};

export default addRequest;
