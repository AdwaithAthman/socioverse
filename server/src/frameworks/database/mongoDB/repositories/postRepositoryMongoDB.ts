import Post from "../models/postModel";
import mongoose from "mongoose";

//importing types
import { PostDataInterface } from "../../../../types/postInterface";

export const postRepositoryMongoDB = () => {
  const createPost = async (postData: PostDataInterface) => {
    try {
      const post = new Post(postData);
      const savedPost = await post.save();
      return savedPost;
    } catch (err) {
      console.log(err);
    }
  };

  const getPosts = async (
    userId: string,
    following: string[],
    skip: number,
    limit: number
  ) => {
    try {
      const posts = await Post.aggregate([
        {
          $addFields: {
            userIdObj: { $toObjectId: "$userId" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userIdObj",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            $or: [{ userId: userId }, { "user._id": { $in: following } }],
            reports: { $not: { $elemMatch: { userId: userId } } },
            isBlock: false,
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            isBlock: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, email: 1, dp: 1 },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      return posts;
    } catch (err) {
      console.log(err);
    }
  };

  const getPostById = async (postId: string) => {
    try {
      const postObjId = new mongoose.Types.ObjectId(postId);
      console.log(postObjId);
      const post = await Post.aggregate([
        {
          $match: { _id: postObjId, isBlock: false },
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            isBlock: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, email: 1, dp: 1 },
          },
        },
      ]);
      return post[0];
    } catch (err) {
      console.log(err);
    }
  };

  const getPostsByUserId = async (
    userId: string,
    skip: number,
    limit: number
  ) => {
    try {
      const posts = await Post.aggregate([
        {
          $match: { userId: userId, isBlock: false },
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            isBlock: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, email: 1, dp: 1 },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      return posts;
    } catch (err) {
      console.log(err);
    }
  };

  const updatePostById = async (postId: string, postData: any) => {
    try {
      const post = await Post.findByIdAndUpdate(postId, postData);
      return post;
    } catch (err) {
      console.log(err);
    }
  };

  const deletePostById = async (postId: string) => {
    try {
      await Post.findByIdAndDelete(postId);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async (postId: string, commentId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $push: { comments: commentId } });
    } catch (err) {
      console.log(err);
    }
  };

  const likePost = async (postId: string, userId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
    } catch (err) {
      console.log(err);
    }
  };

  const unlikePost = async (postId: string, userId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    } catch (err) {
      console.log(err);
    }
  };

  const savePost = async (postId: string, userId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $push: { saved: userId } });
    } catch (err) {
      console.log(err);
    }
  };

  const unsavePost = async (postId: string, userId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $pull: { saved: userId } });
    } catch (err) {
      console.log(err);
    }
  };

  const reportPost = async (
    postId: string,
    { userId, label }: { userId: string; label: string }
  ) => {
    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { reports: { userId, label } },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const editPost = async (postId: string, postData: PostDataInterface) => {
    try {
      const editedPost = await Post.findByIdAndUpdate(postId, postData, {
        new: true,
      });
      return editedPost;
    } catch (err) {
      console.log(err);
    }
  };
  const searchPostsByTextSearch = async (
    searchQuery: string,
    following: string[],
    skip: number,
    limit: number
  ) => {
    try {
      const posts = await Post.find(
        {
          $and: [
            { userId: { $in: following } },
            { $text: { $search: searchQuery } },
          ],
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit);
      return posts;
    } catch (err) {
      console.log(err);
      throw new Error("Error searching posts");
    }
  };

  const searchPostsByRegexSearch = async (
    searchQuery: string,
    following: string[],
    skip: number,
    limit: number
  ) => {
    try {
      console.log(following)
      const posts = await Post.aggregate([
        {
          $match:
          {
            $and: [
              { userId: { $in: following } },
              { hashtags: { $regex: searchQuery, $options: "i" } },
              { isBlock: false}
            ]
          }
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            isBlock: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: "$user._id",
              name: "$user.name",
              username: "$user.username",
              email: "$user.email",
              dp: "$user.dp",
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      return posts;
    } catch (err) {
      console.log(err);
      throw new Error("Error searching posts");
    }
  };

  const getUserLikedPosts = async (
    userId: string,
    skip: number,
    limit: number
  ) => {
    try {
      const posts = await Post.aggregate([
        {
          $match: { likes: userId, isBlock: false },
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            isBlock: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, email: 1, dp: 1 },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      return posts;
    } catch (err) {
      console.log(err);
      throw new Error("Error getting user liked posts");
    }
  };

  const getSavedPosts = async (
    savedPostsId: string[],
    skip: number,
    limit: number
  ) => {
    try {
      const posts = await Post.aggregate([
        {
          $match: { _id: { $in: savedPostsId }, isBlock: false },
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            isBlock: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, email: 1, dp: 1 },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      return posts;
    } catch (err) {
      console.log(err);
      throw new Error("Error getting saved posts");
    }
  };

  const countOfsearchPostsByRegexSearch = async (
    searchQuery: string,
    following: string[]
  ) => {
    try {
      const count = await Post.countDocuments({
        $and: [
          { userId: { $in: following } },
          { isBlock: false},
          {
            $or: [
              { hashtags: { $regex: searchQuery, $options: "i" } },
              { description: { $regex: searchQuery, $options: "i" } },
            ],
          },
        ],
      });
      return count;
    } catch (err) {
      console.log(err);
      throw new Error("Error getting search result count of posts");
    }
  };

  const getAllPosts = async () => {
    try {
      const posts = await Post.aggregate([
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hashtags: 1,
            hashtagsArray: 1,
            description: 1,
            likes: 1,
            comments: 1,
            saved: 1,
            reports: 1,
            image: 1,
            isBlock: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: "$user._id",
              name: "$user.name",
              username: "$user.username",
              email: "$user.email",
              dp: "$user.dp",
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        }
      ])
      return posts;
    }
    catch (err) {
      console.log(err)
      throw new Error("Error getting all posts")
    }
  }

  const getReportInfo = async (postId: string) => {
    const postObjId = new mongoose.Types.ObjectId(postId);
    const reportInfo = await Post.aggregate([
      {
        $match: { _id: postObjId },
      },
      {
        $unwind: "$reports"
      },
      {
        $addFields: {
          "reports.userObjId": {
            $toObjectId: "$reports.userId"
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "reports.userObjId",
          foreignField: "_id",
          as: "reports.user"
        }
      },
      {
        $unwind: "$reports.user"
      },
      {
        $project: {
          reports: {
            _id: 1,
            userId: 1,
            label: 1,
            user: {
              _id: 1,
              name: 1,
              username: 1,
              email: 1,
              dp: 1
            }
          },
        },
      },
    ]);
    return reportInfo;
  }

  const blockPost = async (postId: string) => {
    try{
      await Post.updateOne({_id: postId}, {
        $set: {
          isBlock: true
        }
      })
    }
    catch(err){
      console.log(err)
      throw new Error("Error blocking post")
    }
  }

  const unblockPost = async (postId: string) => {
    try{
      await Post.updateOne({_id: postId}, {
        $set: {
          isBlock: false
        }
      })
    }
    catch(err){
      console.log(err)
      throw new Error("Error blocking post")
    }
  }

  const getMonthlyPosts = async () => {
    try{
      const results = await Post.aggregate([
        {
          $group: {
              _id: { 
                year: { $year: '$createdAt' },  
                month: { $month: '$createdAt' }
              },
            count: {
              $sum: 1
            }
          }
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
      console.log(err)
      throw new Error("Error getting monthly posts")
    }
  }

  const getLikedUsers = async (postId: string) => {
    try{
      const postObjId = new mongoose.Types.ObjectId(postId);
      const users = await Post.aggregate([
        {
          $match: {
            _id: postObjId
          }
        },
        {
          $unwind: "$likes"
        },
        {
          $addFields: {
            "likesObjId": {
              $toObjectId: "$likes"
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "likesObjId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            "_id": "$user._id",
            "name": "$user.name",
            "username": "$user.username",
            "email": "$user.email",
            "dp": "$user.dp"
          }
        }
      ])
      return users;
    }
    catch (err){
      throw new Error("Error getting liked users")
    }
  }

  return {
    createPost,
    getPosts,
    getPostById,
    getPostsByUserId,
    updatePostById,
    deletePostById,
    addComment,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    reportPost,
    editPost,
    searchPostsByTextSearch,
    searchPostsByRegexSearch,
    getUserLikedPosts,
    getSavedPosts,
    countOfsearchPostsByRegexSearch,
    getAllPosts,
    getReportInfo,
    blockPost,
    unblockPost,
    getMonthlyPosts,
    getLikedUsers
  };
};

export type PostRepositoryMongoDB = typeof postRepositoryMongoDB;
