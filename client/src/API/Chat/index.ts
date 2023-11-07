import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import { FetchOtherUserChatResponse } from "../../Types/chat";

export const fetchOtherUserChat = async (otherUserId: string): Promise<FetchOtherUserChatResponse> => {
    const response = await axiosUserInstance.post<FetchOtherUserChatResponse>(END_POINTS.FETCH_OTHER_USER_CHAT , { otherUserId });
    return response.data;

}