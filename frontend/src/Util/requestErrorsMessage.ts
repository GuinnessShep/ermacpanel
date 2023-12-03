import {message} from "antd";
import axios, {AxiosError} from "axios";

export const requestErrorsMessage = (error: (Error | AxiosError | string), prefix: string) => {
    if (typeof error === "string") {
        alert("\df");
        return;
    }

    if (axios.isAxiosError(error)) {
        if (error.response?.data.error !== undefined) {
            message.error(`${prefix}: ${error.response.data.error}`);
        } else if (error.response?.data.message !== undefined) {
            message.error(`${prefix}: ${error.response.data.message}`);
        } else if (typeof error.response?.data === "string") {
            message.error(error.response?.data);
        } else {
            Object.keys(error.response?.data).forEach((key) => {
                const value = error.response?.data[key];

                if (typeof value === "object") {
                    error.response?.data[key].forEach((value: string) => {
                        message.error(`${prefix}: ${value}`);
                    });
                } else {
                    message.error(`${prefix}: ${value}`);
                }
            });
        }
    } else {
        message.error(`${prefix}: ${error.message}`);
    }
};
