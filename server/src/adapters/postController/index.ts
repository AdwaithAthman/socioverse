import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CloudinaryService } from "../../frameworks/services/cloudinaryService";
import { CloudinaryServiceInterface } from "../../application/services/cloudinaryServiceInterface";

//use-cases import
import {
  handleCreatePost,
  handleGetPosts,
  handleDeletePost,
  handleGetPostDetails,
  handleAddComment,
  handleGetComments,
  handleAddReply,
  handleGetReplies,
  handleLikePost,
  handleSavePost,
  handleReportPost,
  handleEditPost,
  handleEditComment,
  handleDeleteComment,
  handleDeleteReply,
  handleSearchPosts,
  handleLikeComment,
  handleLikeReply,
  handleGetUserPosts,
  handleGetUserLikedPosts,
  handleGetUserSavedPosts,
  handleGetOtherUserPosts
} from "../../application/use-cases/post/userPost";

//importing types
import { PostDbInterface } from "../../application/repositories/postDbRepository";
import { PostRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/postRepositoryMongoDB";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";
import { CommentDbInterface } from "../../application/repositories/commentDbRepository";
import { CommentRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/commentRepositoryMongoDB";

const postController = (
  cloudinaryServiceImpl: CloudinaryService,
  cloudinaryServiceInterface: CloudinaryServiceInterface,
  postDbRepositoryImpl: PostRepositoryMongoDB,
  postDbRepositoryInterface: PostDbInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB,
  userDbRepositoryInterface: UserDbInterface,
  commentDbRepositoryImpl: CommentRepositoryMongoDB,
  commentDbRepositoryInterface: CommentDbInterface
) => {
  const cloudinaryService = cloudinaryServiceInterface(cloudinaryServiceImpl());
  const postDbRepository = postDbRepositoryInterface(postDbRepositoryImpl());
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const commentDbRepository = commentDbRepositoryInterface(
    commentDbRepositoryImpl()
  );

  const createPost = asyncHandler(async (req: Request, res: Response) => {
    const postData = req.body;
    // let buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer> | null;
    // let mimetype: string | null;
    // if (req.file) {
    //   ({ buffer, mimetype } = req.file as any);
    // } else {
    //   buffer = null;
    //   mimetype = null;
    // }
    const files = req.files as Express.Multer.File[];
    console.log("files from req.files: ", files)
    console.log("postData from req.body: ", postData)
    const post = await handleCreatePost(
      postData,
      files,
      cloudinaryService,
      postDbRepository,
      dbUserRepository
    );

    // const post = await handleCreatePost(
    //   postData,
    //   buffer,
    //   mimetype,
    //   cloudinaryService,
    //   postDbRepository,
    //   dbUserRepository
    // );
    res.json({
      status: "success",
      message: "post created",
      post,
    });
  });

  const getPosts = asyncHandler(async (req: Request, res: Response) => {
    const { skip, limit } = req.query;
    const { userId }: { userId: string } = req.body;
    const posts = await handleGetPosts(
      userId,
      Number(skip),
      Number(limit),
      postDbRepository,
      dbUserRepository
    );
    res.json({
      status: "success",
      message: "posts fetched",
      posts,
    });
  });

  const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const { userId }: { userId: string } = req.body;
    await handleDeletePost(postId, userId, postDbRepository, dbUserRepository);
    res.json({
      status: "success",
      message: "post deleted",
    });
  });

  const getPostDetails = asyncHandler(async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const post = await handleGetPostDetails(postId, postDbRepository);
    res.json({
      status: "success",
      message: "post fetched",
      post,
    });
  });

  const addComment = asyncHandler(async (req: Request, res: Response) => {
    const postId = req.query.postId as string;
    const comment = req.query.comment as string;
    const { userId }: { userId: string } = req.body;
    const response = await handleAddComment(
      postId,
      userId,
      comment,
      postDbRepository,
      commentDbRepository
    );
    res.json({
      status: "success",
      message: "comment added",
      comment: response,
    });
  });

  const getComments = asyncHandler(async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const comments = await handleGetComments(postId, commentDbRepository);
    res.json({
      status: "success",
      message: "comments fetched",
      comments,
    });
  });

  const addReply = asyncHandler(async (req: Request, res: Response) => {
    const commentId = req.query.commentId as string;
    const reply = req.query.reply as string;
    const { userId }: { userId: string } = req.body;
    const response = await handleAddReply(
      commentId,
      reply,
      userId,
      commentDbRepository,
      dbUserRepository
    );
    res.json({
      status: "success",
      message: "reply added",
      reply: response,
    });
  });

  const getReplies = asyncHandler(async (req: Request, res: Response) => {
    const commentId: string = req.params.commentId;
    const replies = await handleGetReplies(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "replies fetched",
      replies,
    });
  });

  const likePost = asyncHandler(async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const { userId }: { userId: string } = req.body;
    const message = await handleLikePost(postId, userId, postDbRepository);
    res.json({
      status: "success",
      message,
    });
  });

  const savePost = asyncHandler(async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const { userId }: { userId: string } = req.body;
    const message = await handleSavePost(
      postId,
      userId,
      postDbRepository,
      dbUserRepository
    );
    res.json({
      status: "success",
      message,
    });
  });

  const reportPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId, label } = req.query as unknown as {
      postId: string;
      label: string;
    };
    const { userId }: { userId: string } = req.body;
    await handleReportPost(postId, userId, label, postDbRepository);
    res.json({
      status: "success",
      message: "post reported",
    });
  });

  const editPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as { postId: string };
    const postData = req.body;
    console.log("postData from req.body: ", postData);
    const editedPost = await handleEditPost(postId, postData, postDbRepository);
    res.json({
      status: "success",
      message: "post edited",
      editedPost,
    });
  });

  const editComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as { commentId: string };
    console.log("edited commment req.body: ", req.body);
    const { comment }: { comment: string } = req.body;
    const editedComment = await handleEditComment(
      commentId,
      comment,
      commentDbRepository
    );
    res.json({
      status: "success",
      message: "comment edited",
      editedComment,
    });
  });

  const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as { commentId: string };
    await handleDeleteComment(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "comment deleted",
    });
  });

  const deleteReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId } = req.query as unknown as {
      replyId: string;
      commentId: string;
    };
    await handleDeleteReply(replyId, commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reply deleted",
    });
  })

  const searchPosts = asyncHandler(async (req: Request, res: Response) => {
    const { searchQuery, skip, limit } = req.query as unknown as {
      searchQuery: string;
      skip: number;
      limit: number;
    };
    const { userId }: { userId: string } = req.body;
    const { count, regexResults } = await handleSearchPosts(
      searchQuery,
      userId,
      skip,
      limit,
      postDbRepository,
      dbUserRepository
    );
    res.json({
      status: "success",
      message: "posts fetched",
      posts: regexResults,
      count,
    });
  });

  const likeComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId, action, userId } = req.body as unknown as {
      commentId: string;
      action: string;
      userId: string;
    };
    console.log("req body for comment like: ", req.body);
    const message = await handleLikeComment(
      commentId,
      userId,
      action,
      commentDbRepository
    );
    res.json({
      status: "success",
      message,
    });
  });

  const likeReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId, action, userId } = req.body as unknown as {
      replyId: string;
      commentId: string;
      action: string;
      userId: string;
    };
    const message = await handleLikeReply(
      replyId,
      commentId,
      action,
      userId,
      commentDbRepository
    );
    res.json({
      status: "success",
      message,
    });
  });

  const getUserPosts = asyncHandler(async (req: Request, res: Response) => {
    const { skip, limit } = req.query as unknown as {
      skip: number;
      limit: number;
    };
    const { userId }: { userId: string } = req.body;
    const posts = await handleGetUserPosts(
      userId,
      skip,
      limit,
      postDbRepository,
    );
    res.json({
      status: "success",
      message: "user posts fetched",
      posts,
    });
  });

  const getOtherUserPosts = asyncHandler(async (req: Request, res: Response) => {
    const { skip, limit } = req.query as unknown as {
      skip: number,
      limit: number
    }
    const { userId } = req.params as unknown as { userId: string };
    const posts = await handleGetOtherUserPosts(
      userId,
      skip,
      limit,
      postDbRepository,
    );
    res.json({
      status: "success",
      message: "other user posts fetched",
      posts,
    })
  })

  const getUserLikedPosts = asyncHandler(async (req: Request, res: Response) => {
    const { skip, limit } = req.query as unknown as {
      skip: number;
      limit: number;
    };
    const { userId }: { userId: string } = req.body;
    const posts = await handleGetUserLikedPosts(
      userId, 
      skip,
      limit,
      postDbRepository,
    )
    res.json({
      status: "success",
      message: "user liked posts fetched",
      posts,
    })

  });

  const getUserSavedPosts = asyncHandler(async (req: Request, res: Response) => {
    const { skip, limit } = req.query as unknown as {
      skip: string;
      limit: string;
    }
    const { userId }: { userId: string } = req.body;
    const posts = await handleGetUserSavedPosts(
      userId, 
      skip,
      limit,
      dbUserRepository,
      postDbRepository,
    )
    res.json({
      status: "success",
      message: "user saved posts fetched",
      posts,
    })
  })

  return {
    createPost,
    getPosts,
    deletePost,
    getPostDetails,
    addComment,
    getComments,
    addReply,
    getReplies,
    likePost,
    savePost,
    reportPost,
    editPost,
    editComment,
    deleteComment,
    deleteReply,
    searchPosts,
    likeComment,
    likeReply,
    getUserPosts,
    getOtherUserPosts,
    getUserLikedPosts,
    getUserSavedPosts,
  };
};

export default postController;
