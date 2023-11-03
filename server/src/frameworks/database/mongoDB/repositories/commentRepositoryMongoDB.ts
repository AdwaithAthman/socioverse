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
          $match: { postId, isBlock: false },
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
        $match: { "replies.isBlock": false },
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
      await Comment.updateOne({
        _id: commentId
      }, {
        $set: { isBlock: true }
      })
    }
    catch (err) {
      console.log(err)
      throw new Error("Error deleting comment");
    }
  }

  const deleteReply = async (replyId: string, commentId: string) => {
    try {
      await Comment.updateOne(
        { _id: commentId, "replies._id": replyId },
        { $set: { "replies.$.isBlock": true } }
      );
    }
    catch (err) {
      console.log(err)
      throw new Error("Error deleting reply");
    }
  }

  const reportComment = async (commentId: string, userId: string) => {
    try{
      await Comment.updateOne({_id: commentId} , {$addToSet: {report: userId}})
    }
    catch(err) {
      console.log(err)
      throw new Error("Error reporting comment");
    }
  }

  const reportReply = async (replyId: string, commentId: string, userId: string) => {
    try {
      await Comment.updateOne(
        { _id: commentId, "replies._id": replyId },
        { $addToSet: { "replies.$.report": userId } }
      );
    }
    catch (err) {
      console.log(err)
      throw new Error("Error deleting reply");
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

  const getAllReportedComments = async (skip: number, limit: number) => {
    try{
      const comments = await Comment.aggregate([
        {
          $match: { report: { $exists: true, $ne: []}}
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            comment: 1,
            createdAt: 1,
            updatedAt: 1,
            report: 1,
            isBlock: 1,
            user: {
              _id: 1,
              name: 1,
              username: 1,
              dp: 1,
              email: 1
            }
          }
        }
      ])

      return comments;
    }
    catch(err){
      throw new Error("Error getting all reported comments")
    }
  }

  const getAllReportedReplies = async (skip: number, limit: number) => {
    try{
      const replies = await Comment.aggregate([
        {
          $match: { replies: { $exists: true, $ne: []} }
        },
        {
          $unwind: "$replies"
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$replies.userId" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $match: {
            "replies.report": { $exists: true, $ne: []}
          }
        },
        {
          $sort: { "replies.createdAt": -1 }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        },
        {
          $project: {
            "_id": "$replies._id",
            "userId": "$replies.userId",
            "commentId": "$_id",
            "reply": "$replies.reply",
            "createdAt": "$replies.createdAt",
            "updatedAt": "$replies.updatedAt",
            "report": "$replies.report",
            "likes": "$replies.likes",
            "isBlock": "$replies.isBlock",
            "user.name": "$user.name",
            "user.username": "$user.username",
            "user.dp": "$user.dp",
            "user.email": "$user.email"
          }
        }
      ])
      return replies;
    }
    catch(err){
      console.log(err)
      throw new Error("Error getting all reported replies")
    }
  }

  const getCommentReportedUsers = async (commentId: string) => {
    try{
      const commentObjId = new mongoose.Types.ObjectId(commentId);
      const reportedUsers = await Comment.aggregate([
        {
          $match: { _id: commentObjId }
        },
        {
          $unwind: "$report"
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$report" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
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
            "dp": "$user.dp",
            "email": "$user.email"
          }
        }
      ])
      return reportedUsers;
    }
    catch(err){
      throw new Error("Error getting comment reported users")
    }
  }

  const getReplyReportedUsers = async (replyId: string, commentId: string) => {
    try{
      const replyObjId = new mongoose.Types.ObjectId(replyId);
      const commentObjId = new mongoose.Types.ObjectId(commentId);
      const reportedUsers = await Comment.aggregate([
        {
          $match: {
            _id: commentObjId,
          }
        },
        {
          $addFields: {
            replies: {
              $filter: {
                input: "$replies",
                as: "reply",
                cond: { $eq: ["$$reply._id", replyObjId] },
              },
            },
          },
        },
        {
          $unwind: "$replies",
        },
        {
          $unwind: "$replies.report",
        },
        {
          $addFields: {
            userObjId: { $toObjectId: "$replies.report" },
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
            _id: "$user._id",
            name: "$user.name",
            username: "$user.username",
            dp: "$user.dp",
            email: "$user.email",
          },
        }
      ])
      return reportedUsers;
    }
    catch(err){
      throw new Error("Error getting reply reported users")
    }
  }

  const blockComment = async (commentId: string) => {
    try{
      await Comment.updateOne({_id: commentId}, {$set: {isBlock: true}})
    }
    catch(err){
      throw new Error("Error blocking comment")
    }
  }

  const unblockComment = async (commentId: string) => {
    try{
      await Comment.updateOne({_id: commentId}, {$set: {isBlock: false}})
    }
    catch(err){
      throw new Error("Error blocking comment")
    }
  }

  const blockReply = async (replyId: string, commentId: string) => {
    try{
      await Comment.updateOne({_id: commentId, "replies._id": replyId}, {$set: {"replies.$.isBlock": true}})
    }
    catch(err){
      throw new Error("Error blocking reply") 
    }
  }

  const unblockReply = async (replyId: string, commentId: string) => {
    try{
      await Comment.updateOne({_id: commentId, "replies._id": replyId}, {$set: {"replies.$.isBlock": false}})
    }
    catch(err){
      throw new Error("Error blocking reply")
    }
  }

  const getAllReportedCommentsCount = async () => {
    try{
      const count = await Comment.countDocuments({report: { $exists: true, $ne: []}})
      return count;
    }
    catch(err){
      throw new Error("Error getting reported comments count")
    }
  }

  const getAllReportedRepliesCount = async () => {
    try{
      const count = await Comment.countDocuments({"replies.report": { $exists: true, $ne: []}})
      return count;
    }
    catch(err){
      throw new Error("Error getting reported replies count")
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
    deleteReply,
    reportComment,
    reportReply,
    likeComment,
    unlikeComment,
    likeReply,
    unlikeReply,
    getAllReportedComments,
    getAllReportedReplies,
    getCommentReportedUsers,
    getReplyReportedUsers,
    blockComment,
    unblockComment,
    blockReply,
    unblockReply,
    getAllReportedCommentsCount,
    getAllReportedRepliesCount,
  };
};

export type CommentRepositoryMongoDB = typeof commentRepositoryMongoDB;
