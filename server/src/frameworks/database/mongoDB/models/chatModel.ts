import { Document, Schema, model } from "mongoose";

interface ChatInterface extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: Schema.Types.ObjectId[];
  latestMessage: Schema.Types.ObjectId;
  groupAdmin: Schema.Types.ObjectId;
  isDeleted: boolean;
}

const chatSchema = new Schema<ChatInterface>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Chat = model<ChatInterface>("Chat", chatSchema);
export default Chat;