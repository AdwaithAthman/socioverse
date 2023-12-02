import { SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Accordion,
  AccordionBody,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

//icons
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { RiUserFollowFill } from "react-icons/ri";
import { RiUserUnfollowFill } from "react-icons/ri";
import { MdVideoCall } from "react-icons/md";
import { BiSolidMessageDetail } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getFollowers, getFollowing } from "../../API/User";

//importing types
import { StoreType } from "../../Redux/Store";
import { User } from "../../Types/loginUser";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import common from "../../Constants/common";
import { setOpenVideoCall, setSelectedChat } from "../../Redux/ChatSlice";
import { fetchOtherUserChat } from "../../API/Chat";
import { Socket } from "socket.io-client";
import { getOtherUserInfo, getUserInfo } from "../../API/Profile";

function AsideOne({
  newFollowing,
  handleFollowingAdd,
  removeFollowing,
  handleFollowingRemove,
  socket,
}: {
  newFollowing: boolean;
  handleFollowingAdd: (boolValue: boolean) => void;
  removeFollowing: boolean;
  handleFollowingRemove: (boolValue: boolean) => void;
  socket: Socket;
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [userFollowingProfiles, setUserFollowingProfiles] = useState<
    User[] | []
  >([]);
  const [followersProfiles, setFollowersProfiles] = useState<User[] | []>([]);
  const [openViewMoreFollowers, setOpenViewMoreFollowers] =
    useState<boolean>(false);
  const [openViewMoreFollowing, setOpenViewMoreFollowing] =
    useState<boolean>(false);
  const handleOpenViewMoreFollowers = () =>
    setOpenViewMoreFollowers(!openViewMoreFollowers);
  const handleOpenViewMoreFollowing = () =>
    setOpenViewMoreFollowing(!openViewMoreFollowing);

  const user = useSelector((state: StoreType) => state.auth.user);

  useEffect(() => {
    getFollowing().then((data) => {
      setUserFollowingProfiles(data.following);
    });
    getFollowers().then((data) => {
      setFollowersProfiles(data.followers);
    });
  }, []);
  const [open, setOpen] = useState(1);

  const handleOpen = (value: SetStateAction<number>) =>
    setOpen(open === value ? 0 : value);

  if (newFollowing) {
    getFollowing().then((data) => {
      setUserFollowingProfiles(data.following);
    });
    handleFollowingAdd(false);
  }

  if (removeFollowing) {
    getFollowing().then((data) => {
      setUserFollowingProfiles(data.following);
    });
    handleFollowingRemove(false);
  }

  const handleMessageClick = async (userId: string) => {
    const response = await fetchOtherUserChat(userId);
    dispatch(setSelectedChat(response.chat));
    if (location.pathname !== "/message") {
      navigate("/message");
    }
  };

  const handleVideoCall = async (userId: string) => {
    const response = await fetchOtherUserChat(userId);
    dispatch(setSelectedChat(response.chat));
    if (socket) {
      socket.emit("call-user", user, response.chat);
    }
    dispatch(setOpenVideoCall(true));
    if (location.pathname !== "/message") {
      navigate("/message");
    }
  };

  return (
    <>
      {/* Accordion 2 */}
      <Accordion
        open={open === 2}
        className="mb-5 rounded-lg border px-2 shadow-lg"
      >
        <div
          onClick={() => handleOpen(2)}
          className="border-b-0 transition-colors flex items-center justify-between p-4 cursor-pointer 
          "
        >
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Followers</h1>
            <Chip
              value={followersProfiles?.length}
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </div>
          <div className="text-2xl">
            {open === 2 ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </div>
        </div>
        <AccordionBody className="pt-0 text-base font-normal">
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-2 ">
              {followersProfiles?.length && followersProfiles ? (
                followersProfiles.slice(0, 5).map((userProfile, index) => (
                  <div
                    className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                    key={index}
                  >
                    <Link to={`/profile/${userProfile._id}`}>
                      <div className="mt-3 flex items-center space-x-2">
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          src={
                            userProfile.dp ? userProfile.dp : common.DEFAULT_IMG
                          }
                          alt="user dp"
                        />
                        <span className="flex flex-col">
                          <span className="text-[14px] font-medium text-gray-900">
                            {userProfile.name}
                          </span>
                          <span className="text-[11px] font-medium text-gray-500">
                            @{userProfile.username}
                          </span>
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group"
                        onClick={() =>
                          handleMessageClick(userProfile._id as string)
                        }
                      >
                        <BiSolidMessageDetail className="text-md text-socioverse-500 group-hover:text-green-500" />
                      </div>
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group"
                        onClick={() =>
                          handleVideoCall(userProfile._id as string)
                        }
                      >
                        <MdVideoCall className="text-xl text-socioverse-500  group-hover:text-green-500" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No followers</div>
              )}
            </div>
            {followersProfiles?.length ? (
              <div className="inline-block">
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-black capitalize shadow-none text-sm font-semibold"
                  onClick={handleOpenViewMoreFollowers}
                  disabled={followersProfiles?.length < 6}
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </AccordionBody>
      </Accordion>
      {/* Accordion 3 */}
      <Accordion
        open={open === 3}
        className="mb-5 rounded-lg border px-2 shadow-lg"
      >
        <div
          onClick={() => handleOpen(3)}
          className="border-b-0 transition-colors flex items-center justify-between p-4 cursor-pointer 
          "
        >
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Following</h1>
            <Chip
              value={userFollowingProfiles?.length}
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </div>
          <div className="text-2xl">
            {open === 3 ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </div>
        </div>
        <AccordionBody className="pt-0 text-base font-normal">
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-2 ">
              {userFollowingProfiles?.length && userFollowingProfiles ? (
                userFollowingProfiles.slice(0, 5).map((userProfile) => (
                  <div
                    className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                    key={userProfile._id}
                  >
                    <Link to={`/profile/${userProfile._id}`}>
                      <div className="mt-3 flex items-center space-x-2">
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          src={
                            userProfile.dp ? userProfile.dp : common.DEFAULT_IMG
                          }
                          alt="user dp"
                        />
                        <span className="flex flex-col">
                          <span className="text-[14px] font-medium text-gray-900">
                            {userProfile.name}
                          </span>
                          <span className="text-[11px] font-medium text-gray-500">
                            @{userProfile.username}
                          </span>
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group">
                        <BiSolidMessageDetail
                          className="text-md text-socioverse-500 group-hover:text-green-500"
                          onClick={() =>
                            handleMessageClick(userProfile._id as string)
                          }
                        />
                      </div>
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group"
                        onClick={() =>
                          handleVideoCall(userProfile._id as string)
                        }
                      >
                        <MdVideoCall className="text-xl text-socioverse-500  group-hover:text-green-500" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No following</div>
              )}
            </div>
            {userFollowingProfiles?.length ? (
              <div className="inline-block">
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-black capitalize shadow-none text-sm font-semibold"
                  onClick={handleOpenViewMoreFollowing}
                  disabled={userFollowingProfiles?.length < 6}
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </AccordionBody>
      </Accordion>
      {/* Dialog for Accoridion 2 */}
      <Dialog
        open={openViewMoreFollowers}
        size="xs"
        handler={handleOpenViewMoreFollowers}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-semibold">Followers List</h1>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={handleOpenViewMoreFollowers}
              />
            </div>
          </div>
        </DialogHeader>
        <ToastContainer />
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
          <div className="flex flex-col gap-2 ">
            {followersProfiles.map((userProfile) => (
              <div
                className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                key={userProfile._id}
              >
                <Link to={`/profile/${userProfile._id}`}>
                  <div className="mt-3 flex items-center space-x-2">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={userProfile.dp ? userProfile.dp : common.DEFAULT_IMG}
                      alt="user dp"
                    />
                    <span className="flex flex-col">
                      <span className="text-[14px] font-medium text-gray-900">
                        {userProfile?.name}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500">
                        {userProfile.username
                          ? `@${userProfile.username}`
                          : "@ -"}
                      </span>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter children={undefined}></DialogFooter>
      </Dialog>

      {/* Dialog for Accoridion 3 */}
      <Dialog
        open={openViewMoreFollowing}
        size="xs"
        handler={handleOpenViewMoreFollowing}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-semibold">Following List</h1>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={handleOpenViewMoreFollowing}
              />
            </div>
          </div>
        </DialogHeader>
        <ToastContainer />
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
          <div className="flex flex-col gap-2 ">
            {userFollowingProfiles.map((userProfile) => (
              <div
                className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                key={userProfile._id}
              >
                <Link to={`/profile/${userProfile._id}`}>
                  <div className="mt-3 flex items-center space-x-2">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={userProfile.dp ? userProfile.dp : common.DEFAULT_IMG}
                      alt="user dp"
                    />
                    <span className="flex flex-col">
                      <span className="text-[14px] font-medium text-gray-900">
                        {userProfile?.name}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500">
                        {userProfile.username
                          ? `@${userProfile.username}`
                          : "@ -"}
                      </span>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter children={undefined}></DialogFooter>
      </Dialog>
    </>
  );
}

export default AsideOne;
