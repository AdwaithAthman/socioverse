import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import MyDropzone from "./MyDropzone";
import { toast, ToastContainer } from "react-toastify";
import { getUserInfo, getOtherUserInfo } from "../../API/Profile";
import { useDispatch } from "react-redux";
import {
  addFollower,
  removeFollower,
  setCredentials,
} from "../../Redux/AuthSlice";
import store from "../../Redux/Store";
import ConfirmDeleteToast from "../../utils/customToasts/confirmDeleteToast";
import { deleteCoverPhoto, deleteProfilePhoto } from "../../API/Profile";
import common, { TOAST_ACTION } from "../../Constants/common";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ImageCropper from "../Crop/ImageCropper";
import { uploadProfilePhoto } from "../../API/Profile";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../../API/User";
import { SlOptionsVertical } from "react-icons/sl";

//importing types
import { User } from "../../Types/loginUser";
import { StoreType } from "../../Redux/Store";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../../Types/axiosErrorData";

const ProfileHeader = ({
  id,
  ifOtherUser,
}: {
  id: string | null;
  ifOtherUser: (boolValue: boolean) => void;
}) => {
  const userData = useSelector((store: StoreType) => store?.auth?.user);
  const [coverPhotoImg, setCoverPhotoImg] = useState<string | null>(null);
  const [dp, setDp] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<boolean>(false);
  const [otherUserInfo, setOtherUserInfo] = useState<User | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [openFollowing, setOpenFollowing] = useState<boolean>(false);
  const [openFollowers, setOpenFollowers] = useState<boolean>(false);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followersList, setFollowersList] = useState<User[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userData) {
        const user = await userInfo();
        if (id === user?._id) {
          if (user?.coverPhoto) {
            setCoverPhotoImg(user.coverPhoto);
          }
          if (user?.dp) {
            setDp(user.dp);
          }
        }
      } else {
        if (id === userData?._id) {
          setCoverPhotoImg(userData?.coverPhoto || null);
          setDp(userData?.dp || null);
        }
      }
    };

    const userInfo = async () => {
      const { user } = await getUserInfo();
      const { accessToken } = store.getState().auth;
      dispatch(setCredentials({ user, accessToken }));
      return user;
    };

    fetchUser();
  }, [dispatch, id, userData]);

  const getOtherUser = async (id: string) => {
    try {
      const { otherUser } = await getOtherUserInfo(id);
      setOtherUserInfo(otherUser);
      if (otherUser?.coverPhoto) {
        setCoverPhotoImg(otherUser.coverPhoto);
      }
      if (otherUser?.dp) {
        setDp(otherUser.dp);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const err: AxiosErrorData = error as AxiosErrorData;
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          navigate("/error");
        }
      }
    }
  };

  useEffect(() => {
    if (id !== userData?._id) {
      setOtherUser(true);
      ifOtherUser(true);
      getOtherUser(id as string);
      if (userData?.following?.includes(id as string)) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    } else {
      setOtherUser(false);
      ifOtherUser(false);
    }
  }, [id, ifOtherUser, userData]);

  // fetching followers and following list
  useEffect(() => {
    if (id) {
      getFollowing(id).then((data) => {
        setFollowingList(data.following);
      });
    }
  }, [id, openFollowing]);

  useEffect(() => {
    if (id) {
      getFollowers(id).then((data) => {
        setFollowersList(data.followers);
      });
    }
  }, [id, openFollowers]);

  const [imageCropperOpen, setImageCropperOpen] = useState<boolean>(false);
  const handleImageCropperOpen = () => setImageCropperOpen(!imageCropperOpen);
  const [imgFile, setImgFile] = useState<File | null>(null);

  const handleUploadPostImage = async (coverPhoto: Blob) => {
    console.log("blob====== ", coverPhoto);
    if (coverPhoto) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const formData = new FormData();
            const filePart = event.target.result as ArrayBuffer;
            const blobPart = new Blob([filePart], { type: coverPhoto.type });
            formData.append("file", blobPart, "image.jpg");
            const response = uploadProfilePhoto(formData);
            await toast
              .promise(
                response,
                {
                  pending: "Image is uploading.....",
                  success: "Successfully updated Profile Photo",
                  error: "Failed to update Profile Photo",
                },
                TOAST_ACTION
              )
              .then(async (response) => {
                if (response) {
                  setDp(response.dp);
                  const { user } = await getUserInfo();
                  dispatch(
                    setCredentials({
                      user,
                      accessToken: store.getState().auth.accessToken,
                    })
                  );
                }
              });
          }
        };
        reader.readAsArrayBuffer(coverPhoto);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const getImage = (blob: Blob) => {
    handleUploadPostImage(blob);
    handleImageCropperOpen();
  };

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgFile(e.target.files[0]);
      setImageCropperOpen(true);
    }
  };

  const handleDeleteProfilePhoto = () => {
    toast.dismiss();
    toast(
      <ConfirmDeleteToast
        onDelete={() => handleConfirmDeleteDP()}
        message={"Are you sure you want to delete this DP?"}
      />,
      TOAST_ACTION
    );
  };

  const handleConfirmDeleteDP = async () => {
    const response = await deleteProfilePhoto();
    if (response.status === "success") {
      toast.dismiss();
      toast.success("DP deleted successfully", TOAST_ACTION);
    } else {
      toast.dismiss();
      toast.error("Error deleting the DP", TOAST_ACTION);
    }
  };

  const renderCoverPhotoSection = () => {
    if (coverPhotoImg) {
      return (
        <>
          <img
            src={coverPhotoImg}
            className="h-full rounded-lg w-full object-fit relative"
          />
          {!otherUser && (
            <div className="absolute bottom-2 lg:bottom-4 right-4 lg:right-20">
              <div className="flex gap-3">
                <div className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group opacity-70 hover:opacity-100">
                  <RiDeleteBin6Line
                    className="text-xl text-white group-hover:text-red-500"
                    onClick={handleDeleteCoverPhoto}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else {
      if (otherUser) {
        return <div className="h-full w-full bg-gray-300 rounded-lg"></div>;
      } else {
        return <MyDropzone />;
      }
    }
  };

  const renderProfileImageSection = () => {
    if (dp) {
      return (
        <div className="absolute -bottom-24 lg:left-14 p-4 hover:scale-105 group">
          <img
            className="h-32 w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-full border-4 border-white"
            src={dp}
          />
          {!otherUser && (
            <div className="absolute bottom-7 left-16 md:left-[4.5rem] lg:left-[5rem]">
              <div className="flex gap-3">
                <div
                  className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 
                border-blue-gray-700 hover:border-red-700 hover:bg-white group-hover:border-3 opacity-0 group-hover:opacity-100"
                >
                  <RiDeleteBin6Line
                    className="text-xl text-white hover:text-red-500"
                    onClick={handleDeleteProfilePhoto}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      if (otherUser) {
        return (
          <div className="absolute -bottom-24 lg:left-14 p-4 ">
            <div className="h-32 w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-full border-2 lg:border-4 border-gray-500 border-dashed bg-white m-2 flex items-center justify-center">
              <CgProfile className="text-5xl text-gray-500 inline-flex" />
            </div>
          </div>
        );
      } else {
        return (
          <>
            <div className="absolute -bottom-24 lg:left-14 p-4 ">
              <input
                type="file"
                accept="image/*"
                id="image-input"
                className="hidden"
                onChange={handleProfilePhoto}
              />
              <label
                htmlFor="image-input"
                className="h-32 w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-full border-4 border-gray-500 border-dashed bg-white m-2 flex items-center justify-center cursor-pointer"
              >
                <CgProfile className="text-5xl text-gray-500 inline-flex" />
              </label>
            </div>
            {/* image cropper dialog */}
            <Dialog
              open={imageCropperOpen}
              size="lg"
              handler={handleImageCropperOpen}
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
              }}
            >
              <DialogHeader>
                <div className="flex justify-between items-center w-full">
                  <div className="text-2xl">Profile Photo</div>
                  <div>
                    <AiOutlineCloseCircle
                      className="text-3xl cursor-pointer"
                      onClick={handleImageCropperOpen}
                    />
                  </div>
                </div>
              </DialogHeader>
              <DialogBody className="lg:m-4 m-2">
                {imgFile ? (
                  <div className="w-auto lg:h-[28rem] h-96 ">
                    <ImageCropper
                      image={URL.createObjectURL(imgFile)}
                      getImage={getImage}
                      aspectRatio={4 / 4}
                    />
                  </div>
                ) : (
                  " "
                )}
              </DialogBody>
            </Dialog>
          </>
        );
      }
    }
  };

  const handleDeleteCoverPhoto = () => {
    toast.dismiss();
    toast(
      <ConfirmDeleteToast
        onDelete={handleConfirmDelete}
        message={"Are you sure you want to delete the cover photo?"}
      />,
      TOAST_ACTION
    );
  };

  const handleConfirmDelete = async () => {
    const response = await deleteCoverPhoto();
    if (response.status === "success") {
      toast.dismiss();
      toast.success("Cover photo deleted successfully", TOAST_ACTION);
      setCoverPhotoImg(null);
    } else {
      toast.dismiss();
      toast.error("Error deleting cover photo", TOAST_ACTION);
    }
  };

  const handleSettings = () => {
    navigate(`/profile/${userData?._id}/settings`);
  };

  const handleEditProfile = () => {
    navigate(`/profile/${userData?._id}/edit-profile`);
  };

  const handleFollowingButton = async (friendId: string, name: string) => {
    followUser(friendId).then(() => {
      setFollowing(false);
      toast.dismiss();
      toast.success(`Following ${name}`, {
        ...TOAST_ACTION,
        position: "bottom-left",
      });
      dispatch(addFollower(friendId));
    });
  };
  const handleUnfollowingButton = async (friendId: string, name: string) => {
    unfollowUser(friendId).then(() => {
      setFollowing(false);
      toast.dismiss();
      toast.success(`Unfollowed ${name}`, {
        ...TOAST_ACTION,
        position: "bottom-left",
      });
      dispatch(removeFollower(friendId));
    });
  };

  const handleOpenFollowing = () => setOpenFollowing(!openFollowing);
  const handleOpenFollowers = () => setOpenFollowers(!openFollowers);

  return (
    <>
      <ToastContainer />
      <div className="relative w-full h-44 md:h-60 lg:h-80 px-1 lg:px-10">
        {renderCoverPhotoSection()}
        {renderProfileImageSection()}

        {/* Name */}
        <div className="flex flex-col justify-between items-start absolute left-40 md:left-44 lg:left-64 -bottom-16">
          <div className="flex md:flex-row flex-col md:items-center md:gap-2">
            <h2 className="mt-2 lg:text-xl text-base font-bold text-black inline">
              {otherUser ? otherUserInfo?.name : userData?.name}
            </h2>
            <p className="text-sm font-light text-gray-600 md:mt-2">
              @{otherUser ? otherUserInfo?.username : userData?.username}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="lg:text-sm text-xs font-bold text-socioverse-500 cursor-pointer"
              onClick={handleOpenFollowing}
            >
              {otherUser
                ? otherUserInfo?.following?.length
                : userData?.following?.length}{" "}
              following
            </span>
            <span
              className="lg:text-sm text-xs font-bold text-socioverse-500 cursor-pointer"
              onClick={handleOpenFollowers}
            >
              {otherUser
                ? otherUserInfo?.followers?.length
                : userData?.followers?.length}{" "}
              followers
            </span>
          </div>
        </div>
        <div className="md:flex items-center justify-between gap-5 absolute hidden md:-bottom-14 md:right-20">
          {!otherUser ? (
            <>
              <Button
                variant="outlined"
                className="rounded-full text-black border-black"
                onClick={handleSettings}
              >
                Settings
              </Button>
              <Button
                className="rounded-full bg-socioverse-500"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              {following ? (
                <Button
                  variant="outlined"
                  className="rounded-full text-black border-black"
                  onClick={() =>
                    handleUnfollowingButton(
                      id as string,
                      otherUserInfo?.name as string
                    )
                  }
                >
                  Following
                </Button>
              ) : (
                <Button
                  className="rounded-full bg-socioverse-500"
                  onClick={() =>
                    handleFollowingButton(
                      id as string,
                      otherUserInfo?.name as string
                    )
                  }
                >
                  Follow
                </Button>
              )}
            </>
          )}
        </div>
        <div className="flex md:hidden absolute right-0 -bottom-14">
          <Menu placement="bottom-start">
            <MenuHandler>
              <Button
                color="blue-gray"
                size="sm"
                variant="text"
                className="focus:outline-none"
              >
                <SlOptionsVertical className="text-lg transition duration-150 ease-in-out hover:scale-105" />
              </Button>
            </MenuHandler>
            <MenuList className="z-50">
              {!otherUser ? (
                <>
                  <MenuItem
                    onClick={handleSettings}
                    className="hover:bg-blue-gray-50"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={handleEditProfile}
                    className="hover:bg-blue-gray-50"
                  >
                    Edit Profile
                  </MenuItem>
                </>
              ) : following ? (
                <MenuItem
                  onClick={() =>
                    handleUnfollowingButton(
                      id as string,
                      otherUserInfo?.name as string
                    )
                  }
                  className="hover:bg-blue-gray-50"
                >
                  Unfollow
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() =>
                    handleFollowingButton(
                      id as string,
                      otherUserInfo?.name as string
                    )
                  }
                  className="hover:bg-blue-gray-50"
                >
                  Follow
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Following List */}
      <Dialog
        open={openFollowing}
        size="xs"
        handler={handleOpenFollowing}
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
                onClick={handleOpenFollowing}
              />
            </div>
          </div>
        </DialogHeader>
        <ToastContainer />
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
          <div className="flex flex-col gap-2 ">
            {followingList.map((userProfile) => (
              <div
                className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                key={userProfile._id}
              >
                <div
                  className="mt-3 flex items-center space-x-2"
                  onClick={() => {
                    handleOpenFollowing();
                    navigate(`/profile/${userProfile._id}`);
                  }}
                >
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
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter children={undefined}></DialogFooter>
      </Dialog>

      {/* Followers List */}
      <Dialog
        open={openFollowers}
        size="xs"
        handler={handleOpenFollowers}
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
                onClick={handleOpenFollowers}
              />
            </div>
          </div>
        </DialogHeader>
        <ToastContainer />
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
          <div className="flex flex-col gap-2 ">
            {followersList.map((userProfile) => (
              <div
                className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                key={userProfile._id}
              >
                <div
                  className="mt-3 flex items-center space-x-2"
                  onClick={() => {
                    handleOpenFollowers();
                    navigate(`/profile/${userProfile._id}`);
                  }}
                >
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
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter children={undefined}></DialogFooter>
      </Dialog>
    </>
  );
};

export default ProfileHeader;
