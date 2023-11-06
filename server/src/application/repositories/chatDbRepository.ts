import { ChatRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB";

export const chatDbRepository = (repository: ReturnType<ChatRepositoryMongoDB>) => {
    
        const accessChat = async(loggedInUserId: string, otherUserId: string) => await repository.accessChat(loggedInUserId, otherUserId);
    
        const createChat = async(loggedInUserId: string, otherUserId: string) => await repository.createChat(loggedInUserId, otherUserId);
    
        const getFullChat = async(chatId: string) => await repository.getFullChat(chatId);

        const fetchChats = async(userId: string) => await repository.fetchChats(userId);

        const createGroupChat = async(users: string[], name: string) => await repository.createGroupChat(users, name);

        const renameGroupChat = async(chatId: string, name: string) => await repository.renameGroupChat(chatId, name);

        const addToGroup = async(chatId: string, userId: string) => await repository.addToGroup(chatId, userId);

        const removeFromGroup = async(chatId: string, userId: string) => await repository.removeFromGroup(chatId, userId);
    
        return {
            accessChat,
            createChat,
            getFullChat,
            fetchChats,
            createGroupChat,
            renameGroupChat,
            addToGroup,
            removeFromGroup,
        }
}

export type ChatDbRepository = typeof chatDbRepository;