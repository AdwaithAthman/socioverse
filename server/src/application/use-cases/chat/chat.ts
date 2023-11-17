import { ChatDbRepository } from "../../repositories/chatDbRepository";
import AppError from "../../../utils/appError";

//importing from types
import { HttpStatus } from "../../../types/httpStatus";
import { EditChatInterface } from "../../../types/chatInterface";
import { CloudinaryServiceInterface } from "../../services/cloudinaryServiceInterface";

export const handleAccessOrCreateChat = async (
  loggedInUserId: string,
  otherUserId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try {
    let chat = await chatDbRepository.accessChat(loggedInUserId, otherUserId);
    if (!chat) {
      const newChat = await chatDbRepository.createChat(loggedInUserId, otherUserId);
      chat = await chatDbRepository.getFullChat(newChat._id);
    }
    return chat;
  }
  catch (err) {
    console.log(err);
    throw new AppError("Error in accessing or creating chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleFetchChats = async (
  userId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try {
    const chats = await chatDbRepository.fetchChats(userId);
    return chats;
  }
  catch (err) {
    console.log(err);
    throw new AppError("Error in fetching chats", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleCreateGroupChat = async (
  userId: string,
  users: string[],
  name: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try {
    users.unshift(userId)
    if (users.length < 2) throw new AppError("Atleast 2 users are required to form a group chat", HttpStatus.BAD_REQUEST);
    const createdGroupChat = await chatDbRepository.createGroupChat(users, name);
    const groupChat = await chatDbRepository.getFullChat(createdGroupChat._id);
    return groupChat;
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      if (err.message === "Atleast 2 users are required to form a group chat") {
        throw err;
      }
    }
    throw new AppError("Error in creating group chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleRenameGroupChat = async (
  chatId: string,
  name: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try {
    const updatedChat = await chatDbRepository.renameGroupChat(chatId, name);
    return updatedChat;
  }
  catch (err) {
    console.log(err);
    throw new AppError("Error in renaming group chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleAddToGroup = async (
  chatId: string,
  newUserId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try{
    const updatedChat = await chatDbRepository.addToGroup(chatId, newUserId);
    return updatedChat;
  }
  catch(err){
    console.log(err);
    throw new AppError("Error in adding user to group chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleRemoveFromGroup = async (
  chatId: string,
  removeUserId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try{
    const updatedChat = await chatDbRepository.removeFromGroup(chatId, removeUserId);
    return updatedChat;
  }
  catch(err){
    console.log(err);
    throw new AppError("Error in removing user from group chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleUpdateGroup = async (
  groupId: string,
  data: EditChatInterface,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try{
    if(data.users){
      if(data.users.length < 2) throw new AppError("Atleast 2 users are required to form a group chat", HttpStatus.BAD_REQUEST);
    }
    const updatedChat = await chatDbRepository.updateGroup(groupId, data);
    return updatedChat;
  }
  catch(err){
    if (err instanceof Error) {
      console.log(err.message);
      if (err.message === "Atleast 2 users are required to form a group chat") {
        throw err;
      }
    }
    throw new AppError("Error in updating group chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleGroupRemove = async (
  chatId: string,
  chatDbRepository: ReturnType<ChatDbRepository>
) => {
  try{
    await chatDbRepository.groupRemove(chatId);
  }
  catch(err){
    console.log(err);
    throw new AppError("Error in deleting group chat", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const handleAddGroupDp = async (
  chatId: string,
  buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
  mimetype: string,
  chatDbRepository: ReturnType<ChatDbRepository>,
  cloudinaryService: ReturnType<CloudinaryServiceInterface>
) => {
  try{
    const b64 = Buffer.from(buffer).toString("base64");
    let dataURI = "data:" + mimetype + ";base64," + b64;
    const cldRes = await cloudinaryService.handleUpload(dataURI);
    const updatedChat = await chatDbRepository.addGroupDp(chatId, cldRes.secure_url);
    return updatedChat;
  }
  catch(err){
    console.log("error at handleAddGroupDp: ", err);
    throw new AppError("Error in adding group dp", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

