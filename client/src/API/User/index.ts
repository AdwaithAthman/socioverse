import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
  FollowUserResponse,
  GetRestOfUsersResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  GetSuggestionsResponse,
} from "../../Types/userProfile";

export const followUser = async (
  friendId: string
): Promise<FollowUserResponse> => {
  const response = await axiosUserInstance.post<FollowUserResponse>(
    END_POINTS.FOLLOW_USER,
    { friendId }
  );
  return response.data;
};

export const unfollowUser = async (
  friendId: string
): Promise<FollowUserResponse> => {
  const response = await axiosUserInstance.post<FollowUserResponse>(
    END_POINTS.UNFOLLOW_USER,
    { friendId }
  );
  return response.data;
};

export const getRestOfUsers = async (): Promise<GetRestOfUsersResponse> => {
  const response = await axiosUserInstance.get<GetRestOfUsersResponse>(
    END_POINTS.GET_REST_OF_USERS
  );
  return response.data;
};

export const getRestOfAllUsers = async (): Promise<GetRestOfUsersResponse> => {
  const response = await axiosUserInstance.get<GetRestOfUsersResponse>(
    END_POINTS.GET_REST_OF_ALL_USERS
  );
  return response.data;
};

export const getFollowers = async (
  userId: string
): Promise<GetFollowersResponse> => {
  const response = await axiosUserInstance.get<GetFollowersResponse>(
    `${END_POINTS.GET_FOLLOWERS}/${userId}`
  );
  return response.data;
};

export const getFollowing = async (
  userId: string
): Promise<GetFollowingResponse> => {
  const response = await axiosUserInstance.get<GetFollowingResponse>(
    `${END_POINTS.GET_FOLLOWING}/${userId}`
  );
  return response.data;
};

export const getSuggestions = async (): Promise<GetSuggestionsResponse> => {
  const response = await axiosUserInstance.get<GetSuggestionsResponse>(
    END_POINTS.GET_SUGGESTIONS
  );
  return response.data;
};

export const addNotification = async (
  messageId: string
): Promise<{ status: string }> => {
  const response = await axiosUserInstance.post<{ status: string }>(
    END_POINTS.ADD_NOTIFICATION,
    { messageId }
  );
  return response.data;
};

export const deleteNotificationFromDB = async (
  messageId: string
): Promise<{ status: string }> => {
  const response = await axiosUserInstance.delete<{ status: string }>(
    `${END_POINTS.DELETE_NOTIFICATION}/${messageId}`
  );
  return response.data;
};
