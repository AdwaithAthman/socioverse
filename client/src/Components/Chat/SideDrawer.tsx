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

const SideDrawer = ({ userId }: { userId: string }) => {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<any>();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchUsers(search);
      setLoading(false);
      setSearchResult(response.users);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load search results", TOAST_ACTION);
    }
  };

  const handleAccessChat = async (otherUserId: string) => {
    try {
      setLoadingChat(true);
      const response = await fetchOtherUserChat(otherUserId);
      setSelectedChat(response.chat);
      setLoadingChat(false);
    } catch (err) {
      toast.error("Error fetching the chat", TOAST_ACTION);
    }
  };

  return (
    <>
      <Popover placement="bottom-end">
        <PopoverHandler>
          <Button>Popover</Button>
        </PopoverHandler>
        <PopoverContent className="h-[80vh] bg-black bg-opacity-20 w-[20rem]">
          <div className="p-5 bg-white rounded-lg h-full w-full">
            <div className="relative flex w-full mb-4">
              <Input
                type="text"
                label="Search User"
                value={search}
                onChange={(e) => setSearch(e.target.value.trim())}
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <Button
                size="sm"
                disabled={!search}
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
                {Array(7)
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
                  ease-in-out rounded-lg shadow-md hover:scale-105 hover:rounded-lg cursor-pointer bg-[#E8E8E8] hover:bg-[#38b2acaf] group"
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
