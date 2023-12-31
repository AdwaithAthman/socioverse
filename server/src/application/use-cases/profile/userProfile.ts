import AppError from "../../../utils/appError";
import { CloudinaryServiceInterface } from "../../services/cloudinaryServiceInterface";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import { RedisDbInterface } from "../../repositories/redisDbRepository";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";
import { ProfileInterface } from "../../../types/profileInterface";
import { redisRepository } from "../../../frameworks/database/redis/redisRepository";

export const handleUploadCoverPhoto = async (
  userId: string,
  buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
  mimetype: string,
  cloudinaryService: ReturnType<CloudinaryServiceInterface>,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    const b64 = Buffer.from(buffer).toString("base64");
    let dataURI = "data:" + mimetype + ";base64," + b64;
    const cldRes = await cloudinaryService.handleUpload(dataURI);
    const user = await dbUserRepository.updateCoverPhoto(
      userId,
      cldRes.secure_url
    );
    const coverPhoto = user?.coverPhoto;
    await redisRepository.deleteCache(`userInfo:${userId}`);
    return { cldRes, coverPhoto };
  } catch (err) {
    console.log("err= ", err);
    throw new AppError(
      "Error uploading cover photo!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleUploadProfilePhoto = async (
  userId: string,
  buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
  mimetype: string,
  cloudinaryService: ReturnType<CloudinaryServiceInterface>,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    const b64 = Buffer.from(buffer).toString("base64");
    let dataURI = "data:" + mimetype + ";base64," + b64;
    const cldRes = await cloudinaryService.handleUpload(dataURI);
    const user = await dbUserRepository.updateDp(userId, cldRes.secure_url);
    const dp = user?.dp;
    await redisRepository.deleteCache(`userInfo:${userId}`);
    return { cldRes, dp };
  } catch (err) {
    console.log("err= ", err);
    throw new AppError(
      "Error uploading cover photo!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleUserInfo = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    const userInfo = await redisRepository.hashCache(
      `userInfo:${userId}`,
      async () => {
        const userData = await dbUserRepository.getUserById(userId);
        if (!userData) {
          throw new Error("User not found!");
        }
        const user = {
          _id: userData?._id.toString(),
          name: userData?.name,
          username: userData?.username,
          email: userData?.email,
          phoneNumber: userData?.phoneNumber,
          dp: userData?.dp,
          coverPhoto: userData?.coverPhoto,
          bio: userData?.bio,
          gender: userData?.gender,
          city: userData?.city,
          followers: userData?.followers,
          following: userData?.following,
          isAccountVerified: userData?.isAccountVerified,
          notifications: userData?.notifications,
        };
        return user;
      }
    );
    return userInfo;
  } catch (err) {
    console.log("err= ", err);
    throw new AppError("User not found!", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleCoverPhotoDeletion = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    await dbUserRepository.deleteCoverPhoto(userId);
    await redisRepository.deleteCache(`userInfo:${userId}`);
  } catch (err) {
    throw new AppError(
      "Error deleting cover photo!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleProfilePhotoDeletion = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    await dbUserRepository.deleteProfilePhoto(userId);
    await redisRepository.deleteCache(`userInfo:${userId}`);
  } catch (err) {
    throw new AppError(
      "Error deleting cover photo!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleChangePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  try {
    const user = await dbUserRepository.getUserById(userId);
    const isPasswordCorrect = await authService.comparePassword(
      oldPassword,
      user?.password?.toString() || ""
    );
    if (!isPasswordCorrect) {
      throw new AppError(
        "Incorrect current password!",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    newPassword = await authService.encryptPassword(newPassword);
    await dbUserRepository.updatePassword(userId, newPassword);
  } catch {
    throw new AppError(
      "Error changing password!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleUpdateProfile = async (
  profileInfo: ProfileInterface,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    if (profileInfo.email) {
      const existingEmail = await dbUserRepository.getUserByEmail(
        profileInfo.email
      );
      if (existingEmail) {
        throw new AppError(
          "Email already exists!",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        profileInfo.userId &&
          (await dbUserRepository.changeIsAccountUnverified(
            profileInfo.userId
          ));
      }
    }
    if (profileInfo?.username) {
      const existingUsername = await dbUserRepository.getUserByUsername(
        profileInfo.username
      );
      if (existingUsername) {
        throw new AppError(
          "Username already exists!",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    if (profileInfo?.phoneNumber) {
      const existingPhoneNumber = await dbUserRepository.getUserByPhoneNumber(
        profileInfo.phoneNumber
      );
      if (existingPhoneNumber) {
        throw new AppError(
          "Phone number already exists!",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    const user = await dbUserRepository.updateProfile(profileInfo);
    await redisRepository.deleteCache(`userInfo:${profileInfo.userId}`);
    return user;
  } catch (error) {
    throw error;
  }
};

export const handleSearchUsers = async (
  searchQuery: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const users = await dbUserRepository.searchUsers(searchQuery);
    return users;
  } catch (error) {
    throw new AppError(
      "Error searching users!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleAddUsername = async (
  userId: string,
  username: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  redisRepository: ReturnType<RedisDbInterface>
) => {
  try {
    const existingUsername = await dbUserRepository.getUserByUsername(username);
    if (existingUsername) {
      throw new AppError(
        "Username already exists!",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const user = await dbUserRepository.addUsername(userId, username);
    await redisRepository.deleteCache(`userInfo:${userId}`);
    return user;
  } catch (error) {
    throw error;
  }
};
