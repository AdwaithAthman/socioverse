import { MessageRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/messageRepositoryMongoDB";
import { MessageInterface } from "../../types/messageInterface";

export const messageDbRepository = (repository: ReturnType<MessageRepositoryMongoDB>) => {

    const sendMessage = async(newMessage: MessageInterface) => await repository.sendMessage(newMessage);

    const getFullMessage = async(messageId: string) => await repository.getFullMessage(messageId);

    const getAllMessagesFromChat = async(chatId: string) => await repository.getAllMessagesFromChat(chatId);

    const fetchNotifications = async(notificationIds: string[]) => await repository.fetchNotifications(notificationIds);

    return {
        sendMessage,
        getFullMessage,
        getAllMessagesFromChat,
        fetchNotifications,
    }
}

export type MessageDbRepository = typeof messageDbRepository;