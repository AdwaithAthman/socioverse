import { RecievedChatInterface } from "./chatInterface";
import { UserDataInterface } from "./userInterface";

export interface MessageInterface {
    sender: string,
    content: string,
    chat: string,
    image?: string,
}

export interface RecievedMessageInterface {
    _id: string;
    sender: UserDataInterface;
    content: string;
    image: string;
    chat: RecievedChatInterface;
    createdAt: string;
    updatedAt: string;
}

