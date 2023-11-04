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
  handleGetAllUsersCount,
  handleBlockUser,
  handleUnblockUser,
  handleGetAllPosts,
  handleGetAllPostsCount,
  handleGetAllReportedCommentsCount,
  handleGetAllReportedRepliesCount,
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
  handleGetUsersCountOnSearch,
  handleGetUsersOnSearch,
  handleGetPostsCountOnSearch,
  handleGetPostsOnSearch,
  handleGetReportedCommentsCountOnSearch,
  handleGetReportedCommentsOnSearch,
  handleGetReportedRepliesCountOnSearch,
  handleGetReportedRepliesOnSearch,
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

  const getAllUsersCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await handleGetAllUsersCount(dbUserRepository);
    res.json({
      status: "success",
      message: "users count fetched",
      count,
    });
  })

  const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as unknown as { userId: string };
    const users = await handleBlockUser(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "blocked the user",
    });
  });

  const unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as unknown as { userId: string };
    const users = await handleUnblockUser(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "unblocked the user",
    });
  });

  const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const { skip, limit } = req.query as unknown as {
      skip: number;
      limit: number;
    };
    const posts = await handleGetAllPosts(postDbRepository, skip, limit);
    res.json({
      status: "success",
      message: "posts fetched",
      posts,
    });
  });

  const getAllPostsCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await handleGetAllPostsCount(postDbRepository);
    res.json({
      status: "success",
      message: "posts count fetched",
      count,
    });
  });

  const getAllReportedCommentsCount = asyncHandler(
    async (req: Request, res: Response) => {
      const count = await handleGetAllReportedCommentsCount(
        commentDbRepository
      );
      res.json({
        status: "success",
        message: "reported comments count fetched",
        count,
      });
    }
  );

  const getAllReportedRepliesCount = asyncHandler(
    async (req: Request, res: Response) => {
      const count = await handleGetAllReportedRepliesCount(commentDbRepository);
      res.json({
        status: "success",
        message: "reported replies count fetched",
        count,
      });
    }
  );

  const getReportInfo = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as { postId: string };
    const reportInfo = await handleGetReportInfo(postId, postDbRepository);
    res.json({
      status: "success",
      message: "report info fetched",
      reportInfo,
    });
  });

  const blockPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as { postId: string };
    await handleBlockPost(postId, postDbRepository);
    res.json({
      status: "success",
      message: "blocked the user",
    });
  });

  const unblockPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as { postId: string };
    await handleUnblockPost(postId, postDbRepository);
    res.json({
      status: "success",
      message: "unblocked the user",
    });
  });

  const getAllReportedComments = asyncHandler(
    async (req: Request, res: Response) => {
      const { skip, limit } = req.query as unknown as {
        skip: number;
        limit: number;
      };
      const reportedComments = await handleGetAllReportedComments(
        commentDbRepository,
        skip,
        limit
      );
      res.json({
        status: "success",
        message: "reported comments fetched",
        reportedComments,
      });
    }
  );

  const getCommentReportedUsers = asyncHandler(
    async (req: Request, res: Response) => {
      const { commentId } = req.params as unknown as { commentId: string };
      const reportedUsers = await handleGetCommentReportedUsers(
        commentId,
        commentDbRepository
      );
      res.json({
        status: "success",
        message: "reported users fetched",
        reportedUsers,
      });
    }
  );

  const getReplyReportedUsers = asyncHandler(
    async (req: Request, res: Response) => {
      const { replyId, commentId } = req.query as unknown as {
        replyId: string;
        commentId: string;
      };
      const reportedUsers = await handleGetReplyReportedUsers(
        replyId,
        commentId,
        commentDbRepository
      );
      res.json({
        status: "success",
        message: "reported users fetched",
        reportedUsers,
      });
    }
  );

  const blockComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as { commentId: string };
    await handleBlockComment(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "comment blocked",
    });
  });

  const unblockComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params as unknown as { commentId: string };
    await handleUnblockComment(commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "comment unblocked",
    });
  });

  const getAllReportedReplies = asyncHandler(
    async (req: Request, res: Response) => {
      const { skip, limit } = req.query as unknown as {
        skip: number;
        limit: number;
      };
      const reportedReplies = await handleGetAllReportedReplies(
        commentDbRepository,
        skip,
        limit
      );
      res.json({
        status: "success",
        message: "reported replies fetched",
        reportedReplies,
      });
    }
  );

  const blockReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId } = req.query as unknown as {
      replyId: string;
      commentId: string;
    };
    await handleBlockReply(replyId, commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reply blocked",
    });
  });

  const unblockReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId, commentId } = req.query as unknown as {
      replyId: string;
      commentId: string;
    };
    await handleUnblockReply(replyId, commentId, commentDbRepository);
    res.json({
      status: "success",
      message: "reply unblocked",
    });
  });

  const getMonthlyUserSignups = asyncHandler(
    async (req: Request, res: Response) => {
      const monthlyUserSignups = await handleGetMonthlyUserSignups(
        dbUserRepository
      );
      res.json({
        status: "success",
        message: "monthly user signups fetched",
        monthlyUserSignups,
      });
    }
  );

  const getMonthlyPosts = asyncHandler(async (req: Request, res: Response) => {
    const monthlyPosts = await handleGetMonthlyPosts(postDbRepository);
    res.json({
      status: "success",
      message: "monthly posts fetched",
      monthlyPosts,
    });
  });

  const logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("adminRefreshToken");
    res.json({
      status: "success",
      message: "admin logged out",
    });
  });

  const getUsersCountOnSearch = asyncHandler(
    async (req: Request, res: Response) => {
      const { search } = req.query as unknown as { search: string };
      const count = await handleGetUsersCountOnSearch(search, dbUserRepository);
      res.json({
        status: "success",
        message: "users count fetched",
        count,
      });
    }
  );

  const getUsersOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search, skip, limit } = req.query as unknown as {
      search: string;
      skip: number;
      limit: number;
    };
    const users = await handleGetUsersOnSearch(
      search,
      skip,
      limit,
      dbUserRepository
    );
    res.json({
      status: "success",
      message: "users fetched",
      users,
    });
  });

  const getPostsCountOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query as unknown as { search: string };
    const count = await handleGetPostsCountOnSearch(search, postDbRepository);
    res.json({
      status: "success",
      message: "posts count fetched",
      count,
    });
  })

  const getPostsOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search, skip, limit } = req.query as unknown as { search: string, skip: number, limit: number };
    const posts = await handleGetPostsOnSearch(search, skip, limit, postDbRepository);
    res.json({
      status: "success",
      message: "posts fetched",
      posts,
    })
  })

  const getReportedCommentsCountOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query as unknown as { search: string };
    const count = await handleGetReportedCommentsCountOnSearch(search, commentDbRepository);
    res.json({
      status: "success",
      message: "reported comments count fetched",
      count,
    })
  })

  const getReportedCommentsOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search, skip, limit } = req.query as unknown as { search: string, skip: number, limit: number };
    const reportedComments = await handleGetReportedCommentsOnSearch(search, skip, limit, commentDbRepository);
    res.json({
      status: "success",
      message: "reported comments fetched",
      reportedComments,
    })
  })

  const getReportedRepliesCountOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query as unknown as { search: string };
    const count = await handleGetReportedRepliesCountOnSearch(search, commentDbRepository);
    res.json({
      status: "success",
      message: "reported replies count fetched",
      count,
    })
  })

  const getReportedRepliesOnSearch = asyncHandler(async (req: Request, res: Response) => {
    const { search, skip, limit } = req.query as unknown as { search: string, skip: number, limit: number };
    const reportedReplies = await handleGetReportedRepliesOnSearch(search, skip, limit, commentDbRepository);
    res.json({
      status: "success",
      message: "reported replies fetched",
      reportedReplies,
    })
  })

  return {
    adminLogin,
    refreshAdminAccessToken,
    getUsers,
    getAllUsersCount,
    blockUser,
    unblockUser,
    getAllPosts,
    getAllPostsCount,
    getAllReportedCommentsCount,
    getAllReportedRepliesCount,
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
    getUsersCountOnSearch,
    getUsersOnSearch,
    getPostsCountOnSearch,
    getPostsOnSearch,
    getReportedCommentsCountOnSearch,
    getReportedCommentsOnSearch,
    getReportedRepliesCountOnSearch,
    getReportedRepliesOnSearch,
  };
};

export default adminController;
