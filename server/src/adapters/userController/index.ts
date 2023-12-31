import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

//importing types
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";
import { RedisRepository } from "../../frameworks/database/redis/redisRepository";
import { RedisDbInterface } from "../../application/repositories/redisDbRepository";

//use-cases import
import {
  handleRestOfUsers,
  handleRestOfAllUsers,
  handleFollowUser,
  handleUnfollowUser,
  handleGetFollowers,
  handleGetFollowing,
  handleGetSuggestions,
  handleAddNotification,
  handleDeleteNotification,
} from "../../application/use-cases/user/user";

const userController = (
  userDbRepositoryImpl: UserRepositoryMongoDB,
  userDbRepositoryInterface: UserDbInterface,
  redisRepositoryImpl: RedisRepository,
  redisRepositoryInterface: RedisDbInterface,
) => {
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const redisRepository = redisRepositoryInterface(redisRepositoryImpl());
  
  const followUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendId }: { userId: string; friendId: string } = req.body;
    await handleFollowUser(userId, friendId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "successfully followed user",
    });
  });

  const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendId }: { userId: string; friendId: string } = req.body;
    await handleUnfollowUser(userId, friendId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "successfully unfollowed user",
    });
  });

  const getRestOfUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const users = await handleRestOfUsers(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "rest of users fetched",
      users,
    });
  });

  const getRestOfAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId }: { userId: string } = req.body;
      const users = await handleRestOfAllUsers(userId, dbUserRepository);
      res.json({
        status: "success",
        message: "rest of users fetched",
        users,
      });
    }
  );

  const getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.params as unknown as { userId: string };
    const followers = await handleGetFollowers(userId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "followers fetched",
      followers,
    });
  });

  const getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.params as unknown as { userId: string };
    const following = await handleGetFollowing(userId, dbUserRepository, redisRepository);
    res.json({
      status: "success",
      message: "followers fetched",
      following,
    });
  });

  const  getSuggestions = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const suggestions = await handleGetSuggestions(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "suggestions fetched",
      suggestions,
    });
  });

  const addNotification = asyncHandler(async (req: Request, res: Response) => {
    const { userId, messageId }: { userId: string; messageId: string } =
      req.body;
    await handleAddNotification(userId, messageId, dbUserRepository);
    res.json({
      status: "success",
    });
  });

  const deleteNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId }: { userId: string } = req.body;
      const { messageId } = req.params as unknown as { messageId: string };
      await handleDeleteNotification(userId, messageId, dbUserRepository);
      res.json({
        status: "success",
      });
    }
  );

  return {
    followUser,
    unfollowUser,
    getRestOfUsers,
    getRestOfAllUsers,
    getFollowers,
    getFollowing,
    getSuggestions,
    addNotification,
    deleteNotification,
  };
};

export default userController;
