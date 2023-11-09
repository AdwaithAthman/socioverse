import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { useState } from "react";
import classnames from "classnames";
import { toast } from "react-toastify";
import { searchUsers } from "../../API/Profile";
import { User } from "../../Types/loginUser";
import ChatLoading from "../Skeletons/ChatLoading";
import { TOAST_ACTION } from "../../Constants/common";
import { fetchOtherUserChat } from "../../API/Chat";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setSelectedChat } from "../../Redux/ChatSlice";
import { StoreType } from "../../Redux/Store";
import { BiSearchAlt } from "react-icons/bi";

const SideDrawer = ({ userId }: { userId: string }) => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const dispatch = useDispatch();
  const chats = useSelector((state: StoreType) => state.chat.chats);

  const handlePopoverOpen = () => {
    console.log("popover open: ", popoverOpen);
    setPopoverOpen((prev) => !prev);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchUsers(search);
      setLoading(false);
      if (response.users.length === 0) {
        toast.dismiss();
        toast.error("No user found", TOAST_ACTION);
      }
      setSearchResult(response.users);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Failed to load search results", TOAST_ACTION);
    }
  };

  const handleAccessChat = async (otherUserId: string) => {
    try {
      setLoadingChat(true);
      const response = await fetchOtherUserChat(otherUserId);
      if (!chats.find((chat) => chat._id === response.chat._id))
        dispatch(setChats([response.chat, ...chats]));
      dispatch(setSelectedChat(response.chat));
      closePopover();
      setLoadingChat(false);
    } catch (err) {
      toast.error("Error fetching the chat", TOAST_ACTION);
    }
  };

  const closePopover = () => {
    const popoverButton = document.getElementById("popover-button");
    if (popoverButton) {
      popoverButton.click();
    }
  };

  return (
    <>
      <Popover placement="bottom-end" dismiss={{ enabled: false }}>
        <PopoverHandler onClick={handlePopoverOpen}>
          <div
            id="popover-button"
            className={classnames(
              "flex justify-center items-center w-9 h-9 rounded-full hover:bg-blue-gray-100 transition duration-100 ease-in-out group cursor-pointer border border-blue-gray-800 hover:border-2",
              { "bg-blue-gray-100 border-2": popoverOpen },
              { "bg-white border": !popoverOpen }
            )}
          >
            <BiSearchAlt
              className={classnames(
                "group-hover:text-blue-gray-800 text-2xl font-bold",
                { "text-blue-gray-800": popoverOpen },
                { "text-blue-gray-500": !popoverOpen }
              )}
            />
          </div>
        </PopoverHandler>
        <PopoverContent className="max-h-[70vh] lg:max-h-[75vh] bg-gray-400 w-[20rem] overflow-y-scroll no-scrollbar">
          <div className="p-5 bg-white rounded-lg h-full w-full">
            <div
              className={classnames(
                "relative flex w-full",
                { "mb-4": searchResult.length > 0 },
                { "mb-0": searchResult.length === 0 }
              )}
            >
              <Input
                type="text"
                label="Search User"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <Button
                size="sm"
                disabled={!search.trim()}
                className={classnames(
                  "!absolute right-1 top-1 rounded",
                  { "bg-socioverse-400": search },
                  { "bg-blue-gray-300": !search }
                )}
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
            {loading ? (
              <div className="overflow-y-hidden flex flex-col gap-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <ChatLoading key={index} />
                  ))}
              </div>
            ) : (
              searchResult.map(
                (user) =>
                  user._id !== userId && (
                    <div
                      className="flex w-60 px-4 py-2 mb-5 items-center justify-between transition duration-100 
                  ease-in-out rounded-lg shadow-md hover:scale-105 hover:rounded-lg cursor-pointer bg-[#E8E8E8] hover:bg-[#38b2accd] group"
                      onClick={() => handleAccessChat(user._id as string)}
                      key={user._id}
                    >
                      <div className="s) => setLimt-3 flex items-center space-x-2">
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          src={
                            user.dp
                              ? user.dp
                              : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                          }
                          alt="user dp"
                        />
                        <span className="flex flex-col">
                          <span className="text-[14px] font-medium text-gray-900 group-hover:text-white group-hover:font-bold">
                            {user.name}
                          </span>
                          <span className="text-[11px] font-medium text-gray-500 group-hover:text-white group-hover:font-bold">
                            @{user.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  )
              )
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SideDrawer;
