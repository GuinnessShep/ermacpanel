import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {message} from "antd";
import {UpdatePermissionPayload} from "../../Store/Permissions/Types";
import {updatePermissionAction} from "../../Store/Permissions/Actions";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";

interface UpdatePermissionResponse {
    payload: UpdatePermissionPayload,
}

const updatePermissionsListRequest = (permission: string, roles: string[]) => {
    return (dispatch: Dispatch) => {
        axios.put<UpdatePermissionResponse>(getApiUrl("api/permissions/update"), {
            permission: permission,
            roles: roles,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<UpdatePermissionResponse>) => {
                return response;
            }).then((json: AxiosResponse) => {
                dispatch(updatePermissionAction(json.data.payload));
                message.success("Permissions changes: success");
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Permissions changes");
            });
    };
};

export default updatePermissionsListRequest;
