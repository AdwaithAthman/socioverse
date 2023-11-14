import { RecievedChatInterface } from "./chatInterface";
import { UserDataInterface } from "./userInterface";

export interface MessageInterface {
    sender: string,
    content: string,
    chat: string,
}

export interface RecievedMessageInterface {
    _id: string;
    sender: UserDataInterface;
    content: string;
    chat: RecievedChatInterface;
    createdAt: string;
    updatedAt: string;
}

