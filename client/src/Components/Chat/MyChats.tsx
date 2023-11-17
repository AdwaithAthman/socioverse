import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setFetchUserChatsAgain, setSelectedChat } from "../../Redux/ChatSlice";
import common, { TOAST_ACTION } from "../../Constants/common";
import { toast } from "react-toastify";
import { fetchChats } from "../../API/Chat";
import classnames from "classnames";
import SideDrawer from "./SideDrawer";
import { Button } from "@material-tailwind/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ChatLoading from "../Skeletons/ChatLoading";
import { getSender, truncate } from "../../utils/Config/chatMethods";

//importing types
import { StoreType } from "../../Redux/Store";
import { ChatInterface } from "../../Types/chat";
import CreateGroupDialog from "./CreateGroupDialog";
import { Socket } from "socket.io-client";

const MyChats = ({
  userId,
  socket
}: {
  userId: string;
  socket: Socket;
}) => {
  const dispatch = useDispatch();
  const chats = useSelector((state: StoreType) => state.chat.chats);
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const fetchUserChatsAgain = useSelector((state: StoreType) => state.chat.fetchUserChatsAgain);
  const [openCreateGroupDialog, SetOpenCreateGroupDialog] =
    useState<boolean>(false);
  const handleCreateGroupDialog = () => SetOpenCreateGroupDialog((cur) => !cur);

  useEffect(() => {
    fetchUserChats();
    if (fetchUserChatsAgain) {
      dispatch(setFetchUserChatsAgain(false));
    }
  }, [fetchUserChatsAgain]);

  useEffect(() => {
    if(socket){
    socket.on("group updated", () => {
      fetchUserChats();
    })
  }
  })

  const fetchUserChats = async () => {
    try {
      const response = await fetchChats();
      dispatch(setChats(response.chats));
    } catch (err) {
      toast.dismiss();
      toast.error("Error fetching chats", TOAST_ACTION);
    }
  };

  const handleSelectChat = (chat: ChatInterface) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <>
      <div className="flex flex-col justify-between p-4 gap-8 h-full">
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">My Chats</h1>
          <div className="flex items-center justify-between gap-3">
            <Button
              className="flex items-center justify-between rounded-full bg-socioverse-400 gap-1"
              size="sm"
              onClick={handleCreateGroupDialog}
            >
              <h1>Add Group</h1>
              <AiOutlinePlusCircle className="font-extrabold text-lg" />
            </Button>
            <CreateGroupDialog
              openCreateGroupDialog={openCreateGroupDialog}
              handleCreateGroupDialog={handleCreateGroupDialog}
              socket={socket}
            />
            <SideDrawer userId={userId} />
          </div>
        </header>
        <div className="flex flex-col gap-4 h-full overflow-y-scroll no-scrollbar ">
          {chats.length === 0 ? (
            <div className="overflow-y-hidden flex flex-col gap-4 w-full">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <ChatLoading key={index} />
                ))}
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={classnames(
                  "flex items-center justify-between py-2 px-2 md:px-4 rounded-xl cursor-pointer shadow-sm hover:bg-blue-gray-600  group",
                  { "bg-blue-gray-600/90 ": selectedChat?._id === chat._id },
                  { "bg-gray-100": selectedChat?._id !== chat._id }
                )}
                onClick={() => handleSelectChat(chat)}
              >
                {chat.isGroupChat ? (
                  <div className="s) => setLimt-3 flex items-center space-x-2 ">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={chat.groupDp}
                      alt="group dp"
                    />
                    <span className="flex flex-col">
                      <span
                        className={classnames(
                          "text-[14px] group-hover:font-bold group-hover:text-white",
                          {
                            "text-white font-bold":
                              selectedChat?._id === chat._id,
                          },
                          {
                            "text-gray-900 font-medium":
                              selectedChat?._id !== chat._id,
                          }
                        )}
                      >
                        {chat.chatName}
                      </span>
                      <span
                        className={classnames(
                          "text-[11px] group-hover:font-bold group-hover:text-white",
                          {
                            "text-white font-bold":
                              selectedChat?._id === chat._id,
                          },
                          {
                            "text-gray-500 font-medium":
                              selectedChat?._id !== chat._id,
                          }
                        )}
                      >
                        {chat.latestMessage ? (
                          <>
                            {/* <span className="font-bold">
                              {chat.latestMessage.sender?.name} :{" "}
                            </span> */}
                            {truncate(chat.latestMessage.content, 20)}
                          </>
                        ) : (
                          " no message"
                        )}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="s) => setLimt-3 flex items-center space-x-2 ">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={
                        getSender(userId, chat.users).dp
                          ? getSender(userId, chat.users).dp
                          : common.DEFAULT_IMG
                      }
                      alt="dp"
                    />
                    <span className="flex flex-col">
                      <span
                        className={classnames(
                          "text-[14px] group-hover:font-bold group-hover:text-white",
                          {
                            "text-white font-bold":
                              selectedChat?._id === chat._id,
                          },
                          {
                            "text-gray-900 font-medium":
                              selectedChat?._id !== chat._id,
                          }
                        )}
                      >
                        {getSender(userId, chat.users).name}
                      </span>
                      <span
                        className={classnames(
                          "text-[11px] group-hover:font-bold group-hover:text-white",
                          {
                            "text-white font-bold":
                              selectedChat?._id === chat._id,
                          },
                          {
                            "text-gray-500 font-medium":
                              selectedChat?._id !== chat._id,
                          }
                        )}
                      >
                        {chat.latestMessage
                          ? truncate(chat.latestMessage.content, 20)
                          : " no message"}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyChats;
