import {Dispatch} from "redux";
import axios, {AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {getCountsAction} from "../../Store/Counts/Actions";
import {GetCountsPayload} from "../../Store/Counts/Types";

interface GetCountsResponse {
    payload: GetCountsPayload,
    success: boolean,
}

const getCountsRequest = () => {
    return (dispatch: Dispatch) => {
        axios.post<GetCountsResponse>(getApiUrl("api/counts/list"), {}, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        })
            .then((response: AxiosResponse<GetCountsResponse>) => {
                return response;
            }).then((json:AxiosResponse<GetCountsResponse>) => {
                if (json.data.payload) {
                    dispatch(getCountsAction({
                        permissionless_bots: json.data.payload.permissionless_bots,
                        bots: json.data.payload.bots,
                        banks: json.data.payload.banks,
                        stealers: json.data.payload.stealers,
                        crypt: json.data.payload.crypt,
                        shops: json.data.payload.shops,
                        emails: json.data.payload.emails,
                        wallets: json.data.payload.wallets,
                        credit_cards: json.data.payload.credit_cards,
                        events: json.data.payload.events,
                    }));
                }
            });
    };
};

export default getCountsRequest;
