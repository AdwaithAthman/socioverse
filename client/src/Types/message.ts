import {  MessageInterface } from "./chat";

export interface SendMessageResponse {
    status: string;
    message: MessageInterface;
}

export interface GetAllMessagesFromChatResponse {
    status: string;
    messages: MessageInterface[];
}