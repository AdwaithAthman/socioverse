import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Chip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { User } from "../../Types/loginUser";
import { searchUsers } from "../../API/Profile";
import { ToastContainer, toast } from "react-toastify";
import { TOAST_ACTION } from "../../Constants/common";
import ChatLoading from "../Skeletons/ChatLoading";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { createGroupChat } from "../../API/Chat";
import { setChats } from "../../Redux/ChatSlice";

function CreateGroupDialog({
  openCreateGroupDialog,
  handleCreateGroupDialog,
}: {
  openCreateGroupDialog: boolean;
  handleCreateGroupDialog: () => void;
}) {
  const dispatch = useDispatch();
  const userId = useSelector((state: StoreType) => state.auth.user?._id);
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const chats = useSelector((state: StoreType) => state.chat.chats);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performSearch = async () => {
      try {
        setLoading(true);
        const response = await searchUsers(search);
        setLoading(false);
        setSearchResult(response.users);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error("Failed to load search results", TOAST_ACTION);
      }
    };

    if (search.length > 0) {
      timer = setTimeout(performSearch, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.dismiss();
      toast.warn("User already added", TOAST_ACTION);
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete: User) => {
    setSelectedUsers(selectedUsers.filter((user) => user !== userToDelete));
  };

  const handleSubmit = async () => {
    if (!groupChatName.trim() || !selectedUsers) {
      toast.dismiss();
      toast.warn("Please fill all the fields", TOAST_ACTION);
      return;
    }
    try {
      const response = await createGroupChat(groupChatName, selectedUsers);
      dispatch(setChats([response.groupChat, ...chats]));
      toast.dismiss();
      toast.success("Group created successfully", TOAST_ACTION);
      setGroupChatName("");
      setSelectedUsers([]);
      handleCreateGroupDialog();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to create group", TOAST_ACTION);
    }
  };

  return (
    <>
      <Dialog
        size="xs"
        dismiss={{
          enabled: false,
        }}
        open={openCreateGroupDialog}
        handler={handleCreateGroupDialog}
        className="bg-transparent shadow-none"
      >
        <ToastContainer />
        <Card className="mx-auto w-full ">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography variant="h4" color="blue-gray">
                Create Group
              </Typography>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer text-black"
                onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                  e.stopPropagation();
                  setSelectedUsers([]);
                  handleCreateGroupDialog();
                }}
              />
            </div>
            <Typography className="-mb-2" variant="h6">
              Group Name
            </Typography>
            <Input
              label="Enter the name"
              size="lg"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Typography className="-mb-2" variant="h6">
              Add Members
            </Typography>
            <Input
              label="Enter the members"
              size="lg"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-36 overflow-y-scroll flex items-center justify-center flex-wrap gap-2 no-scrollbar">
              {selectedUsers.map((user) => (
                <div key={user._id}>
                  <Chip
                    variant="ghost"
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: 50 },
                    }}
                    value={user.name}
                    onClose={() => handleDelete(user)}
                    className="rounded-full"
                    color="green"
                  />
                </div>
              ))}
            </div>
            {loading ? (
              <div className="overflow-y-hidden flex flex-col gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <ChatLoading key={index} />
                  ))}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-scroll overflow-x-hidden no-scrollbar mx-4">
                {searchResult?.slice(0, 4).map(
                  (user) =>
                    user._id !== userId && (
                      <div
                        className="flex w-full px-4 py-2 mb-5 items-center justify-between transition duration-100 
                                    ease-in-out rounded-lg shadow-md hover:scale-95 hover:rounded-lg cursor-pointer 
                                    bg-[#E8E8E8] hover:bg-[#38b2accd] group"
                        onClick={() => handleGroup(user)}
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
                )}
              </div>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={handleSubmit} className="float-right bg-socioverse-400 rounded-full">
              Create Chat
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

export default CreateGroupDialog;
