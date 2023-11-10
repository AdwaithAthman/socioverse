import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatDbRepository } from '../../application/repositories/chatDbRepository';
import { ChatRepositoryMongoDB } from '../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB';

import {
    handleAccessOrCreateChat,
    handleFetchChats,
    handleCreateGroupChat,
    handleRenameGroupChat,
    handleAddToGroup,
    handleRemoveFromGroup,
    handleUpdateGroup,
    handleGroupRemove,
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

    const renameGroupChat = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, name }: { chatId: string, name: string } = req.body;
        const updatedChat = await handleRenameGroupChat(chatId, name, chatDbRepository);
        res.status(200).json({
            status: "success",
            updatedChat,
        });
    });

    const addToGroup = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, newUserId }: { chatId: string, newUserId: string } = req.body;
        const updatedChat = await handleAddToGroup(chatId, newUserId, chatDbRepository);
        res.status(200).json({
            status: "success",
            updatedChat,
        });
    });

    const removeFromGroup = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, removeUserId } = req.query as unknown as { chatId: string, removeUserId: string };
        const updatedChat = await handleRemoveFromGroup(chatId, removeUserId, chatDbRepository);
        res.status(200).json({
            status: "success",
            updatedChat,
        });
    });

    const updateGroup = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body
        const { groupId } = req.params as unknown as { groupId: string };
        data.users = JSON.parse(data.users);
        const groupChat = await handleUpdateGroup(groupId, data, chatDbRepository);
        res.status(200).json({
            status: "success",
            groupChat,
        });

    });

    const groupRemove = asyncHandler(async (req: Request, res: Response) => {
        const { groupId } = req.params as unknown as { groupId: string };
        await handleGroupRemove(groupId, chatDbRepository);
        res.status(200).json({
            status: "success",
        });
    });

    return {
        createOrAccessChat,
        fetchChats,
        createGroupChat,
        renameGroupChat,
        addToGroup,
        removeFromGroup,
        updateGroup,
        groupRemove,
    }
}

export default chatController;