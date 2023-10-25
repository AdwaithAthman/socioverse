import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";

import {
  handleAdminLogin,
  handleRefreshAdminAccessToken,
  handleGetUsers,
  handleBlockUser,
  handleUnblockUser,
} from "../../application/use-cases/admin/admin";

const adminController = (
  authServiceImpl: AuthService,
  authServiceInterface: AuthServiceInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB,
  userDbRepositoryInterface: UserDbInterface
) => {
  const authService = authServiceInterface(authServiceImpl());
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());

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

  return {
    adminLogin,
    refreshAdminAccessToken,
    getUsers,
    blockUser,
    unblockUser,
  };
};

export default adminController;
