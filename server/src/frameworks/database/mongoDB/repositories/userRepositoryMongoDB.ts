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
      throw new Error("Error adding user!");
    }
  };

  const getAllUsers = async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting all users!");
    }
  };

  const getAllUsersCount = async () => {
    try {
      const count = await User.countDocuments();
      return count;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting all users count!");
    }
  }

  const getBlockedUsersCount = async () => {
    try {
      const count = await User.countDocuments({ isBlock: true });
      return count;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting blocked users!");
    }
  }

  const getUserById = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting user by id!");
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting user by email!");
    }
  };

  const getUserByUsername = async (username: string) => {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting user by username!");
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
      throw new Error("Error logging out user!");
    }
  };

  const getUserByPhoneNumber = async (phoneNumber: number) => {
    try {
      const user = await User.findOne({ phoneNumber });
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting user by phone number!");
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
      throw new Error("Error adding refresh token and expiry!");
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
      throw new Error("Error updating cover photo!");
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
      throw new Error("Error updating dp!")
    }
  };

  const deleteCoverPhoto = async (userId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $unset: { coverPhoto: 1 } });
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting cover photo!");
    }
  };

  const deleteProfilePhoto = async (userId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $unset: { dp: 1 } });
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting profile photo!")
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
      throw new Error("Error updating password!");
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
      throw new Error("Error updating profile!")
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
      throw new Error("Error getting rest of users!")
    }
  };

  const followUser = async (userId: string, friendId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $addToSet: { following: friendId } });
      await User.updateOne({ _id: friendId }, { $addToSet: { followers: userId } });
    } catch (error) {
      console.log(error);
      throw new Error("Error following user!")
    }
  };

  const unfollowUser = async (userId: string, friendId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $pull: { following: friendId } });
      await User.updateOne({ _id: friendId }, { $pull: { followers: userId } });
    } catch (error) {
      console.log(error);
      throw new Error("Error unfollowing user!")
    }
  };

  const getFollowers = async (userId: string) => {
    try {
      const user = await User.findById(userId).populate("followers");
      return user?.followers;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting followers!")
    }
  };

  const getFollowing = async (userId: string) => {
    try {
      const user = await User.findById(userId).populate("following");
      return user?.following;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting following!")
    }
  };

  const getSuggestions = async (userId: string) => {
    try{
      const userObjId = new mongoose.Types.ObjectId(userId);
      const suggestions = await User.aggregate([
        {
          $match: {
            _id: userObjId
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'following',
            foreignField: '_id',
            as: 'followingUsers'
          }
        },
        {
          $unwind: '$followingUsers'
        },
        {
          $replaceRoot: {
            newRoot: '$followingUsers'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'following',
            foreignField: '_id',
            as: 'followingUsers'
          }
        },
        {
          $unwind: '$followingUsers'
        },
        {
          $replaceRoot: {
            newRoot: '$followingUsers'
          }
        },
        {
          $match: {
            _id: { $ne: userObjId },
            followers: { $ne: userObjId },
          }
        }
      ]);
      console.log("suggestions: ", suggestions)
      return suggestions;
    }
    catch(error){
      console.log(error);
      throw new Error("Error getting suggestions!")
    }
  }

  const updatePosts = async (userId: string, postId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $push: { posts: postId } });
    } catch (error) {
      console.log(error);
      throw new Error ("Error updating posts!")
    }
  };

  const deletePost = async (userId: string, postId: string) => {
    try {
      const postID = new mongoose.Types.ObjectId(postId);
      await User.updateOne({ _id: userId }, { $pull: { posts: postID } });
    } catch (error) {
      console.log(error);
      throw new Error ("Error deleting post!")
    }
  };

  const savePost = async (userId: string, postId: string) => {
    try {
      const postObjId = new mongoose.Types.ObjectId(postId);
      await User.updateOne({ _id: userId }, { $addToSet: { savedPosts: postObjId }  });
    } catch (error) {
      console.log(error);
      throw new Error ("Error saving post!")
    }
  };

  const unsavePost = async (userId: string, postId: string) => {
    try {
      await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } });
    } catch (error) {
      console.log(error);
      throw new Error ("Error unsaving post!")
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

  const changeIsAccountUnverified = async (userId: string) => {
    try {
      await User.updateOne({ _id: userId }, {
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

  const getMonthlyUserSignups = async () => {
    try{
      const results = await User.aggregate([
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },  
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }  
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1}  
        },
        {
          $project: {
            _id: 0,
            month: '$_id.month',
            year: '$_id.year',
            count: 1
          }
        }
      ]);
      return results;
    }
    catch(err){
      throw new Error ("Error getting monthly user signups")
    }
  }

  const getUsersCountOnSearch = async (searchQuery: string) => {
    try{
      const regex = new RegExp(`^${searchQuery}`, "i");
      const count = await User.countDocuments({
        $or: [{ name: regex }, { email: regex }, { username: regex }]
      });
      return count;
    }
    catch(err){
      throw new Error("Error getting users count on search");
    }
  }

  const getUsersOnSearch = async (searchQuery: string, skip: number, limit: number) => {
    try{
      const regex = new RegExp(`^${searchQuery}`, "i");
      const users = await User.find({
        $or: [{ name: regex }, { email: regex }, { username: regex }]
      }).skip(skip).limit(limit);
      return users;
    }
    catch(err){
      throw new Error("Error getting users on search");
    }
  }

  const addNotification = async (userId: string, messageId: string) => {
    try{
      await User.updateOne({ _id: userId }, { $addToSet: { notifications: messageId } });
    }
    catch(err){
      throw new Error("Error adding notification");
    }
  }

  const deleteNotification = async (userId: string, messageId: string) => {
    try{
      await User.updateOne({ _id: userId }, { $pull: { notifications: messageId } });
    }
    catch(err){
      throw new Error("Error deleting notification");
    }
  }

  return {
    addUser,
    getAllUsers,
    getAllUsersCount,
    getBlockedUsersCount,
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
    getSuggestions,
    updatePosts,
    deletePost,
    savePost,
    unsavePost,
    searchUsers,
    changeIsAccountVerified,
    changeIsAccountUnverified,
    blockUser,
    unblockUser,
    getMonthlyUserSignups,
    getUsersCountOnSearch,
    getUsersOnSearch,
    addNotification,
    deleteNotification,
  };
};

export type UserRepositoryMongoDB = typeof userRepositoryMongoDB;
