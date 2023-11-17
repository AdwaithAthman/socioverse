import { User } from "./loginUser";

export interface MessageInterface {
    _id: string;
    sender: User;
    content: string;
    chat: ChatInterface;
    createdAt: string;
    updatedAt: string;
}

export interface ChatInterface {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: User[];
    latestMessage: MessageInterface;
    groupAdmin: User;
    groupDp: string;
    createdAt: string;
    updatedAt: string;
}

export interface FetchOtherUserChatResponse {
    status: string;
    chat: ChatInterface;
}

export interface FetchUserChatsResponse {
    status: string;
    chats: ChatInterface[];
}

export interface CreateGroupResponse {
    status: string;
    groupChat: ChatInterface;
}

export interface UpdateGroupResponse {
    status: string;
    groupChat: ChatInterface;
}

export interface RemoveFromGroupResponse {
    status: string;
    updatedChat: ChatInterface; 
}

export interface AddGroupDpResponse {
    status: string;
    groupChat: ChatInterface;   
}