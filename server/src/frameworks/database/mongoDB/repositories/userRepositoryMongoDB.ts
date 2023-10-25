import User from "../models/userModel";

//importing types
import {
  UserInterface,
  GoogleUserInterface,
} from "../../../../types/userInterface";
import { ProfileInterface } from "../../../../types/profileInterface";
import mongoose from "mongoose";

export const userRepositoryMongoDB = () => {
  const addUser = async (user: UserInterface | GoogleUserInterface) => {
    try {
      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserById = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByUsername = async (username: string) => {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const addUsername = async (userId: string, username: string) => {
    try{
      await User.updateOne({ _id: userId }, { $set: { username } });
    }
    catch (error) {
      console.log(error);
      throw new Error("Error adding username!");
    }
  }

  const logoutUser = async (userId: string) => {
    try {
      await User.updateOne(
        { _id: userId },
        { $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByPhoneNumber = async (phoneNumber: number) => {
    try {
      const user = await User.findOne({ phoneNumber });
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const addRefreshTokenAndExpiry = async (
    email: string,
    refreshToken: string
  ) => {
    try {
      const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
      const user = await User.findOneAndUpdate(
        { email },
        { refreshToken, refreshTokenExpiresAt },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCoverPhoto = async (userId: string, secure_url: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { coverPhoto: secure_url },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const updateDp = async (userId: string, secure_url: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { dp: secure_url },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCoverPhoto = async (userId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $unset: { coverPhoto: 1 } });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfilePhoto = async (userId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $unset: { dp: 1 } });
    } catch (error) {
      console.log(error);
    }
  };

  const updatePassword = async (userId: string, newPassword: string) => {
    try {
      await User.updateOne(
        { _id: userId },
        { $set: { password: newPassword } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      await User.updateOne({ email }, {
        $set: {
          password: newPassword
        }
      })
    }
    catch (error) {
      console.log(error);
      throw new Error("Error resetting password!");
    }
  }

  const updateProfile = async (profileInfo: ProfileInterface) => {
    try {
      const user = await User.findByIdAndUpdate(
        profileInfo.userId,
        profileInfo,
        { new: true }
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const getRestOfUsers = async (userId: string, limit: number) => {
    try {
      const users = await User.find(
        {
          $and: [
            { _id: { $ne: userId } }, // Exclude the logged-in user
            { isBlock: false }, // User is not blocked
            {
              $or: [
                { following: { $nin: [userId] } }, // User is not following the logged-in user
                { blockingUsers: { $nin: [userId] } }, // User is not blocking the logged-in user
              ],
            },
          ],
        },
        { password: 0 } // Exclude the 'password' field
      ).limit(limit);
      return users;
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (userId: string, friendId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $push: { following: friendId } });
      await User.updateOne({ _id: friendId }, { $push: { followers: userId } });
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (userId: string, friendId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $pull: { following: friendId } });
      await User.updateOne({ _id: friendId }, { $pull: { followers: userId } });
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowers = async (userId: string) => {
    try {
      const user = await User.findById(userId).populate("followers");
      return user?.followers;
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowing = async (userId: string) => {
    try {
      const user = await User.findById(userId).populate("following");
      console.log("following: ", user?.following.length);
      return user?.following;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePosts = async (userId: string, postId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $push: { posts: postId } });
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (userId: string, postId: string) => {
    try {
      const postID = new mongoose.Types.ObjectId(postId);
      await User.updateOne({ _id: userId }, { $pull: { posts: postID } });
    } catch (error) {
      console.log(error);
    }
  };

  const savePost = async (userId: string, postId: string) => {
    try {
      const postObjId = new mongoose.Types.ObjectId(postId);
      await User.updateOne({ _id: userId }, { $addToSet: { savedPosts: postObjId }  });
    } catch (error) {
      console.log(error);
    }
  };

  const unsavePost = async (userId: string, postId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } });
    } catch (error) {
      console.log(error);
    }
  };

  const searchUsers = async (searchQuery: string) => {
    try {
      const regex = new RegExp(`^${searchQuery}`, "i");
      const users = await User.aggregate([
        {
          $match: {
            $or: [{ name: regex }, { email: regex }, { username: regex }]
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            username: 1,
            email: 1,
            dp: 1,
            bio: 1,
          }
        }
      ]);
      return users;
    } catch (error) {
      console.log(error);
      throw new Error("Error searching users!");
    }
  };

  const changeIsAccountVerified = async (email: string) => {
    try {
      await User.updateOne({ email }, {
        $set: {
          isAccountVerified: true
        }
      })
      return true;
    }
    catch (error) {
      console.log(error);
      throw new Error("Error changing isAccountVerified field")
    }
  }

  const changeIsAccountUnverified = async (email: string) => {
    try {
      await User.updateOne({ email }, {
        $set: {
          isAccountVerified: false
        }
      })
      return true;
    }
    catch (error) {
      console.log(error);
      throw new Error("Error changing isAccountVerified field")
    }
  }

  const blockUser = async (userId: string) => {
    try{
      await User.updateOne({ _id: userId }, { $set: { isBlock: true } });
    }
    catch(error){
      console.log(error);
      throw new Error("Error blocking user")
    }
  }

  const unblockUser = async (userId: string) => {
    try{
      await User.updateOne({ _id: userId }, { $set: { isBlock: false } });
    }
    catch(error){
      console.log(error);
      throw new Error("Error blocking user")
    }
  }

  return {
    addUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    addUsername,
    logoutUser,
    getUserByPhoneNumber,
    addRefreshTokenAndExpiry,
    updateCoverPhoto,
    updateDp,
    deleteCoverPhoto,
    deleteProfilePhoto,
    updatePassword,
    resetPassword,
    updateProfile,
    getRestOfUsers,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    updatePosts,
    deletePost,
    savePost,
    unsavePost,
    searchUsers,
    changeIsAccountVerified,
    changeIsAccountUnverified,
    blockUser,
    unblockUser,
  };
};

export type UserRepositoryMongoDB = typeof userRepositoryMongoDB;
