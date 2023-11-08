import Chat from "../models/chatModel";
import Message from "../models/messageModel";

export const chatRepositoryMongoDB = () => {
  const accessChat = async (loggedInUserId: string, otherUserId: string) => {
    try {
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
        .populate("users", "-password -savedPosts -posts")
        .populate("latestMessage")
        .populate("latestMessage.sender", "name username email dp");

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
      const fullChat = await Chat.findOne({ _id: chatId })
        .populate("users", "-password -savedPosts -posts")
        .populate("groupAdmin", "name dp username email _id");

      return fullChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in getting full chat");
    }
  };

  const fetchChats = async (userId: string) => {
    const chats = await Chat.find({
      users: {
        $elemMatch: {
          $eq: userId,
        },
      },
    })
      .populate("users", "-password -savedPosts -posts")
      .populate("groupAdmin", "-password -savedPosts -posts")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name username email dp")
      .sort({ updatedAt: -1 });

    return chats;
  };

  const createGroupChat = async (users: string[], name: string) => {
    try {
      const groupChatData = {
        chatName: "Group Chat",
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
        .populate("users", "-password -savedPosts -posts")
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
        .populate("users", "-password -savedPosts -posts")
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
        .populate("users", "-password -savedPosts -posts")
        .populate("groupAdmin", "name dp username email _id");
      return updatedChat;
    } catch (err) {
      console.log(err);
      throw new Error("Error in removing user from group");
    }
  };

  return {
    accessChat,
    createChat,
    getFullChat,
    fetchChats,
    createGroupChat,
    renameGroupChat,
    addToGroup,
    removeFromGroup,
  };
};

export type ChatRepositoryMongoDB = typeof chatRepositoryMongoDB;
