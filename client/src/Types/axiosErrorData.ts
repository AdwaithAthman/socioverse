import { AxiosError, AxiosResponse } from "axios";

interface ErrorMessage {
    message: string;
}

export interface AxiosErrorData extends AxiosError {
    response: AxiosResponse<ErrorMessage>
}

//AxiosError -> response -> data -> message