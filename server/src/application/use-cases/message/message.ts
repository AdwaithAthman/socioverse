import { ChatDbRepository } from "../../repositories/chatDbRepository";
import { MessageDbRepository } from "../../repositories/messageDbRepository";
import AppError from "../../../utils/appError";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";

export const handleSendMessage = async (
    message: { content: string; chatId: string; userId: string },
    messageDbRepository: ReturnType<MessageDbRepository>,
    chatDbRepository: ReturnType<ChatDbRepository>
) => {
    try {
        if (!message.content.trim() || !message.chatId) {
            throw new AppError("Invalid message", HttpStatus.BAD_REQUEST);
        }
        const newMessage = {
            content: message.content,
            chat: message.chatId,
            sender: message.userId,
        }
        const createdMessage = await messageDbRepository.sendMessage(newMessage);
        const fullMessage = await messageDbRepository.getFullMessage(createdMessage._id);
        fullMessage && await chatDbRepository.setLatestMessage(message.chatId, fullMessage._id)
        return fullMessage;
    }
    catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
            if (err.message === "Invalid message") {
                throw err;
            }
        }
        throw new AppError("Error in sending message", HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const handleGetAllMessagesFromChat = async (
    chatId: string,
    messageDbRepository: ReturnType<MessageDbRepository>
) => {
    try{
        const messages = await messageDbRepository.getAllMessagesFromChat(chatId);
        return messages;
    }
    catch(err){
        console.log(err);
        throw new AppError("Error in getting messages", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
