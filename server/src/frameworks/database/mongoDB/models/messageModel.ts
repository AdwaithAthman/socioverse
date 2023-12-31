import { Document, Schema, model } from "mongoose";

interface MessageInterface extends Document {
  sender: Schema.Types.ObjectId;
  content: string;
  chat: Schema.Types.ObjectId;
  image: string;
}

const messageSchema = new Schema<MessageInterface>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
        },
        image: {
            type: String,
        }
    },
    { timestamps: true }
);

const Message = model<MessageInterface>("Message", messageSchema);
export default Message;