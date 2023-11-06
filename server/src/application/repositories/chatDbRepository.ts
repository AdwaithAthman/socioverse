import { ChatRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB";

export const chatDbRepository = (repository: ReturnType<ChatRepositoryMongoDB>) => {
    
        const accessChat = async(loggedInUserId: string, otherUserId: string) => await repository.accessChat(loggedInUserId, otherUserId);
    
        const createChat = async(loggedInUserId: string, otherUserId: string) => await repository.createChat(loggedInUserId, otherUserId);
    
        const getFullChat = async(chatId: string) => await repository.getFullChat(chatId);
    
        return {
            accessChat,
            createChat,
            getFullChat,
        }
}

export type ChatDbRepository = typeof chatDbRepository;