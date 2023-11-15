import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Typography,
} from "@material-tailwind/react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { StoreType } from "../../Redux/Store";
import { getSender } from "../../utils/Config/chatMethods";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";
import AdminGroupEdit from "./AdminGroupEdit";
import { useState } from "react";
import { groupRemove, removeFromGroup } from "../../API/Chat";
import { useDispatch } from "react-redux";
import { setChats, setSelectedChat } from "../../Redux/ChatSlice";
import ConfirmDeleteToast from "../../utils/customToasts/confirmDeleteToast";
import { TOAST_ACTION } from "../../Constants/common";

const OptionsDialog = ({
  openOptions,
  handleOpenOptions,
}: {
  openOptions: boolean;
  handleOpenOptions: () => void;
}) => {
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const userId = useSelector((state: StoreType) => state.auth.user?._id);
  const chats = useSelector((state: StoreType) => state.chat.chats);
  const [updateGroup, setUpdateGroup] = useState<boolean>(false);
  const [disableUpdate, setDisableUpdate] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleRemoveFromGroup = async () => {
    toast.dismiss();
    toast(
      <ConfirmDeleteToast
        onDelete={confirmLeaveGroup}
        message={"Are you sure you want to leave this Group?"}
      />,
      { ...TOAST_ACTION, closeButton: false }
    );
  };

  const confirmLeaveGroup = async () => {
    const response =
      selectedChat &&
      userId &&
      (await removeFromGroup(selectedChat?._id, userId));
    if (response && response?.status === "success") {
      toast.dismiss();
      dispatch(setSelectedChat(""));
      dispatch(setChats(chats.filter((chat) => chat._id !== selectedChat?._id)));
      toast.success("Successfully left the group");
      handleOpenOptions();
    }
  };

  const handleGroupRemove = async () => {
    toast.dismiss();
    toast(
        <ConfirmDeleteToast
          onDelete={confirmDeleteGroup}
          message={"Are you sure you want to delete this group?"}
        />,
        { ...TOAST_ACTION, closeButton: false }
      );
  };

  const confirmDeleteGroup = async () => {
    const response =
      selectedChat &&
      (await groupRemove(selectedChat?._id));
    if (response && response?.status === "success") {
      toast.dismiss();
      dispatch(setSelectedChat(""));
      dispatch(setChats(chats.filter((chat) => chat._id !== selectedChat?._id)));
      toast.success("Successfully deleted the group");
      handleOpenOptions();
    }
  }

  return (
    <>
      <Dialog
        size="xs"
        dismiss={{
          enabled: false,
        }}
        open={openOptions}
        handler={handleOpenOptions}
        className="bg-transparent shadow-none"
      >
        <ToastContainer />
        <Card className="mx-auto w-full ">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium text-black">
                {selectedChat?.isGroupChat
                  ? selectedChat.chatName
                  : "User Info"}
              </h1>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer text-black"
                onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                  e.stopPropagation();
                  handleOpenOptions();
                }}
              />
            </div>
            {selectedChat && !selectedChat.isGroupChat ? (
              <div className="relative h-60 md:h-80 w-60 md:w-80 rounded-md mx-auto overflow-hidden">
                <img
                  src={
                    userId && getSender(userId, selectedChat.users).dp
                      ? getSender(userId, selectedChat.users).dp
                      : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                  }
                  alt="user dp"
                  className="z-0 h-full w-full rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-left">
                  <h1 className="text-lg font-semibold text-white">
                    {userId && getSender(userId, selectedChat.users).name}
                  </h1>
                  <h1 className="text-xs font-light text-white">
                    @{userId && getSender(userId, selectedChat.users).username}
                  </h1>
                  <Link
                    to={`/profile/${
                      userId && getSender(userId, selectedChat.users)._id
                    }`}
                  >
                    <button className="mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-white">
                      View Profile &rarr;
                    </button>
                  </Link>
                </div>
              </div>
            ) : selectedChat?.groupAdmin._id === userId ? (
              <AdminGroupEdit
                updateGroup={updateGroup}
                setUpdateGroup={setUpdateGroup}
                handleOpenOptions={handleOpenOptions}
                setDisableUpdate={setDisableUpdate}
              />
            ) : (
              <div className="max-h-96 overflow-y-scroll overflow-x-hidden no-scrollbar mx-4">
                <div className="flex gap-2 items-center mb-2">
                  <h1 className="text-lg font-medium">Admin</h1>
                  <span
                    className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs 
                        font-bold leading-none text-white bg-socioverse-400 rounded-full"
                  >
                    {selectedChat &&
                      selectedChat?.users.filter(
                        (user) => user._id === selectedChat.groupAdmin._id
                      ).length}
                  </span>
                </div>
                {selectedChat?.users.map(
                  (user) =>
                    user._id === selectedChat.groupAdmin._id && (
                      <UserCard user={user} key={user._id} />
                    )
                )}
                <div className="flex gap-2 items-center mb-2">
                  <h1 className="text-lg font-medium">Members</h1>
                  <span
                    className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs 
                        font-bold leading-none text-white bg-socioverse-400 rounded-full"
                  >
                    {selectedChat &&
                      selectedChat?.users.filter(
                        (user) => user._id !== selectedChat.groupAdmin._id
                      ).length}
                  </span>
                </div>
                {selectedChat?.users.map(
                  (user) =>
                    user._id !== selectedChat.groupAdmin._id && (
                      <UserCard user={user} key={user._id} />
                    )
                )}
              </div>
            )}
          </CardBody>
          {selectedChat?.isGroupChat && (
            <CardFooter className="pt-0">
              {selectedChat.groupAdmin._id === userId ? (
                <div className="flex items-center justify-between gap-2 float-right">
                  <Button
                    className=" rounded-full text-black border-black hover:border-2 "
                    variant="outlined"
                    onClick={() => setUpdateGroup(true)}
                    disabled={disableUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    className=" bg-socioverse-400 rounded-full"
                    onClick={handleGroupRemove}
                  >
                    Leave
                  </Button>
                </div>
              ) : (
                <Button
                  className="float-right bg-socioverse-400 rounded-full"
                  onClick={handleRemoveFromGroup}
                >
                  Leave Group
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </Dialog>
    </>
  );
};

export default OptionsDialog;
