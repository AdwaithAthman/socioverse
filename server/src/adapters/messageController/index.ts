import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ChatDbRepository } from "../../application/repositories/chatDbRepository";
import { ChatRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB";
import { MessageRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/messageRepositoryMongoDB";
import { MessageDbRepository } from "../../application/repositories/messageDbRepository";

import { handleSendMessage } from "../../application/use-cases/message/message";

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

  return {
    sendMessage,
  };
};

export default messageController;
