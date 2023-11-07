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
  GetCountResponse,
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

export const getAllUsers = async (page: number): Promise<GetUsersResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetUsersResponse>(
    `${END_POINTS.GET_USERS}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const getAllUsersCount = async (): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    END_POINTS.GET_ALL_USERS_COUNT
  );
  return response.data;
}

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

export const getAllPosts = async (page: number): Promise<GetAllPostsResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetAllPostsResponse>(
    `${END_POINTS.GET_ALL_POSTS}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const getAllPostsCount = async (): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    END_POINTS.GET_ALL_POSTS_COUNT
  );
  return response.data;

}

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

export const getAllReportedCommentsCount = async (): Promise<GetCountResponse> => {
  const response = await  axiosAdminInstance.get<GetCountResponse>(
    END_POINTS.GET_ALL_REPORTED_COMMENTS_COUNT
  );
  return response.data;

}

export const getAllReplies = async (): Promise<GetAllRepliesResponse> => {
  const response = await axiosAdminInstance.get<GetAllRepliesResponse>(
    END_POINTS.GET_ALL_REPLIES
  );
  return response.data;
};

export const getAllReportedRepliesCount = async (): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    END_POINTS.GET_ALL_REPORTED_REPLIES_COUNT
  );
  return response.data;

}

export const getAllReportedComments = async (page: number): Promise<GetAllReportedCommentsResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetAllReportedCommentsResponse>(
    `${END_POINTS.GET_ALL_REPORTED_COMMENTS}?skip=${skip}&limit=${pageSize}`
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

export const getAllReportedReplies = async (page: number): Promise<GetAllReportedRepliesResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetAllReportedRepliesResponse>(
    `${END_POINTS.GET_ALL_REPORTED_REPLIES}?skip=${skip}&limit=${pageSize}`
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

export const getUsersCountOnSearch = async (search: string): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    `${END_POINTS.GET_USERS_COUNT_ON_SEARCH}?search=${search}`
  );
  return response.data;
}

export const getPostsCountOnSearch = async (search: string): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    `${END_POINTS.GET_POSTS_COUNT_ON_SEARCH}?search=${search}`
  );
  return response.data;
}

export const getReportedCommentsCountOnSearch = async (search: string): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    `${END_POINTS.GET_REPORTED_COMMENTS_COUNT_ON_SEARCH}?search=${search}`
  );
  return response.data;
}

export const getUsersOnSearch = async (search: string, page: number): Promise<GetUsersResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetUsersResponse>(
    `${END_POINTS.GET_USERS_ON_SEARCH}?search=${search}&skip=${skip}&limit=${pageSize}`
  );
  return response.data;
}

export const getPostsOnSearch = async (search: string, page: number): Promise<GetAllPostsResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetAllPostsResponse>(
    `${END_POINTS.GET_POSTS_ON_SEARCH}?search=${search}&skip=${skip}&limit=${pageSize}`
  );
  return response.data;
}

export const getReportedCommentsOnSearch = async (search: string, page: number): Promise<GetAllReportedCommentsResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetAllReportedCommentsResponse>(
    `${END_POINTS.GET_REPORTED_COMMENTS_ON_SEARCH}?search=${search}&skip=${skip}&limit=${pageSize}`
  );
  return response.data;
}

export const getReportedRepliesCountOnSearch = async (search: string): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    `${END_POINTS.GET_REPORTED_REPLIES_COUNT_ON_SEARCH}?search=${search}`
  );
  return response.data;
}

export const getReportedRepliesOnSearch = async (search: string, page: number): Promise<GetAllReportedRepliesResponse> => {
  const pageSize = 10;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosAdminInstance.get<GetAllReportedRepliesResponse>(
    `${END_POINTS.GET_REPORTED_REPLIES_ON_SEARCH}?search=${search}&skip=${skip}&limit=${pageSize}`
  );
  return response.data;
}

export const getBlockedUsersCount = async (): Promise<GetCountResponse> => {
  const response = await axiosAdminInstance.get<GetCountResponse>(
    END_POINTS.GET_BLOCKED_USERS_COUNT
  );
  return response.data;
}