export interface ChatInterface {
    _id: string;
    name: string;
    users: string[];
}

export interface FetchOtherUserChatResponse {
    status: string;
    chat: any;
}

export interface FetchUserChatsResponse {
    status: string;
    chats: any[];
}