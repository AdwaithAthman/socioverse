import { MessageInterface } from "./messageInterface";
import { UserDataInterface } from "./userInterface";

export interface EditChatInterface {
    chatName?: string;
    users?: string[];
}

export interface RecievedChatInterface {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: UserDataInterface[];
    latestMessage: MessageInterface;
    groupAdmin: UserDataInterface;
    createdAt: string;
    updatedAt: string;
}