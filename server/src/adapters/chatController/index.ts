import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatDbRepository } from '../../application/repositories/chatDbRepository';
import { ChatRepositoryMongoDB } from '../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB';

import {
    handleAccessOrCreateChat,
    handleFetchChats,
} from '../../application/use-cases/chat/chat';



const chatController = (
    chatDbRepositoryImpl: ChatRepositoryMongoDB,
    chatDbRepositoryInterface: ChatDbRepository,
) => {

    const chatDbRepository = chatDbRepositoryInterface(chatDbRepositoryImpl());

    const createOrAccessChat = asyncHandler(async (req: Request, res: Response) => {
        const { userId, otherUserId }: { userId: string, otherUserId: string } = req.body;
        console.log("otherUserId: ", otherUserId)
        const chat = await handleAccessOrCreateChat(userId, otherUserId, chatDbRepository);
        res.status(200).json({ 
            status: "success",
            chat,
        });
    });

    const fetchChats = asyncHandler(async (req: Request, res: Response) => {
        const { userId }: { userId: string } = req.body;
        const chats = await handleFetchChats(userId, chatDbRepository);
        res.status(200).json({
            status: "success",
            chats,
        });
    });

    return {
        createOrAccessChat,
        fetchChats,
    }
}

export default chatController;