import { Document, Schema, model } from "mongoose";

interface CommentInterface extends Document {
  postId: string;
  userId: string;
  comment: string;
  replies: string[];
  report: string[];
  likes: string[];
}

interface ReplyCommentInterface extends Document {
  postId: string;
  userId: string;
  reply: string;
  report: string[];
  likes: string[];
}

const replyCommentSchema = new Schema<ReplyCommentInterface>(
  {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
    report: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const commentSchema = new Schema<CommentInterface>(
  {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    replies: [replyCommentSchema],
    report: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = model<CommentInterface>("Comment", commentSchema);
export default Comment;
