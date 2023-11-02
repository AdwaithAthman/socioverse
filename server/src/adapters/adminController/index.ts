import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";
import { PostDbInterface } from "../../application/repositories/postDbRepository";
import { PostRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/postRepositoryMongoDB";

import {
  handleAdminLogin,
  handleRefreshAdminAccessToken,
  handleGetUsers,
  handleBlockUser,
  handleUnblockUser,
  handleGetAllPosts,
  handleGetReportInfo,
  handleBlockPost,
  handleUnblockPost,
  handleGetAllReportedComments,
  handleGetCommentReportedUsers,
  handleGetReplyReportedUsers,
  handleBlockComment,
  handleUnblockComment,
  handleGetAllReportedReplies,
  handleBlockReply,
  handleUnblockReply,
  handleGetMonthlyUserSignups,
  handleGetMonthlyPosts,
} from "../../application/use-cases/admin/admin";
import { CommentRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/commentRepositoryMongoDB";
import { CommentDbInterface } from "../../application/repositories/commentDbRepository";

const adminController = (
  authServiceImpl: AuthService,
  authServiceInterface: AuthServiceInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB,
  userDbRepositoryInterface: UserDbInterface,
  postDbRepositoryImpl: PostRepositoryMongoDB,
  postDbRepositoryInterface: PostDbInterface,
  commentDbRepositoryImpl: CommentRepositoryMongoDB,
  commentDbRepositoryInterface: CommentDbInterface
) => {
  const authService = authServiceInterface(authServiceImpl());
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const postDbRepository = postDbRepositoryInterface(postDbRepositoryImpl());
  const commentDbRepository = commentDbRepositoryInterface(
    commentDbRepositoryImpl()
  );

  const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const { accessToken, refreshToken } = await handleAdminLogin(
      email,
      password,
      authService
    );
    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // use in HTTPS only
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      status: "success",
      message: "admin logged in",
      accessToken,
    });
  });

  const refreshAdminAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
      const cookies = req.cookies;
      const accessToken = await handleRefreshAdminAccessToken(
        cookies,
        authService
      );
      res.json({ accessToken });
    }
  );

  const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await handleGetUsers(dbUserRepository);
    res.json({
      status: "success",
      message: "users fetched",
      users,
    });
  });

  const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as unknown as {userId : string}
    const users = await handleBlockUser(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "blocked the user",
    });
  });

  const unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as unknown as {userId : string}
    const users = await handleUnblockUser(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "unblocked the user",
    });
  });

  const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts = await handleGetAllPosts(postDbRepository);
    res.json({
      status: "success",
      message: "posts fetched",
      posts
    });
  });

  const getReportInfo = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as {postId : string}
    const reportInfo = await handleGetReportInfo(postId, postDbRepository);
    res.json({
      status: "success",
      message: "report info fetched",
      reportInfo
    })
  });

  const blockPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as {postId : string}
    await handleBlockPost(postId, postDbRepository);
    res.json({
      status: "success",
      message: "blocked the user",
    });
  });

  const unblockPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as {postId : string}
    await handleUnblockPost(postId, postDbRepository);
    res.json({
      status: "success",
      message: "unblocked the user",
    });
  });

  const getAllReportedComments = asyncHandler(async (req: Request, res: Response) => {
    const reportedComments = await handleGetAllReportedComments(commentDbRepository);
    res.json({
      status: "success",
      message: "reported comments fetched",
      reportedComments
    })
  })

  const getCommentReportedUsers = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as {commentId : string}
    const reportedUsers = await handleGetCommentReportedUsers(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reported users fetched",
      reportedUsers
    })
  })

  const getReplyReportedUsers = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId } = req.query as unknown as {replyId : string, commentId: string}
    const reportedUsers = await handleGetReplyReportedUsers(replyId, commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reported users fetched",
      reportedUsers
    })
  })

  const blockComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as {commentId : string}
    await handleBlockComment(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "comment blocked"
    })
  })

  const unblockComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as {commentId : string}
    await handleUnblockComment(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "comment unblocked"
    })
  })

  const getAllReportedReplies = asyncHandler(async (req: Request, res: Response) => {
    const reportedReplies = await handleGetAllReportedReplies(commentDbRepository);
    res.json({
      status: "success",
      message: "reported replies fetched",
      reportedReplies
    })
  })

  const blockReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId } = req.query as unknown as {replyId : string, commentId: string}
    await handleBlockReply(replyId, commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reply blocked"
    })
  })

  const unblockReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId } = req.query as unknown as {replyId : string, commentId: string}
    await handleUnblockReply(replyId, commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reply unblocked"
    })
  })

  const getMonthlyUserSignups = asyncHandler(async (req: Request, res: Response) => {
    const monthlyUserSignups = await handleGetMonthlyUserSignups(dbUserRepository);
    res.json({
      status: "success",
      message: "monthly user signups fetched",
      monthlyUserSignups
    })
  })

  const getMonthlyPosts = asyncHandler(async (req: Request, res: Response) => {
    const monthlyPosts = await handleGetMonthlyPosts(postDbRepository);
    res.json({
      status: "success",
      message: "monthly posts fetched",
      monthlyPosts,
    });
  })

  const logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("adminRefreshToken");
    res.json({
      status: "success",
      message: "admin logged out",
    });
  })

  return {
    adminLogin,
    refreshAdminAccessToken,
    getUsers,
    blockUser,
    unblockUser,
    getAllPosts,
    getReportInfo,
    blockPost,
    unblockPost,
    getAllReportedComments,
    getCommentReportedUsers,
    getReplyReportedUsers,
    blockComment,
    unblockComment,
    getAllReportedReplies,
    blockReply,
    unblockReply,
    getMonthlyUserSignups,
    getMonthlyPosts,
    logoutAdmin,
  };
};

export default adminController;
