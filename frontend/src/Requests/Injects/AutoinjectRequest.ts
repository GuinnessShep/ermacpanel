import {Dispatch} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {getApiUrl, getJwtToken} from "../../Util/config";
import {setInjectAutoInjectAction} from "../../Store/Injections/Actions";
import {Inject} from "../../Model/Inject";
import {requestErrorsMessage} from "../../Util/requestErrorsMessage";
import {message} from "antd";

// ты тут? da Что такое пайлоад в твоем понимании? я плохо понимаю
// само по себе понятие пайлоад - это полезная нагрузка, грубо говоря набор данных
// пайлоады действий - это данные, которые участвуют в жизненном цикле действий начиная с диспатчинга, заканчивая попаданием в редуктор.
// Грубо говоря: Диспатчим действие - передаем в него данные (пайлоад) - они попадают в редуктор.
// Это понимаешь? на словах понимаю

// Тут его тоже не должно быть, он у тебя еще не должно существовать
// Смотри, ты возможно сейчас не понимаешь из-за формата данных который хранится в пайлоаде, давай чуток сделаем иначе.

interface AutoInjectResponse {
    payload: Inject,
    success: boolean,
}

const autoInjectRequest = (injectId: number, autoInject: boolean) => {
    return (dispatch: Dispatch) => {
        axios.put<AutoInjectResponse>(getApiUrl(`/api/injections/${injectId}/changeAutoInject`), {
            injectId: injectId,
            autoInject: autoInject,
        }, {
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        }).then((response: AxiosResponse<AutoInjectResponse>) => {
            return response;
        }).then((json: AxiosResponse<AutoInjectResponse>) => {
            if (json.data.payload) {
                dispatch(setInjectAutoInjectAction({
                    inject: json.data.payload,
                }));
                message.success("AutoInject: success");
            }
        }).catch((error: Error | AxiosError) => {
            requestErrorsMessage(error, "AutoInject: ");
        });
    };
};

export default autoInjectRequest;
