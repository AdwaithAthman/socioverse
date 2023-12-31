import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { RedisDbInterface } from "../../repositories/redisDbRepository";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";

export const handleFollowUser = async (
  userId: string,
  friendId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    await dbUserRepository.followUser(userId, friendId);
    await redisRepository.deleteCache(`userInfo:${userId}`);
    await redisRepository.deleteCache(`userInfo:${friendId}`);
    await redisRepository.deleteCache(`following:${userId}`);
    await redisRepository.deleteCache(`followers:${friendId}`);
  } catch (err) {
    throw new AppError(
      "Error following user!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleUnfollowUser = async (
  userId: string,
  friendId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    await dbUserRepository.unfollowUser(userId, friendId);
    await redisRepository.deleteCache(`userInfo:${userId}`);
    await redisRepository.deleteCache(`userInfo:${friendId}`);
    await redisRepository.deleteCache(`following:${userId}`);
    await redisRepository.deleteCache(`followers:${friendId}`);
  } catch (err) {
    throw new AppError(
      "Error unfollowing user!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleRestOfUsers = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const users = await dbUserRepository.getRestOfUsers(userId, 5);
    return users;
  } catch (error) {
    throw new AppError(
      "Error fetching users!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleRestOfAllUsers = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const users = await dbUserRepository.getRestOfUsers(userId, 0);
    return users;
  } catch (error) {
    throw new AppError(
      "Error fetching users!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetFollowers = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    const followersList = await redisRepository.setCache(
      `followers:${userId}`,
      async () => {
        const followers = await dbUserRepository.getFollowers(userId);
        return followers;
      }
    );
    return followersList;
  } catch (error) {
    throw new AppError(
      "Error fetching followers!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetFollowing = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    const followingList = await redisRepository.setCache(
      `following:${userId}`,
      async () => {
        const following = await dbUserRepository.getFollowing(userId);
        return following;
      }
    );
    return followingList;
  } catch (error) {
    throw new AppError(
      "Error fetching followers!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetSuggestions = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const suggestions = await dbUserRepository.getSuggestions(userId);
    const uniqueSuggestions = Array.from(
      suggestions
        .reduce((map, obj) => map.set(obj._id.toString(), obj), new Map())
        .values()
    );
    return uniqueSuggestions;
  } catch (error) {
    throw new AppError(
      "Error fetching suggestions!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleAddNotification = async (
  userId: string,
  messageId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    await dbUserRepository.addNotification(userId, messageId);
  } catch (error) {
    throw new AppError(
      "Error adding notification!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleDeleteNotification = async (
  userId: string,
  messageId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    await dbUserRepository.deleteNotification(userId, messageId);
  } catch (error) {
    throw new AppError(
      "Error deleting notification!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
