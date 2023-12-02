import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";

export const handleFollowUser = async (
  userId: string,
  friendId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    await dbUserRepository.followUser(userId, friendId);
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
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    await dbUserRepository.unfollowUser(userId, friendId);
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
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const followers = await dbUserRepository.getFollowers(userId);
    return followers;
  } catch (error) {
    throw new AppError(
      "Error fetching followers!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetFollowing = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const following = await dbUserRepository.getFollowing(userId);
    return following;
  } catch (error) {
    throw new AppError(
      "Error fetching followers!",
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

