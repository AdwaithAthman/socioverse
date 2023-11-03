import axiosAdminInstance, {
  axiosAdminRefreshInstance,
} from "../AxiosInstance/axiosAdminInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
  AdminLoginInterface,
  AdminLoginResponse,
  GetUsersResponse,
  GetAllPostsResponse,
  GetReportInfoResponse,
  GetAllCommentsResponse,
  GetAllRepliesResponse,
  GetAllReportedCommentsResponse,
  GetAllReportedRepliesResponse,
  GetCommentReportedUsers,
  GetReplyReportedUsers,
  GetMonthlyUsersResponse,
  GetMonthlyPostsResponse,
} from "../../Types/admin";

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

export const blockUser = async (
  userId: string
): Promise<{ status: string; message: string }> => {
  const response = await axiosAdminInstance.post<{
    status: string;
    message: string;
  }>(`${END_POINTS.BLOCK_USER}/${userId}`);
  return response.data;
};

export const unblockUser = async (
  userId: string
): Promise<{ status: string; message: string }> => {
  const response = await axiosAdminInstance.post<{
    status: string;
    message: string;
  }>(`${END_POINTS.UNBLOCK_USER}/${userId}`);
  return response.data;
};

export const getAllPosts = async (): Promise<GetAllPostsResponse> => {
  const response = await axiosAdminInstance.get<GetAllPostsResponse>(
    END_POINTS.GET_ALL_POSTS
  );
  return response.data;
};

export const blockPost = async (
  postId: string
): Promise<{ status: string; message: string }> => {
  const response = await axiosAdminInstance.post<{
    status: string;
    message: string;
  }>(`${END_POINTS.BLOCK_POST}/${postId}`);
  return response.data;
};

export const unblockPost = async (
  postId: string
): Promise<{ status: string; message: string }> => {
  const response = await axiosAdminInstance.post<{
    status: string;
    message: string;
  }>(`${END_POINTS.UNBLOCK_POST}/${postId}`);
  return response.data;
};

export const getReportInfo = async (
  postId: string
): Promise<GetReportInfoResponse> => {
  const response = await axiosAdminInstance.get<GetReportInfoResponse>(
    `${END_POINTS.GET_REPORT_INFO}/${postId}`
  );
  return response.data;
};

export const getAllComments = async (): Promise<GetAllCommentsResponse> => {
  const response = await axiosAdminInstance.get<GetAllCommentsResponse>(
    END_POINTS.GET_ALL_COMMENTS
  );
  return response.data;
};

export const getAllReplies = async (): Promise<GetAllRepliesResponse> => {
  const response = await axiosAdminInstance.get<GetAllRepliesResponse>(
    END_POINTS.GET_ALL_REPLIES
  );
  return response.data;
};

export const getAllReportedComments = async (): Promise<GetAllReportedCommentsResponse> => {
  const response = await axiosAdminInstance.get<GetAllReportedCommentsResponse>(
    END_POINTS.GET_ALL_REPORTED_COMMENTS
  );
  return response.data;
}

export const getCommentReportedUsers = async(commentId: string): Promise<GetCommentReportedUsers> => {
  const response = await axiosAdminInstance.get<GetCommentReportedUsers>(
    `${END_POINTS.GET_COMMENT_REPORTED_USERS}/${commentId}`
  );
  return response.data;
}

export const blockComment = async(commentId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.BLOCK_COMMENT}/${commentId}`
  )
  return response.data;
}

export const unblockComment = async(commentId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.UNBLOCK_COMMENT}/${commentId}`
  )
  return response.data;
}

export const getAllReportedReplies = async (): Promise<GetAllReportedRepliesResponse> => {
  const response = await axiosAdminInstance.get<GetAllReportedRepliesResponse>(
    END_POINTS.GET_ALL_REPORTED_REPLIES
  );
  return response.data;
}

export const getReplyReportedUsers = async(replyId: string, commentId: string): Promise<GetReplyReportedUsers> => {
  const response = await axiosAdminInstance.get<GetReplyReportedUsers>(
    `${END_POINTS.GET_REPLY_REPORTED_USERS}?replyId=${replyId}&commentId=${commentId}`
  );
  return response.data;
}

export const blockReply = async(replyId: string, commentId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.BLOCK_REPLY}?replyId=${replyId}&commentId=${commentId}`
  )
  return response.data;
}

export const unblockReply = async(replyId: string, commentId: string): Promise<{status: string, message: string}> => {
  const response = await axiosAdminInstance.post<{status: string, message: string}>(
    `${END_POINTS.UNBLOCK_REPLY}?replyId=${replyId}&commentId=${commentId}`
  )
  return response.data;
}

export const getMonthlyUserSignups = async (): Promise<GetMonthlyUsersResponse> => {
  const response = await axiosAdminInstance.get<GetMonthlyUsersResponse>(
    END_POINTS.GET_MONTHLY_USER_SIGNUPS
  );
  return response.data;
}

export const getMonthlyPosts = async (): Promise<GetMonthlyPostsResponse> => {
  const response = await axiosAdminInstance.get<GetMonthlyPostsResponse>(
    END_POINTS.GET_MONTHLY_POSTS
  );
  return response.data;
}

export const logoutAdmin = async (): Promise<{ status: string, message: string }> => {
  const response = await axiosAdminInstance.delete<{ status: string, message: string }>(
    END_POINTS.LOGOUT_ADMIN
  );
  return response.data;
}