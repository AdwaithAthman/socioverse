import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { TiUserAdd } from "react-icons/ti";
import { HiUserGroup } from "react-icons/hi";
import {
  getRestOfUsers,
  getRestOfAllUsers,
  followUser,
  unfollowUser,
  getSuggestions,
} from "../../API/User";
import { ToastContainer, toast } from "react-toastify";
import common, { TOAST_ACTION } from "../../Constants/common";
import { getUserInfo } from "../../API/Profile";
import { RiUserUnfollowFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFollower,
  addFollower,
  setCredentials,
} from "../../Redux/AuthSlice";
import store, { StoreType } from "../../Redux/Store";

//importing types
import { User } from "../../Types/loginUser";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

function AsideTwo({
  handleFollowingAdd,
  handleFollowingRemove,
}: {
  handleFollowingAdd: (boolValue: boolean) => void;
  handleFollowingRemove: (boolValue: boolean) => void;
}) {
  const userInfoRedux = useSelector((store: StoreType) => store?.auth?.user);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [tempFollowingList, setTempFollowingList] = useState<string[]>();
  const [allUserProfiles, setAllUserProfiles] = useState<User[] | []>([]);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userInfoRedux) {
        const user = await fetchUserData();
        setUserInfo(user);
      }
    };

    const fetchUserData = async () => {
      const { user } = await getUserInfo();
      const { accessToken } = store.getState().auth;
      dispatch(setCredentials({ user, accessToken }));
      return user;
    };

    fetchUser();
    getSuggestions().then((res) => setAllUserProfiles(res.suggestions));
  }, []);

  useEffect(() => {
    if (userInfoRedux) {
      setTempFollowingList(userInfoRedux.following);
    }
  }, [userInfoRedux]);

  const handleFollowingButton = (friendId: string, name: string) => {
    followUser(friendId).then(() => {
      handleFollowingAdd(true);
      toast.dismiss();
      toast.success(`Following ${name}`, {
        ...TOAST_ACTION,
        position: "bottom-left",
      });
    });
    !tempFollowingList?.includes(friendId) &&
      setTempFollowingList([...(tempFollowingList as string[]), friendId]);
    dispatch(addFollower(friendId));
  };

  const handleUnfollowingButton = (friendId: string, name: string) => {
    unfollowUser(friendId).then(() => {
      handleFollowingRemove(true);
      toast.dismiss();
      toast.success(`Unfollowed ${name}`, {
        ...TOAST_ACTION,
        position: "bottom-left",
      });
    });
    setTempFollowingList(tempFollowingList?.filter((id) => id !== friendId));
    dispatch(removeFollower(friendId));
  };

  const handleViewMore = () => {
    getSuggestions().then((res) => setAllUserProfiles(res.suggestions));
  };

  return (
    <>
      <ToastContainer />
      <div className="flex max-w-2xl flex-col rounded-lg border shadow-lg p-2">
        <div>
          <div className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">
                  <HiUserGroup />
                </div>
                <h1 className="inline-flex items-center text-lg font-semibold">
                  People you may know
                </h1>
              </div>

              <div className="flex flex-col gap-2 ">
                {allUserProfiles.slice(0, 5).map((userProfile) => (
                  <div
                    className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                    key={userProfile._id}
                  >
                    <Link to={`/profile/${userProfile._id}`}>
                      <div className="s) => setLimt-3 flex items-center space-x-2">
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          src={
                            userProfile.dp ? userProfile.dp : common.DEFAULT_IMG
                          }
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
                    {tempFollowingList?.includes(userProfile._id as string) ||
                    (userInfoRedux &&
                      userProfile.followers?.includes(
                        userInfoRedux._id as string
                      )) ||
                    (userInfo &&
                      userProfile.followers?.includes(
                        userInfo._id as string
                      )) ? (
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group"
                        onClick={() =>
                          handleUnfollowingButton(
                            userProfile._id as string,
                            userProfile.name
                          )
                        }
                      >
                        <RiUserUnfollowFill className="text-xl text-white group-hover:text-red-500" />
                      </div>
                    ) : (
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:bg-white hover:border-3 group"
                        onClick={() =>
                          handleFollowingButton(
                            userProfile._id as string,
                            userProfile.name
                          )
                        }
                      >
                        <TiUserAdd className="text-xl text-socioverse-500 group-hover:text-blue-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="inline-block">
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-black capitalize shadow-none text-sm font-semibold"
                  onClick={() => {
                    handleViewMore();
                    handleOpen();
                  }}
                  disabled={allUserProfiles.length <= 5}
                >
                  View More
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
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        size="xs"
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-semibold">People you may know</h1>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={handleOpen}
              />
            </div>
          </div>
        </DialogHeader>
        <ToastContainer />
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
          <div className="flex flex-col gap-2 ">
            {allUserProfiles.map((userProfile) => (
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
                {tempFollowingList?.includes(userProfile._id as string) ||
                (userInfoRedux &&
                  userProfile.followers?.includes(
                    userInfoRedux._id as string
                  )) ||
                (userInfo &&
                  userProfile.followers?.includes(userInfo._id as string)) ? (
                  <div
                    className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group"
                    onClick={() =>
                      handleUnfollowingButton(
                        userProfile._id as string,
                        userProfile.name
                      )
                    }
                  >
                    <RiUserUnfollowFill className="text-xl text-white group-hover:text-red-500" />
                  </div>
                ) : (
                  <div
                    className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:bg-white hover:border-3 group"
                    onClick={() =>
                      handleFollowingButton(
                        userProfile._id as string,
                        userProfile.name
                      )
                    }
                  >
                    <TiUserAdd className="text-xl text-socioverse-500 group-hover:text-blue-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter children={undefined}></DialogFooter>
      </Dialog>
    </>
  );
}

export default AsideTwo;
