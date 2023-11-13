import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setSelectedChat } from "../../Redux/ChatSlice";
import { TOAST_ACTION } from "../../Constants/common";
import { toast } from "react-toastify";
import { fetchChats } from "../../API/Chat";
import classnames from "classnames";
import SideDrawer from "./SideDrawer";
import { Button } from "@material-tailwind/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ChatLoading from "../Skeletons/ChatLoading";
import { getSender } from "../../utils/Config/getSenderInChat";

//importing types
import { StoreType } from "../../Redux/Store";
import { ChatInterface } from "../../Types/chat";
import CreateGroupDialog from "./CreateGroupDialog";

const MyChats = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch();
  const chats = useSelector((state: StoreType) => state.chat.chats);
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const [openCreateGroupDialog, SetOpenCreateGroupDialog] =
    useState<boolean>(false);
  const handleCreateGroupDialog = () => SetOpenCreateGroupDialog((cur) => !cur);

  useEffect(() => {
    fetchUserChats();
  }, []);

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
    <div className="flex flex-col justify-between p-4 gap-8">
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
          />
          <SideDrawer userId={userId} />
        </div>
      </header>
      <div className="flex flex-col gap-4 overflow-y-scroll no-scrollbar">
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
                    src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
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
                      message
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
                        : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
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
                      message
                    </span>
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyChats;
