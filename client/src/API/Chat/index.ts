import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
    FetchOtherUserChatResponse,
    FetchUserChatsResponse,
    CreateGroupResponse,
} from "../../Types/chat";
import { User } from "../../Types/loginUser";

export const fetchOtherUserChat = async (
    otherUserId: string
): Promise<FetchOtherUserChatResponse> => {
    const response = await axiosUserInstance.post<FetchOtherUserChatResponse>(
        END_POINTS.FETCH_OTHER_USER_CHAT,
        { otherUserId }
    );
    return response.data;
};

export const fetchChats = async (): Promise<FetchUserChatsResponse> => {
    const response = await axiosUserInstance.get<FetchUserChatsResponse>(END_POINTS.FETCH_CHATS);
    return response.data;
}

export const createGroupChat = async(name: string, users: User[]): Promise<CreateGroupResponse> => {
    const response = await axiosUserInstance.post<CreateGroupResponse>(END_POINTS.CREATE_GROUP_CHAT, { name, users });
    return response.data;
}
