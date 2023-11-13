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
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        )
        .populate("chat")
        .populate(
          "chat.users",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        );
        return fullMessage;
    } catch (err) {
      console.log(err);
      throw new Error("Error in getting message");
    }
  };

  const getAllMessagesFromChat = async (chatId: string) => {
    try{
        const messages = await Message.find({chat: chatId})
         .populate("sender", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following")
         .populate("chat");

         return messages;
    }
    catch(err){
      console.log(err);
      throw new Error("Error in getting messages");
  }
}

  return {
    sendMessage,
    getFullMessage,
    getAllMessagesFromChat,
  };
};

export type MessageRepositoryMongoDB = typeof messageRepositoryMongoDB;
