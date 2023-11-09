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
import { ToastContainer } from "react-toastify";
import { StoreType } from "../../Redux/Store";
import { getSender } from "../../utils/Config/getSenderInChat";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";
import AdminGroupEdit from "./AdminGroupEdit";
import { useEffect, useState } from "react";

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
  const [updateGroup, setUpdateGroup] = useState<boolean>(false);
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
              <AdminGroupEdit updateGroup={updateGroup} setUpdateGroup={setUpdateGroup} handleOpenOptions={handleOpenOptions} />
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
                <Button className="float-right bg-socioverse-400 rounded-full" onClick={() => setUpdateGroup(true)}>
                  Update Group
                </Button>
              ) : (
                <Button className="float-right bg-socioverse-400 rounded-full" >
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
