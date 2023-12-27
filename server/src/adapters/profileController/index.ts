import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

//importing types
import { CloudinaryService } from "../../frameworks/services/cloudinaryService";
import { CloudinaryServiceInterface } from "../../application/services/cloudinaryServiceInterface";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import { ProfileInterface } from "../../types/profileInterface";
import { RedisRepository } from "../../frameworks/database/redis/redisRepository";

//use-cases import
import {
  handleUploadCoverPhoto,
  handleUploadProfilePhoto,
  handleUserInfo,
  handleCoverPhotoDeletion,
  handleProfilePhotoDeletion,
  handleChangePassword,
  handleUpdateProfile,
  handleSearchUsers,
  handleAddUsername,
} from "../../application/use-cases/profile/userProfile";
import { RedisDbInterface } from "../../application/repositories/redisDbRepository";

const profileController = (
  cloudinaryServiceImpl: CloudinaryService,
  cloudinaryServiceInterface: CloudinaryServiceInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB,
  userDbRepositoryInterface: UserDbInterface,
  authServiceImpl: AuthService,
  authServiceInterface: AuthServiceInterface,
  redisRepositoryImpl: RedisRepository,
  redisRepositoryInterface: RedisDbInterface,
) => {
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const cloudinaryService = cloudinaryServiceInterface(cloudinaryServiceImpl());
  const authService = authServiceInterface(authServiceImpl());
  const redisRepository = redisRepositoryInterface(redisRepositoryImpl());

  const uploadCoverPhoto = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const {
      buffer,
      mimetype,
    }: {
      buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
      mimetype: string;
    } = req.file as any;
    const { cldRes, coverPhoto } = await handleUploadCoverPhoto(
      userId,
      buffer,
      mimetype,
      cloudinaryService,
      dbUserRepository,
      redisRepository
    );
    res.json({
      status: "success",
      message: "cover photo uploaded",
      coverPhoto,
      cldRes,
    });
  });

  const uploadProfilePhoto = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const {
      buffer,
      mimetype,
    }: {
      buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
      mimetype: string;
    } = req.file as any;
    const { cldRes, dp } = await handleUploadProfilePhoto(
      userId,
      buffer,
      mimetype,
      cloudinaryService,
      dbUserRepository,
      redisRepository
    );
    res.json({
      status: "success",
      message: "cover photo uploaded",
      dp,
      cldRes,
    });
  });

  const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const user = await handleUserInfo(userId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "user info fetched",
      user,
    });
  });

  const getOtherUserInfo = asyncHandler(async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const otherUser = await handleUserInfo(id, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "user info fetched",
      otherUser,
    });
  });

  const deleteCoverPhoto = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    await handleCoverPhotoDeletion(userId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "cover photo deleted",
    });
  });

  const deleteProfilePhoto = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    await handleProfilePhotoDeletion(userId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "Profile photo deleted",
    });
  });

  const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const {
      userId,
      oldPassword,
      newPassword,
    }: { userId: string; oldPassword: string; newPassword: string } = req.body;
    await handleChangePassword(
      userId,
      oldPassword,
      newPassword,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Password successfully changed",
    });
  });

  const editProfile = asyncHandler(async (req: Request, res: Response) => {
    const profileInfo: ProfileInterface = req.body;
    const user = await handleUpdateProfile(profileInfo, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "user info fetched",
      user,
    });
  });

  const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { searchQuery } = req.query as unknown as { searchQuery: string } ;
    const users = await handleSearchUsers(searchQuery, dbUserRepository);
    res.json({
      status: "success",
      message: "users fetched",
      users,
    });
  })

  const addUsername = asyncHandler(async (req: Request, res: Response) => {
    const { userId, username }: { userId: string; username: string } = req.body;
    const user = await handleAddUsername(userId, username, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "Username added successfully",
    });
  })

  return {
    uploadCoverPhoto,
    uploadProfilePhoto,
    getUserInfo,
    getOtherUserInfo,
    deleteCoverPhoto,
    deleteProfilePhoto,
    changePassword,
    editProfile,
    searchUsers,
    addUsername,
  };
};

export default profileController;
