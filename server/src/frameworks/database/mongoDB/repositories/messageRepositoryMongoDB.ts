import mongoose from "mongoose";
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
    try {
      const messages = await Message.find({ chat: chatId })
        .populate(
          "sender",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        )
        .populate("chat");

      return messages;
    } catch (err) {
      console.log(err);
      throw new Error("Error in getting messages");
    }
  };

  const fetchNotifications = async (notificationIds: string[]) => {
    try {
      const notifications = await Message.aggregate([
        {
          $match: {
            _id: {
              $in: notificationIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender",
          },
        },
        {
          $unwind: "$sender",
        },
        {
          $lookup: {
            from: "chats",
            localField: "chat",
            foreignField: "_id",
            as: "chat",
          },
        },
        {
          $unwind: "$chat",
        },
        {
          $project: {
            "sender.password": 0,
          },
        },
      ]);

      return notifications;
    } catch (err) {
      console.log(err);
      throw new Error("Error in fetching notifications");
    }
  };

  return {
    sendMessage,
    getFullMessage,
    getAllMessagesFromChat,
    fetchNotifications,
  };
};

export type MessageRepositoryMongoDB = typeof messageRepositoryMongoDB;
