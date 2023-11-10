import { Chip, Input, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { useEffect, useState } from "react";
import { User } from "../../Types/loginUser";
import ChatLoading from "../Skeletons/ChatLoading";
import { toast } from "react-toastify";
import { TOAST_ACTION } from "../../Constants/common";
import { searchUsers } from "../../API/Profile";
import UserCard from "./UserCard";
import { updateGroupChat } from "../../API/Chat";
import { setSelectedChat } from "../../Redux/ChatSlice";
import { AxiosError, isAxiosError } from "axios";
import { AxiosErrorData } from "../../Types/axiosErrorData";

const AdminGroupEdit = ({
  updateGroup,
  setUpdateGroup,
  handleOpenOptions,
  setDisableUpdate,
}: {
  updateGroup: boolean;
  setUpdateGroup: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenOptions: () => void;
  setDisableUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const userId = useSelector((state: StoreType) => state.auth.user?._id);

  const [groupChatName, setGroupChatName] = useState<string>(
    selectedChat?.chatName ?? ""
  );
  const [search, setSearch] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    selectedChat?.users ?? []
  );
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FormData>(new FormData());
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      selectedChat?.chatName === groupChatName &&
      selectedChat?.users === selectedUsers
    ) {
      setDisableUpdate(true);
    } else {
      setDisableUpdate(false);
    }
  }, [groupChatName, selectedUsers]);

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

  useEffect(() => {
    if (updateGroup) {
      handleUpdate();
    }
  }, [setUpdateGroup, updateGroup]);

  const handleUpdate = async () => {
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      toast.dismiss();
      toast.error("Fields cannot be empty", TOAST_ACTION);
      return;
    }
    if (groupChatName !== selectedChat?.chatName) {
      data.append("chatName", groupChatName);
    }
    if (selectedUsers !== selectedChat?.users) {
      const userIds = selectedUsers.map((user) => user._id);
      data.append("users", JSON.stringify(userIds));
    }
    try {
      const response =
        selectedChat && (await updateGroupChat(selectedChat?._id, data));
      if (response && response.status === "success") {
        toast.dismiss();
        toast.success("Group updated successfully", TOAST_ACTION);
        dispatch(setSelectedChat(response.groupChat));
        setUpdateGroup(false);
        setData(new FormData());
        handleOpenOptions();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update group", TOAST_ACTION);
    }
  };

  const handleDelete = (userToDelete: User) => {
    setSelectedUsers(selectedUsers.filter((user) => user !== userToDelete));
  };

  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast.dismiss();
      toast.warn("User already added", TOAST_ACTION);
      return;
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

  return (
    <>
      <Typography className="-mb-2" variant="h6">
        Group Name
      </Typography>
      <Input
        label="Enter the name"
        size="lg"
        value={groupChatName}
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
        {selectedUsers.map(
          (user) =>
            user._id !== userId && (
              <div key={`selected-${user._id}`}>
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
            )
        )}
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
                  className="w-full"
                  onClick={() => handleGroup(user)}
                  key={`search-${user._id}`}
                >
                  <UserCard user={user} />
                </div>
              )
          )}
        </div>
      )}
    </>
  );
};

export default AdminGroupEdit;
