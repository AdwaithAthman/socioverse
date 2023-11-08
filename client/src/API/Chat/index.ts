import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
    FetchOtherUserChatResponse,
    FetchUserChatsResponse,
} from "../../Types/chat";

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
