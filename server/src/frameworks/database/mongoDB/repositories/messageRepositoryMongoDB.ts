import { MessageInterface } from "../../../../types/messageInterface";
import Message from "../models/messageModel";

export const messageRepositoryMongoDB = () => {
  const sendMessage = async (newMessage: MessageInterface) => {
    try {
      const message = await Message.create(newMessage);
      return message;
    } catch (err) {
      console.log(err);
      throw new Error("Error in sending message");
    }
  };

  const getFullMessage = async (messageId: string) => {
    try {
      const fullMessage = await Message.findOne({ _id: messageId })
        .populate(
          "sender",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt"
        )
        .populate("chat")
        .populate(
          "chat.users",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt"
        );
        return fullMessage;
    } catch (err) {
      console.log(err);
      throw new Error("Error in getting message");
    }
  };

  return {
    sendMessage,
    getFullMessage,
  };
};

export type MessageRepositoryMongoDB = typeof messageRepositoryMongoDB;
