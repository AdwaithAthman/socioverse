import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatDbRepository } from '../../application/repositories/chatDbRepository';
import { ChatRepositoryMongoDB } from '../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB';

import {
    handleAccessOrCreateChat,
    handleFetchChats,
    handleCreateGroupChat,
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

    const createGroupChat = asyncHandler(async (req: Request, res: Response) => {
        const { userId, users, name }: { userId: string, users: string[], name: string } = req.body;
        const groupChat = await handleCreateGroupChat(userId, users, name, chatDbRepository);
        res.status(200).json({
            status: "success",
            groupChat,
        });
    });

    return {
        createOrAccessChat,
        fetchChats,
        createGroupChat,
    }
}

export default chatController;