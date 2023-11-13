import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { ReactComponent as ChatSvg } from "../../assets/ChatSvg.svg";
import { getSender } from "../../utils/Config/getSenderInChat";
import { FaArrowLeft } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { setSelectedChat } from "../../Redux/ChatSlice";
import { useState } from "react";
import OptionsDialog from "./OptionsDialog";
import ChatBoxContent from "./ChatBoxContent";

const ChatBox = () => {
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const userId = useSelector((state: StoreType) => state.auth.user?._id);
  const dispatch = useDispatch();

  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const handleOpenOptions = () => setOpenOptions((cur) => !cur);

  return selectedChat ? (
    <>
      <div className="flex flex-col justify-between p-4 gap-8 h-full w-full">
        <header className="flex items-center justify-between">
          {/* <h1 className="font-medium text-2xl">
          {selectedChat.isGroupChat
            ? selectedChat.chatName
            : userId && getSender(userId, selectedChat.users).name}
        </h1> */}
          {selectedChat.isGroupChat ? (
            <div className="flex items-center justify-between gap-4">
              <img
                className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-full"
                src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                alt="group dp"
              />
              <h1 className="font-medium text-lg md:text-2xl">
                {selectedChat.chatName}
              </h1>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <img
                className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-full"
                src={
                  userId && getSender(userId, selectedChat.users).dp
                    ? getSender(userId, selectedChat.users).dp
                    : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                }
                alt="dp"
              />
              <h1 className="font-medium text-lg md:text-2xl">
                {userId && getSender(userId, selectedChat.users).name}
              </h1>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex justify-center items-center w-9 h-9 rounded-full hover:bg-blue-gray-100 transition duration-100 
          ease-in-out group cursor-pointer border border-blue-gray-800 hover:border-2"
              onClick={() => dispatch(setSelectedChat(null))}
            >
              <FaArrowLeft className="group-hover:text-blue-gray-800 text-xl font-bold text-blue-gray-500" />
            </div>
            <div
              className="flex justify-center items-center w-9 h-9 rounded-full hover:bg-blue-gray-100 transition duration-100 
          ease-in-out group cursor-pointer border border-blue-gray-800 hover:border-2"
              onClick={handleOpenOptions}
            >
              <SlOptionsVertical className="group-hover:text-blue-gray-800 text-xl font-bold text-blue-gray-500" />
            </div>
          </div>
        </header>
        <div className=" h-full w-full flex flex-col gap-4 overflow-y-scroll no-scrollbar bg-blue-gray-300/50 rounded-xl">
          <ChatBoxContent />
        </div>
      </div>
      <OptionsDialog
        openOptions={openOptions}
        handleOpenOptions={handleOpenOptions}
      />
    </>
  ) : (
    <>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <ChatSvg />
          <h1 className="font-semibold text-2xl text-blue-gray-700">
            Click on a user to start chatting !
          </h1>
        </div>
      </div>
    </>
  );
};

export default ChatBox;