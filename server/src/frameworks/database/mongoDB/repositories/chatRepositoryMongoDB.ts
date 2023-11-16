import Chat from "../models/chatModel";

export const chatRepositoryMongoDB = () => {

  const accessChat = async (loggedInUserId: string, otherUserId: string) => {
    try {
      const chat = await Chat.findOne({
        isGroupChat: false,
        isDeleted: false,
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
        .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
        .populate("latestMessage")
        .populate("latestMessage.sender", "name username email dp");
        // .populate({
        //   path: 'latestMessage',
        //   populate: {
        //     path: 'sender'
        //   }
        // })

      return chat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in accessing chat");
    }
  };

  const createChat = async (loggedInUserId: string, otherUserId: string) => {
    try {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [loggedInUserId, otherUserId],
      };
      const createdChat = await Chat.create(chatData);
      return createdChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating chat");
    }
  };

  const getFullChat = async (chatId: string) => {
    try {
      const fullChat = await Chat.findOne({ _id: chatId, isDeleted: false })
        .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
        .populate("groupAdmin", "name dp username email _id");

      return fullChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in getting full chat");
    }
  };

  const fetchChats = async (userId: string) => {
    const chats = await Chat.find({
      isDeleted: false,
      users: {
        $elemMatch: {
          $eq: userId,
        },
      },
    })
      .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
      .populate("groupAdmin", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name username email dp")
      .sort({ updatedAt: -1 });

    return chats;
  };

  const createGroupChat = async (users: string[], name: string) => {
    try {
      const groupChatData = {
        chatName: name,
        isGroupChat: true,
        users: users,
        groupAdmin: users[0],
      };
      const groupChat = await Chat.create(groupChatData);
      return groupChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating group chat");
    }
  };

  const renameGroupChat = async (chatId: string, name: string) => {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName: name,
        },
        {
          new: true,
        }
      )
        .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
        .populate("groupAdmin", "name dp username email _id");

      return updatedChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in renaming group chat");
    }
  };

  const addToGroup = async (chatId: string, userId: string) => {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $addToSet: {
            users: userId,
          },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
        .populate("groupAdmin", "name dp username email _id");
      return updatedChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in adding user to group");
    }
  };

  const removeFromGroup = async (chatId: string, userId: string) => {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: {
            users: userId,
          },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
        .populate("groupAdmin", "name dp username email _id");
      return updatedChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in removing user from group");
    }
  };

  const updateGroup = async (chatId: string, data: any) => {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(chatId, data, {
        new: true,
      })
        .populate("users", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
        .populate("groupAdmin", "name dp username email _id");
      return updatedChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in updating group");
    }
  };

  const groupRemove = async (chatId: string) => {
    try {
      await Chat.findByIdAndUpdate(chatId, {
        $set: {
          isDeleted: true,
        }
      })
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in deleting group");
    }
  }

  const setLatestMessage = async (chatId: string, messageId: string) => {
    try{
      await Chat.findByIdAndUpdate(chatId, {
        $set: {
          latestMessage: messageId,
        }
      })
    }
    catch(err){
      console.log(err);
      throw new Error("Error in setting latest message");
    }
  }

  return {
    accessChat,
    createChat,
    getFullChat,
    fetchChats,
    createGroupChat,
    renameGroupChat,
    addToGroup,
    removeFromGroup,
    updateGroup,
    groupRemove,
    setLatestMessage,
  };
};

export type ChatRepositoryMongoDB = typeof chatRepositoryMongoDB;
