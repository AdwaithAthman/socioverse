import Comment from "../models/commentModel";
import mongoose from "mongoose";

//importing types
import {
  CommentDataInterface,
  ReplyDataInterface,
} from "../../../../types/commentInterface";

export const commentRepositoryMongoDB = () => {
  const addComment = async (commentObj: CommentDataInterface) => {
    try {
      const comment = new Comment(commentObj);
      const savedComment = await comment.save();
      return savedComment;
    } catch (err) {
      console.log(err);
    }
  };

  const getComments = async (postId: string) => {
    try {
      const comments = await Comment.aggregate([
        {
          $match: { postId },
        },
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
          $project: {
            _id: 1,
            postId: 1,
            comment: 1,
            report: 1,
            likes: 1,
            replies: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, dp: 1 },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return comments;
    } catch (err) {
      console.log(err);
    }
  };

  const addReply = async (replyObj: ReplyDataInterface, commentId: string) => {
    try {
      const result = await Comment.findByIdAndUpdate(
        { _id: commentId },
        { $push: { replies: replyObj } },
        { new: true }
      );
      const newReply: any = result?.replies[(result.replies.length - 1)];
      return newReply;
    } catch (err) {
      console.log(err);
    }
  };

  const getReplies = async (commentId: string) => {
    const commentObjId = new mongoose.Types.ObjectId(commentId);
    const replies = await Comment.aggregate([
      {
        $match: { _id: commentObjId },
      },
      {
        $unwind: "$replies",
      },
      {
        $addFields: {
          userIdObj: { $toObjectId: "$replies.userId" },
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
        $sort: { "replies.createdAt": -1 },
      },
      {
        $project: {
          _id: "$replies._id",
          userId: "$replies.userId",
          reply: "$replies.reply",
          report: "$replies.report",
          likes: "$replies.likes",
          createdAt: "$replies.createdAt",
          updatedAt: "$replies.updatedAt",
          user: { _id: 1, name: 1, username: 1, dp: 1 },
        },
      },
    ]);
    console.log("replies: ", replies);
    return replies;
  };

  const editComment = async (commentId: string, comment: string) => {
    try {
      const result = await Comment.updateOne(
        { _id: commentId },
        { $set: { comment } },
        { new: true }
      );
      return result;
    }
    catch (err) {
      console.log(err)
    }
  }

  const getCommentById = async (commentId: string) => {
    try {
      const commentObjId = new mongoose.Types.ObjectId(commentId);
      const comment = await Comment.aggregate([
        {
          $match: { _id: commentObjId }
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
          }
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            postId: 1,
            comment: 1,
            report: 1,
            likes: 1,
            replies: 1,
            createdAt: 1,
            updatedAt: 1,
            user: { _id: 1, name: 1, username: 1, dp: 1 },
          },
        },
      ]);
      console.log("comment: ", comment)
      return comment[0];
    }
    catch (err) {
      console.log(err);
      throw new Error("Error getting comment by id");
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      await Comment.findByIdAndDelete(commentId)
    }
    catch (err) {
      console.log(err)
      throw new Error("Error deleting comment");
    }
  }

  const likeComment = async (commentId: string, userId: string) => {
    try {
      await Comment.updateOne(
        { _id: commentId },
        { $push: { likes: userId } }
      );
    }
    catch (err) {
      console.log(err)
      throw new Error("Error liking comment");
    }
  }

  const unlikeComment = async (commentId: string, userId: string) => {
    try {
      await Comment.updateOne(
        { _id: commentId },
        { $pull: { likes: userId } }
      );
    }
    catch (err) {
      console.log(err)
      throw new Error("Error unliking comment");
    }
  }

  const likeReply = async (replyId: string, commentId: string, userId: string) => {
    try {
      await Comment.updateOne(
        { _id: commentId, "replies._id": replyId },
        { $addToSet: { "replies.$.likes": userId } }
      );
    }
    catch (err) {
      console.log(err)
      throw new Error("Error liking reply");
    }
  }

  const unlikeReply = async (replyId: string, commentId: string, userId: string) => {
    try {
      await Comment.updateOne(
        { _id: commentId, "replies._id": replyId },
        { $pull: { "replies.$.likes": userId } }
      );
    }
    catch (err) {
      console.log(err)
      throw new Error("Error unliking reply");
    }
  }


  return {
    addComment,
    getComments,
    addReply,
    getReplies,
    editComment,
    getCommentById,
    deleteComment,
    likeComment,
    unlikeComment,
    likeReply,
    unlikeReply,
  };
};

export type CommentRepositoryMongoDB = typeof commentRepositoryMongoDB;
