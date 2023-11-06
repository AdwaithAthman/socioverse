import { ChatRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/chatRepositoryMongoDB";

export const chatDbRepository = (repository: ReturnType<ChatRepositoryMongoDB>) => {
    
        const accessChat = async(loggedInUserId: string, otherUserId: string) => await repository.accessChat(loggedInUserId, otherUserId);
    
        const createChat = async(loggedInUserId: string, otherUserId: string) => await repository.createChat(loggedInUserId, otherUserId);
    
        const getFullChat = async(chatId: string) => await repository.getFullChat(chatId);

        const fetchChats = async(userId: string) => await repository.fetchChats(userId);

        const createGroupChat = async(users: string[], name: string) => await repository.createGroupChat(users, name);
    
        return {
            accessChat,
            createChat,
            getFullChat,
            fetchChats,
            createGroupChat,
        }
}

export type ChatDbRepository = typeof chatDbRepository;