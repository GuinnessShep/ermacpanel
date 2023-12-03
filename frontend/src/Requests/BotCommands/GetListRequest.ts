import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {BotCommand} from "../../Model/BotCommand";
import {ResponseWithPagination} from "../../Interfaces/ResponseWithPagination";
import {getBotCommandsListAction} from "../../Store/BotCommands/Actions";

interface BotCommandsResponse extends ResponseWithPagination<BotCommand> {
    payload: BotCommand[],
}

const getListRequest = (botId: string, page: number, per_page: number) => {
    return (dispatch: Dispatch) => {
        axios.get<BotCommandsResponse>(getApiUrl(`api/bots/${botId}/commands/list`), {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
            params: {
                page: page,
                per_page: per_page,
            },
        })
            .then((response: AxiosResponse<BotCommandsResponse>) => {
                return response;
            }).then((json) => {
                if (json.data.payload) {
                    dispatch(getBotCommandsListAction({
                        commands: json.data.payload,
                        botId: botId,
                        total: json.data.meta.total,
                        page: json.data.meta.current_page,
                        per_page: json.data.meta.per_page,
                    }));
                }
            }).catch((error: Error | AxiosError) => {
                requestErrorsMessage(error, "Bot commands");
            });
    };
};

export default getListRequest;
