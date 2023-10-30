import { Document, Schema, model } from "mongoose";

interface CommentInterface extends Document {
  postId: string;
  userId: string;
  comment: string;
  replies: string[];
  report: string[];
  likes: string[];
  isBlock: boolean,
}

interface ReplyCommentInterface extends Document {
  postId: string;
  userId: string;
  reply: string;
  report: string[];
  likes: string[];
  isBlock: boolean,
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
    isBlock: {
      type: Boolean,
      default: false,
    },
    report: [],
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
    report: [],
    likes: [
      {
        type: String,
      },
    ],
    isBlock: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Comment = model<CommentInterface>("Comment", commentSchema);
export default Comment;
