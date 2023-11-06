import Chat from "../models/chatModel";
import Message from "../models/messageModel";

export const chatRepositoryMongoDB = () => {
  const accessChat = async (loggedInUserId: string, otherUserId: string) => {
    try{
        const chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
              {
                users: {
                  $elemMatch: {
                    $eq: loggedInUserId,
                  },
                },
              },
              {
                users: {
                  $elemMatch: {
                    $eq: otherUserId,
                  },
                },
              },
            ],
          })
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("latestMessage.sender", "name username email dp");
      
          return chat;
    }
    catch(err){
        console.log(err)
        throw new Error("Error in accessing chat")
    }
  };

  const createChat = async (loggedInUserId: string, otherUserId: string) => {
    try{
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [loggedInUserId, otherUserId],
          };
          const createdChat = await Chat.create(chatData);
          return createdChat;
    }
    catch(err){
        console.log(err)
        throw new Error("Error in creating chat")
    }
  };

  const getFullChat = async (chatId: string) => {
    try{
        const fullChat = await Chat.findOne({ _id: chatId })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name username email dp");
    return fullChat;
    }
    catch(err){
        console.log(err)
        throw new Error("Error in getting full chat")
    }
  };

  return {
    accessChat,
    createChat,
    getFullChat,
  };
};

export type ChatRepositoryMongoDB = typeof chatRepositoryMongoDB;
