import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
  SendMessageResponse,
  GetAllMessagesFromChatResponse,
} from "../../Types/message";
import { FetchNotificationsResponse } from "../../Types/userProfile";

export const sendMessage = async (
  content: string,
  chatId: string
): Promise<SendMessageResponse> => {
  const response = await axiosUserInstance.post<SendMessageResponse>(
    END_POINTS.SEND_MESSAGE,
    {
      content,
      chatId,
    }
  );
  return response.data;
};

export const sendMessageWithImg = async (
  formData: FormData
): Promise<SendMessageResponse> => {
  const response = await axiosUserInstance.post<SendMessageResponse>(
    END_POINTS.SEND_MESSAGE_WITH_IMG,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getAllMessagesFromChat = async (
  chatId: string
): Promise<GetAllMessagesFromChatResponse> => {
  const response = await axiosUserInstance.get<GetAllMessagesFromChatResponse>(
    `${END_POINTS.GET_ALL_MESSAGES_FROM_CHAT}/${chatId}`
  );
  return response.data;
};

export const fetchNotifications = async (
  notificationIds: string[]
): Promise<FetchNotificationsResponse> => {
  const response = await axiosUserInstance.get<FetchNotificationsResponse>(
    `${END_POINTS.FETCH_NOTIFICATIONS}?Ids=${encodeURIComponent(
      JSON.stringify(notificationIds)
    )}`
  );
  return response.data;
};
