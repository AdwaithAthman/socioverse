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
          chat = await chatDbRepository.createChat(loggedInUserId, otherUserId);
        }
        return chat;
    }
    catch(err){
        console.log(err);
        throw new AppError("Error in accessing or creating chat", HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
