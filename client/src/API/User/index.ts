import axiosUserInstance from "../axiosInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
  FollowUserResponse,
  GetRestOfUsersResponse,
  GetFollowersResponse,
  GetFollowingResponse,
} from "../../Types/userProfile";

export const followUser = async (friendId: string): Promise<FollowUserResponse> => {
    const response = await axiosUserInstance.post<FollowUserResponse>(END_POINTS.FOLLOW_USER, {friendId});
    return response.data;
}

export const unfollowUser = async (friendId: string): Promise<FollowUserResponse> => {
    const response = await axiosUserInstance.post<FollowUserResponse>(END_POINTS.UNFOLLOW_USER, {friendId});
    return response.data;
}

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

export const getFollowers = async (): Promise<GetFollowersResponse> => {
  const response = await axiosUserInstance.get<GetFollowersResponse>(
    END_POINTS.GET_FOLLOWERS
  );
  return response.data;
}

export const getFollowing = async (): Promise<GetFollowingResponse> => {
  const response = await axiosUserInstance.get<GetFollowingResponse>(
    END_POINTS.GET_FOLLOWING
  );
  return response.data;
}