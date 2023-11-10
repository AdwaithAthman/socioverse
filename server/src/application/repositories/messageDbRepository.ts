import { MessageRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/messageRepositoryMongoDB";
import { MessageInterface } from "../../types/messageInterface";

export const messageDbRepository = (repository: ReturnType<MessageRepositoryMongoDB>) => {

    const sendMessage = async(newMessage: MessageInterface) => await repository.sendMessage(newMessage);
    const getFullMessage = async(messageId: string) => await repository.getFullMessage(messageId);
    const getAllMessagesFromChat = async(chatId: string) => await repository.getAllMessagesFromChat(chatId);

    return {
        sendMessage,
        getFullMessage,
        getAllMessagesFromChat,
    }
}

export type MessageDbRepository = typeof messageDbRepository;