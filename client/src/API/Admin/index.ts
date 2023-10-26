import axiosAdminInstance, {
  axiosAdminRefreshInstance,
} from "../AxiosInstance/axiosAdminInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import { AdminLoginInterface, AdminLoginResponse, GetUsersResponse, GetAllPostsResponse, GetReportInfoResponse } from "../../Types/admin";

export const adminLogin = async (
  payload: AdminLoginInterface
): Promise<AdminLoginResponse> => {
  const response = await axiosAdminRefreshInstance.post<AdminLoginResponse>(
    END_POINTS.ADMIN_LOGIN,
    payload
  );
  return response.data;
};

export const refreshAdminAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await axiosAdminRefreshInstance.get<{ accessToken: string }>(
    END_POINTS.REFRESH_ADMIN_TOKEN,
    { withCredentials: true }
  );
  return response.data;
};

export const getAllUsers = async (): Promise<GetUsersResponse> => {
  const response = await axiosAdminInstance.get<GetUsersResponse>(
    END_POINTS.GET_USERS
  );
  return response.data;
};

export const blockUser = async (userId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.BLOCK_USER}/${userId}`
  );
  return response.data;
}

export const unblockUser = async (userId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.UNBLOCK_USER}/${userId}`
  );
  return response.data;
}

export const getAllPosts = async (): Promise<GetAllPostsResponse> => {
  const response = await axiosAdminInstance.get<GetAllPostsResponse>(
    END_POINTS.GET_ALL_POSTS
  );
  return response.data;
}

export const blockPost = async (postId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.BLOCK_POST}/${postId}`
  );
  return response.data;
}

export const unblockPost = async (postId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.UNBLOCK_POST}/${postId}`
  );
  return response.data;
}

export const getReportInfo = async (postId: string): Promise<GetReportInfoResponse> => {
  const response = await axiosAdminInstance.get<GetReportInfoResponse>(
    `${END_POINTS.GET_REPORT_INFO}/${postId}`
  );
  return response.data;
}
