import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
  PostInterface,
  GetPostsInterface,
  DeletePostResponse,
  CommentObjectInterface,
  CommentPostInterface,
  GetCommentsInterface,
  ReplyObjectInterface,
  ReplyPostInterface,
  GetRepliesInterface,
  LikePost,
  SavePost,
  ReportPost,
  PostEditInterface,
  EditCommentResponse,
  DeleteCommentResponse,
  GetSearchPostsInterface,
  LikeCommentResponse,
  GetUserPostsInterface,
  GetLikedUsersInterface,
} from "../../Types/post";

export const uploadPost = async (
  postData: FormData
): Promise<PostInterface> => {
  const response = await axiosUserInstance.post<PostInterface>(
    END_POINTS.CREATE_POST,
    postData,
    {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    }
  );
  return response.data;
};

export const getPosts = async (page: number): Promise<GetPostsInterface> => {
  const pageSize = 3;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosUserInstance.get<GetPostsInterface>(
    `${END_POINTS.GET_POSTS}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const deletePost = async (
  postId: string
): Promise<DeletePostResponse> => {
  const response = await axiosUserInstance.delete<DeletePostResponse>(
    `${END_POINTS.DELETE_POST}/${postId}`
  );
  return response.data;
};

export const getPostDetails = async (
  postId: string
): Promise<PostInterface> => {
  const response = await axiosUserInstance.get<PostInterface>(
    `${END_POINTS.GET_POST_DETAILS}/${postId}`
  );
  return response.data;
};

export const addComment = async (
  commentObj: CommentObjectInterface
): Promise<CommentPostInterface> => {
  const response = await axiosUserInstance.post<CommentPostInterface>(
    `${END_POINTS.ADD_COMMENT}?postId=${commentObj.postId}&comment=${commentObj.comment}`
  );
  return response.data;
};

export const addReply = async (
  replyObj: ReplyObjectInterface
): Promise<ReplyPostInterface> => {
  const response = await axiosUserInstance.post<ReplyPostInterface>(
    `${END_POINTS.ADD_REPLY}?commentId=${replyObj.commentId}&reply=${replyObj.reply}`
  );
  return response.data;
};

export const getComments = async (
  postId: string
): Promise<GetCommentsInterface> => {
  const response = await axiosUserInstance.get<GetCommentsInterface>(
    `${END_POINTS.GET_COMMENTS}/${postId}`
  );
  return response.data;
};

export const getReplies = async (
  commentId: string
): Promise<GetRepliesInterface> => {
  const response = await axiosUserInstance.get<GetRepliesInterface>(
    `${END_POINTS.GET_REPLIES}/${commentId}`
  );
  return response.data;
};

export const likePost = async (postId: string): Promise<LikePost> => {
  const response = await axiosUserInstance.post<LikePost>(
    `${END_POINTS.LIKE_POST}/${postId}`
  );
  return response.data;
};

export const savePost = async (postId: string): Promise<SavePost> => {
  const response = await axiosUserInstance.post<SavePost>(
    `${END_POINTS.SAVE_POST}/${postId}`
  );
  return response.data;
};

export const reportPost = async (
  label: string,
  postId: string
): Promise<ReportPost> => {
  const response = await axiosUserInstance.post<ReportPost>(
    `${END_POINTS.REPORT_POST}?label=${label}&postId=${postId}`
  );
  return response.data;
};

export const editPost = async (
  postId: string,
  postData: FormData
): Promise<PostEditInterface> => {
  const response = await axiosUserInstance.patch<PostEditInterface>(
    `${END_POINTS.EDIT_POST}/${postId}`,
    postData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateComment = async (
  commentId: string,
  comment: string
): Promise<EditCommentResponse> => {
  const response = await axiosUserInstance.put<EditCommentResponse>(
    `${END_POINTS.EDIT_COMMENT}/${commentId}`,
    { comment: comment }
  );
  return response.data;
};

export const deleteComment = async (
  commentId: string
): Promise<DeleteCommentResponse> => {
  const response = await axiosUserInstance.delete<DeleteCommentResponse>(
    `${END_POINTS.DELETE_COMMENT}/${commentId}`
  );
  return response.data;
};

export const deleteReply = async (
  replyId: string,
  commentId: string
): Promise<DeleteCommentResponse> => {
  const response = await axiosUserInstance.delete<DeleteCommentResponse>(
    `${END_POINTS.DELETE_REPLY}?replyId=${replyId}&commentId=${commentId}`
  );
  return response.data;
};

export const reportComment = async (
  commentId: string
): Promise<DeleteCommentResponse> => {
  const response = await axiosUserInstance.post<DeleteCommentResponse>(
    `${END_POINTS.REPORT_COMMENT}/${commentId}`
  );
  return response.data;
};

export const reportReply = async (
  replyId: string,
  commentId: string
): Promise<DeleteCommentResponse> => {
  const response = await axiosUserInstance.post<DeleteCommentResponse>(
    `${END_POINTS.REPORT_REPLY}?replyId=${replyId}&commentId=${commentId}`
  );
  return response.data;
};

export const searchPosts = async (
  searchQuery: string,
  page: number
): Promise<GetSearchPostsInterface> => {
  const pageSize = 3;
  const skip: number = (page - 1) * pageSize;
  const encodedSearchQuery = encodeURIComponent(searchQuery);
  const response = await axiosUserInstance.get<GetSearchPostsInterface>(
    `${END_POINTS.SEARCH_POSTS}?searchQuery=${encodedSearchQuery}&skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const likeComment = async (
  commentId: string,
  action: string
): Promise<LikeCommentResponse> => {
  const response = await axiosUserInstance.post<LikeCommentResponse>(
    `${END_POINTS.LIKE_COMMENT}`,
    { commentId, action }
  );
  return response.data;
};

export const likeReply = async (
  replyId: string,
  commentId: string,
  action: string
): Promise<LikeCommentResponse> => {
  const response = await axiosUserInstance.post<LikeCommentResponse>(
    `${END_POINTS.LIKE_REPLY}`,
    { replyId, commentId, action }
  );
  return response.data;
};

export const getUserPosts = async (
  page: number
): Promise<GetUserPostsInterface> => {
  const pageSize = 3;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosUserInstance.get<GetUserPostsInterface>(
    `${END_POINTS.GET_USER_POSTS}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const getOtherUserPosts = async (
  userId: string,
  page: number
): Promise<GetUserPostsInterface> => {
  const pageSize = 3;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosUserInstance.get<GetUserPostsInterface>(
    `${END_POINTS.GET_OTHER_USER_POSTS}/${userId}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const getUserLikedPosts = async (
  page: number
): Promise<GetUserPostsInterface> => {
  const pageSize = 3;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosUserInstance.get<GetUserPostsInterface>(
    `${END_POINTS.GET_USER_LIKED_POSTS}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const getUserSavedPosts = async (
  page: number
): Promise<GetUserPostsInterface> => {
  const pageSize = 3;
  const skip: number = (page - 1) * pageSize;
  const response = await axiosUserInstance.get<GetUserPostsInterface>(
    `${END_POINTS.GET_USER_SAVED_POSTS}?skip=${skip}&limit=${pageSize}`
  );
  return response.data;
};

export const getLikedUsers = async (
  postId: string
): Promise<GetLikedUsersInterface> => {
  const response = await axiosUserInstance.get<GetLikedUsersInterface>(
    `${END_POINTS.GET_LIKED_USERS}/${postId}`
  );
  return response.data;
};
