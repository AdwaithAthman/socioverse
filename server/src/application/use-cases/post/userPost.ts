import AppError from "../../../utils/appError";
import { CloudinaryServiceInterface } from "../../services/cloudinaryServiceInterface";
import { PostDbInterface, postDbRepository } from "../../repositories/postDbRepository";
import { UserDbInterface } from "../../repositories/userDbRepository";
import {
  CommentDbInterface,
  commentDbRepository,
} from "../../repositories/commentDbRepository";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";
import { PostDataInterface } from "../../../types/postInterface";

export const handleCreatePost = async (
  postData: PostDataInterface,
  // buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer> | null,
  // mimetype: string | null,
  files: Express.Multer.File[],
  cloudinaryService: ReturnType<CloudinaryServiceInterface>,
  postDbRepository: ReturnType<PostDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    if (postData.hashtags && typeof postData.hashtags === "string") {
      const hashtagRegex = /#(\w+)/g;
      const hashtagsArray = [];
      let match;
      while ((match = hashtagRegex.exec(postData.hashtags))) {
        hashtagsArray.push(match[0]);
      }
      console.log("hashtags: ", hashtagsArray);
      postData = { ...postData, hashtagsArray };
    } else {
      postData.hashtags = "";
    }
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        return new Promise((resolve, reject) => {
          cloudinaryService
            .handleUpload(dataURI)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        });
      });
      const cldRes = await Promise.all(uploadPromises);
      const images: string[] = cldRes.map((res: any) => res.secure_url);
      console.log("images: ", images);
      postData = { ...postData, image: images };
    }
    const createdPost = await postDbRepository.createPost(postData);
    if (createdPost) {
      const post = await postDbRepository.getPostById(createdPost._id);
      await dbUserRepository.updatePosts(
        postData.userId as string,
        createdPost._id
      );
      return post;
    }
  } catch (err) {
    console.log("Error creating post: ", err);
    throw new AppError(
      "Error creating post!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetPosts = async (
  userId: string,
  skip: number,
  limit: number,
  postDbRepository: ReturnType<PostDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const user = await dbUserRepository.getUserById(userId);
    const posts = await postDbRepository.getPosts(
      userId,
      user?.following as string[],
      skip,
      limit
    );
    return posts;
  } catch (err) {
    console.log("Error getting posts: ", err);
    throw new AppError(
      "Error getting posts!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleDeletePost = async (
  postId: string,
  userId: string,
  postDbRepository: ReturnType<PostDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    await postDbRepository.deletePostById(postId);
    await dbUserRepository.deletePost(userId, postId);
  } catch (err) {
    console.log("Error deleting post: ", err);
    throw new AppError(
      "Error deleting post!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetPostDetails = async (
  postId: string,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    const post = await postDbRepository.getPostById(postId);
    return post;
  } catch (err) {
    console.log("Error getting post details: ", err);
    throw new AppError(
      "Error getting post details!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleAddComment = async (
  postId: string,
  userId: string,
  comment: string,
  postDbRepository: ReturnType<PostDbInterface>,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    const commentObj = {
      postId,
      userId,
      comment,
    };
    const commentResponse = await commentDbRepository.addComment(commentObj);
    if (!commentResponse) {
      throw new AppError(
        "Error adding comment!",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    await postDbRepository.addComment(postId, commentResponse._id);
    return commentResponse;
  } catch (err) {
    console.log("Error adding comment: ", err);
    throw new AppError(
      "Error adding comment!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetComments = async (
  postId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    const comments = await commentDbRepository.getComments(postId);
    return comments;
  } catch (err) {
    console.log("Error getting comments: ", err);
    throw new AppError(
      "Error getting comments!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleAddReply = async (
  commentId: string,
  reply: string,
  userId: string,
  commentDbRepository: ReturnType<CommentDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const replyObj = {
      userId,
      reply,
    };
    let response = await commentDbRepository.addReply(replyObj, commentId);
    const user = await dbUserRepository.getUserById(userId);
    if (response && user) {
      const userResponse = {
        _id: user._id,
        name: user.name,
        username: user.username,
        dp: user.dp,
      };
      response = { ...response.toObject(), user: userResponse };
      console.log("response of add new reply: ", response);
      return response;
    }
  } catch (err) {
    console.log("Error adding reply: ", err);
    throw new AppError("Error adding reply!", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleGetReplies = async (
  commentId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    const replies = await commentDbRepository.getReplies(commentId);
    return replies;
  } catch (err) {
    console.log("Error getting replies: ", err);
    throw new AppError(
      "Error getting replies!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleLikePost = async (
  postId: string,
  userId: string,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    const post = await postDbRepository.getPostById(postId);
    if (post?.likes && post.likes.includes(userId)) {
      await postDbRepository.unlikePost(postId, userId);
      return "Unliked the post";
    } else {
      await postDbRepository.likePost(postId, userId);
      return "Liked the post";
    }
  } catch (err) {
    console.log("Error liking post: ", err);
    throw new AppError("Error liking post!", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleSavePost = async (
  postId: string,
  userId: string,
  postDbRepository: ReturnType<PostDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const post = await postDbRepository.getPostById(postId);
    if (post?.saved && post.saved.includes(userId)) {
      await postDbRepository.unsavePost(postId, userId);
      await dbUserRepository.unsavePost(userId, postId);
      return "Unsaved the post";
    } else {
      await postDbRepository.savePost(postId, userId);
      await dbUserRepository.savePost(userId, postId);
      return "Saved the post";
    }
  } catch (err) {
    console.log("Error saving post: ", err);
    throw new AppError("Error saving post!", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleReportPost = async (
  postId: string,
  userId: string,
  label: string,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    await postDbRepository.reportPost(postId, { userId, label });
  } catch (err) {
    console.log("Error reporting post: ", err);
    throw new AppError(
      "Error reporting post!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleEditPost = async (
  postId: string,
  postData: PostDataInterface,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    if (postData.hashtags && typeof postData.hashtags === "string") {
      const hashtagRegex = /#(\w+)/g;
      const hashtagsArray = [];
      let match;
      while ((match = hashtagRegex.exec(postData.hashtags))) {
        hashtagsArray.push(match[0]);
      }
      postData = { ...postData, hashtagsArray };
    } else {
      postData.hashtags = "";
    }
    await postDbRepository.editPost(postId, postData);
    const editedPost = await postDbRepository.getPostById(postId);
    return editedPost;
  } catch (err) {
    console.log("Error editing post: ", err);
    throw new AppError("Error editing post!", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleEditComment = async (
  commentId: string,
  comment: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    const response = await commentDbRepository.editComment(commentId, comment);
    if (response?.modifiedCount === 1) {
      const editedComment = await commentDbRepository.getCommentById(commentId);
      return editedComment;
    } else {
      throw new AppError(
        "Error editing comment!",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  } catch (err) {
    console.log("Error editing comment: ", err);
    throw new AppError(
      "Error editing comment!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleDeleteComment = async (
  commentId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    await commentDbRepository.deleteComment(commentId);
  } catch (err) {
    console.log("Error deleting comment: ", err);
    throw new AppError(
      "Error deleting comment!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleDeleteReply = async (
  replyId: string,
  commentId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    await commentDbRepository.deleteReply(replyId, commentId);
  } catch (err) {
    console.log("Error deleting reply: ", err);
    throw new AppError(
      "Error deleting reply!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export const handleReportComment = async (
  commentId: string,
  userId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    await commentDbRepository.reportComment(commentId, userId);
  } catch (err) {
    console.log("Error reporting comment: ", err);
    throw new AppError(
      "Error reporting comment!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export const handleReportReply = async (
  replyId: string,
  commentId: string,
  userId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    await commentDbRepository.reportReply(replyId, commentId, userId);
  } catch (err) {
    console.log("Error reporting reply: ", err);
    throw new AppError(
      "Error reporting reply!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export const handleSearchPosts = async (
  searchQuery: string,
  userId: string,
  skip: number,
  limit: number,
  postDbRepository: ReturnType<PostDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const user = await dbUserRepository.getUserById(userId);
    const followingIds = user?.following as string[];
    followingIds.push(userId);
    const following = followingIds.map((id) => id.toString());
    // const textResults = await postDbRepository.searchPostsByTextSearch(searchQuery, user?.following as string[], skip, limit);
    // if(!textResults.length){
    const count = await postDbRepository.countOfsearchPostsByRegexSearch(
      searchQuery,
      following
    );
    const regexResults = await postDbRepository.searchPostsByRegexSearch(
      searchQuery,
      following,
      Number(skip),
      Number(limit)
    );
    return { count, regexResults };
    // }
    // else{
    //   return textResults;
    // }
  } catch (err) {
    console.log("Error searching posts: ", err);
    throw new AppError(
      "Error searching posts!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleLikeComment = async (
  commentId: string,
  userId: string,
  action: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    console.log("action is : ", action);
    if (action === "like") {
      await commentDbRepository.likeComment(commentId, userId);
      return "Liked the comment";
    } else {
      await commentDbRepository.unlikeComment(commentId, userId);
      return "Unliked the comment";
    }
  } catch (err) {
    console.log("Error doing like action on comment: ", err);
    throw new AppError("Error liking post", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleLikeReply = async (
  replyId: string,
  commentId: string,
  action: string,
  userId: string,
  commentDbRepository: ReturnType<CommentDbInterface>
) => {
  try {
    if (action === "like") {
      await commentDbRepository.likeReply(replyId, commentId, userId);
      return "Liked the reply";
    } else {
      await commentDbRepository.unlikeReply(replyId, commentId, userId);
      return "Unliked the reply";
    }
  } catch (err) {
    console.log("Error doing like action on reply: ", err);
    throw new AppError("Error liking post", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleGetUserPosts = async (
  userId: string,
  skip: number,
  limit: number,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    const posts = await postDbRepository.getPostsByUserId(
      userId,
      Number(skip),
      Number(limit)
    );
    return posts;
  } catch (err) {
    console.log("Error getting user posts: ", err);
    throw new AppError(
      "Error getting user posts!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
export const handleGetOtherUserPosts = async (
  userId: string,
  skip: number,
  limit: number,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    const posts = await postDbRepository.getPostsByUserId(
      userId,
      Number(skip),
      Number(limit)
    );
    return posts;
  } catch (err) {
    console.log("Error getting user posts: ", err);
    throw new AppError(
      "Error getting user posts!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetUserLikedPosts = async (
  userId: string,
  skip: number,
  limit: number,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    const posts = await postDbRepository.getUserLikedPosts(
      userId,
      Number(skip),
      Number(limit)
    );
    return posts;
  } catch (err) {
    console.log("Error getting user liked posts: ", err);
    throw new AppError(
      "Error getting user liked posts!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetUserSavedPosts = async (
  userId: string,
  skip: string,
  limit: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  postDbRepository: ReturnType<PostDbInterface>
) => {
  try {
    const user = await dbUserRepository.getUserById(userId);
    if(user?.savedPosts.length === 0){
      return [];
    }
    else{
      const posts =  await postDbRepository.getSavedPosts(
        user?.savedPosts as string[],
        Number(skip),
        Number(limit)
      );
      return posts;
    }
  } catch (err) {
    console.log("Error getting user liked posts: ", err);
    throw new AppError(
      "Error getting user liked posts!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
 
