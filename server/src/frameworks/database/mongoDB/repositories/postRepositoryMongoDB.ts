import Post from "../models/postModel";

//importing types
import { PostDataInterface } from "../../../../types/postInterface";

export const postRepositoryMongoDB = () => {
  const createPost = async (postData: PostDataInterface) => {
    try {
      console.log("postDataAtRepository: ", postData);
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
          $match: {
            $or: [{ userId: userId }, { "user._id": { $in: following } }],
            reports: { $not: { $elemMatch: { userId: userId } } },
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
      const post = await Post.findById(postId);
      return post;
    } catch (err) {
      console.log(err);
    }
  };

  const getPostsByUserId = async (userId: string, skip: number, limit: number) => {
    try {
      const posts = await Post.find({ userId }).sort({createdAt: -1}).skip(skip).limit(limit);
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
const searchPostsByTextSearch = async (searchQuery: string, following: string[], skip: number, limit: number) => {
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
        .limit(limit)
      return posts;
    } catch (err) {
      console.log(err);
      throw new Error("Error searching posts");
    }
  };
  

  const searchPostsByRegexSearch = async (searchQuery: string, following: string[], skip: number, limit: number) => {
    try {
      const posts = await Post.find(
        {
          $and: [
            { userId: { $in: following } },
            {
              $or: [
                { hashtags: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
              ],
            },
          ],
        }
      )
      .skip(skip)
      .limit(limit)
      return posts;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error searching posts");
    }
  }

  const getUserLikedPosts = async (userId: string, skip: number, limit: number) => {
    try{
      const posts = await Post.find({ likes: userId }).skip(skip).limit(limit);
      return posts;
    }
    catch(err){
      console.log(err);
      throw new Error ("Error getting user liked posts")
    }
  }

  const countOfsearchPostsByRegexSearch = async (searchQuery: string, following: string[]) => {
    try{
      const count = await Post.countDocuments({
        $and: [
          { userId: { $in: following } },
          {
            $or: [
              { hashtags: { $regex: searchQuery, $options: "i" } },
              { description: { $regex: searchQuery, $options: "i" } },
            ],
          },
        ],
      });
      return count
    }
    catch (err){
      console.log(err)
      throw new Error("Error getting search result count of posts")
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
    countOfsearchPostsByRegexSearch,
  };
};

export type PostRepositoryMongoDB = typeof postRepositoryMongoDB;
