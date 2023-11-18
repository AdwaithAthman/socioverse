import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ChatDbRepository } from "../../application/repositories/chatDbRepository";
import { ChatRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB";
import { MessageRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/messageRepositoryMongoDB";
import { MessageDbRepository } from "../../application/repositories/messageDbRepository";

import {
  handleSendMessage,
  handleGetAllMessagesFromChat,
  handleFetchNotifications,
} from "../../application/use-cases/message/message";

const messageController = (
  chatDbRepositoryImpl: ChatRepositoryMongoDB,
  chatDbRepositoryInterface: ChatDbRepository,
  messageDbRespositoryImpl: MessageRepositoryMongoDB,
  messageDbRepositoryInterface: MessageDbRepository
) => {
  const chatDbRepository = chatDbRepositoryInterface(chatDbRepositoryImpl());
  const messageDbRepository = messageDbRepositoryInterface(
    messageDbRespositoryImpl()
  );

  const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const newMessage: { content: string; chatId: string; userId: string } =
      req.body;
    const message = await handleSendMessage(
      newMessage,
      messageDbRepository,
      chatDbRepository
    );
    res.status(200).json({
      status: "success",
      message,
    });
  });

  const getAllMessagesFromChat = asyncHandler(
    async (req: Request, res: Response) => {
      const { chatId } = req.params as unknown as { chatId: string };
      console.log("chatId at controller: ", chatId);
      const messages = await handleGetAllMessagesFromChat(
        chatId,
        messageDbRepository
      );
      res.status(200).json({
        status: "success",
        messages,
      });
    }
  );

  const fetchNotifications = asyncHandler(
    async (req: Request, res: Response) => {
      const { Ids } = req.query as unknown as { Ids: string };
      const notifications = await handleFetchNotifications(
        JSON.parse(Ids),
        messageDbRepository
      );
      res.json({
        status: "success",
        message: "notifications fetched",
        notifications,
      });
    }
  );

  return {
    sendMessage,
    getAllMessagesFromChat,
    fetchNotifications,
  };
};

export default messageController;
