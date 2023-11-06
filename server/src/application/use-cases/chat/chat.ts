import { ChatDbRepository } from "../../repositories/chatDbRepository";
import AppError from "../../../utils/appError";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";

export const handleAccessOrCreateChat = async (
  loggedInUserId: string,
  otherUserId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
    try{
        let chat = await chatDbRepository.accessChat(loggedInUserId, otherUserId);
        if (!chat) {
         const newChat = await chatDbRepository.createChat(loggedInUserId, otherUserId);
         chat = await chatDbRepository.getFullChat(newChat._id);
        }
        return chat;
    }
    catch(err){
        console.log(err);
        throw new AppError("Error in accessing or creating chat", HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const handleFetchChats = async (
  userId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
    try{
        const chats = await chatDbRepository.fetchChats(userId);
        return chats;
    }
    catch(err){
        console.log(err);
        throw new AppError("Error in fetching chats", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

