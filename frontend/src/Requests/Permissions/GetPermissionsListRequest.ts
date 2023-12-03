import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {getPermissionsAction} from "../../Store/Permissions/Actions";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

const getRequest = () => {
    return (dispatch: Dispatch) => {
        axios.post(getApiUrl("api/permissions/list"), {}, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse) => {
                return response;
            }).then((json) => {
                if (json.data.payload) {
                    dispatch(getPermissionsAction({
                        permissions: json.data.payload.permissions,
                    }));
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "PermissionsList");
            });
    };
};

export default getRequest;
