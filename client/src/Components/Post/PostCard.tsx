import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { BiShareAlt } from "react-icons/bi";
import { MdOutlineBookmarkBorder, MdOutlineBookmark } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import ConfirmDeleteToast from "../../utils/customToasts/confirmDeleteToast";
import common, { TOAST_ACTION } from "../../Constants/common";
import {
  deletePost,
  likePost,
  savePost,
  reportPost,
  getLikedUsers,
  getComments,
} from "../../API/Post";
import CommentPopup from "./CommentPopup";
import { getPostDetails } from "../../API/Post";
import EditPostDialogBox from "./EditPostDialogBox";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setHashtagSearch } from "../../Redux/PostSlice";
import PostLikedUsers from "./PostLikedUsers";
import copy from "copy-to-clipboard";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Carousel,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

//importing types
import { PostDataInterface } from "../../Types/post";
import store, { StoreType } from "../../Redux/Store";
import { LikePostId } from "../Profile/PostTabs";
import { SavePostId } from "../Profile/PostTabs";
import { User } from "../../Types/loginUser";

function PostCard({
  postData,
  setDeletedPostId,
  setReportedPostId,
  setPostEdited,
  setSavedPostId,
  setLikedPostId,
}: {
  postData: PostDataInterface;
  setDeletedPostId: React.Dispatch<React.SetStateAction<string | null>>;
  setReportedPostId: React.Dispatch<React.SetStateAction<string | null>>;
  setPostEdited: React.Dispatch<React.SetStateAction<PostDataInterface | null>>;
  setSavedPostId?: React.Dispatch<React.SetStateAction<SavePostId | null>>;
  setLikedPostId?: React.Dispatch<React.SetStateAction<LikePostId | null>>;
}) {
  const userId = store.getState().auth.user?._id as string;
  const dispatch = useDispatch();
  const [post, setPost] = useState<PostDataInterface>(postData);
  const [commentsLength, setCommentsLength] = useState<number>(0);

  const [likesArray, setLikesArray] = useState<string[]>(
    postData.likes as string[]
  );
  const [savedPostsArray, setSavedPostsArray] = useState<string[]>(
    postData.saved as string[]
  );
  const searchMode = useSelector((state: StoreType) => state.post.searchModeOn);
  const isSharedPost = useSelector((state: StoreType) => state.post.isSharedPost);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [openLikedUsersDialog, setOpenLikedUsersDialog] =
    useState<boolean>(false);
  const handleOpenLikedUsersDialog = () =>
    setOpenLikedUsersDialog(!openLikedUsersDialog);

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    setPost(postData);
    updateCommentsLength(postData._id);
    if (postData?.newPostCreated) {
      setLikesArray([]);
      setSavedPostsArray([]);
      postData.newPostCreated = false;
    }
  }, [postData]);

  const [commentPopupOpen, setCommentPopupOpen] = useState<boolean>(false);
  const handleCommentPopupOpen = () => {
    setCommentPopupOpen(!commentPopupOpen);
  };

  const [postDetails, setPostDetails] = useState<PostDataInterface | null>(
    null
  );

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const reportReasons = [
    "I just don't like it",
    "It's spam",
    "Nudity or sexual activity",
    "Hate speech or symbols",
    "False information",
    "Scam or fraud",
    "Something else",
  ];

  const updateCommentsLength = async (postId: string) => {
    const response = await getComments(postId);
    setCommentsLength(response.comments.length);
  };

  const handleDeletePost = (postId: string) => {
    toast.dismiss();
    console.log("Delete Post is done");
    toast(
      <ConfirmDeleteToast
        onDelete={() => handleConfirmDeletePost(postId)}
        message={"Are you sure you want to delete this Post?"}
      />,
      { ...TOAST_ACTION, closeButton: false }
    );
  };

  const handleConfirmDeletePost = async (postId: string) => {
    const response = await deletePost(postId);
    if (response.status === "success") {
      toast.dismiss();
      toast.success("Successfully deleted the Post", TOAST_ACTION);
      setDeletedPostId(postId);
    } else {
      toast.dismiss();
      toast.error("Error deleting the Post", TOAST_ACTION);
    }
  };

  const handleGetPostDetails = async (postId: string) => {
    const response = await getPostDetails(postId);
    if (response.status === "success") {
      setPostDetails(response.post);
    }
  };

  const handleLike = () => {
    likeAction(post._id);
  };

  const handleSavePost = () => {
    savePostAction(post._id);
  };

  const likeAction = async (postId: string) => {
    const response = await likePost(postId);
    toast.dismiss();
    if (response?.message === "Liked the post") {
      setIsLiked(true);
      setLikesArray((prev) => [...prev, userId]);
      setLikedPostId && setLikedPostId({ postId, action: true });
    } else {
      setIsLiked(false);
      setLikesArray((prev) => prev.filter((id) => id !== userId));
      setLikedPostId && setLikedPostId({ postId, action: false });
    }
    response?.status === "success"
      ? toast.success(response.message, { ...TOAST_ACTION, closeButton: false })
      : toast.error("Action failed", { ...TOAST_ACTION, closeButton: false });
  };

  const savePostAction = async (postId: string) => {
    const response = await savePost(postId);
    toast.dismiss();
    if (response?.message === "Saved the post") {
      setIsSaved(true);
      setSavedPostsArray((prev) => [...prev, userId]);
      setSavedPostId && setSavedPostId({ postId, action: true });
    } else {
      setIsSaved(false);
      setSavedPostsArray((prev) => prev.filter((id) => id !== userId));
      setSavedPostId && setSavedPostId({ postId, action: false });
    }
    response?.status === "success"
      ? toast.success(response.message, { ...TOAST_ACTION, closeButton: false })
      : toast.error("Action failed", { ...TOAST_ACTION, closeButton: false });
  };

  const handleReport = async (label: string, postId: string) => {
    toast.dismiss();
    const response = await reportPost(label, postId);
    if (response.status === "success") {
      setReportedPostId(postId);
      toast.success("The following post is reported", {
        ...TOAST_ACTION,
        closeButton: false,
      });
    } else {
      toast.error("Report Action failed", {
        ...TOAST_ACTION,
        closeButton: false,
      });
    }
  };

  const handlePostEdit = () => {
    setOpen(true);
  };

  const handleHashtagClick = (hashtag: string) => {
    dispatch(setHashtagSearch(hashtag));
  };

  const handleGetLikedUsers = async (postId: string) => {
    const response = await getLikedUsers(postId);
    setLikedUsers(response.users);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col w-full items-start gap-2">
        <div className="flex w-full justify-between items-end">
          <Link to={`/profile/${post.userId}`}>
            <div className="mt-3 flex items-center space-x-2">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src={post.user?.dp ? post.user?.dp : common.DEFAULT_IMG}
                alt="Profile Picture"
              />
              <span className="flex flex-col">
                <span className="text-[14px] font-medium text-gray-900">
                  {post.user.name}
                </span>
                <span className="text-[11px] font-medium text-gray-500">
                  @{post.user.username}
                </span>
              </span>
            </div>
          </Link>
          {(!searchMode && !isSharedPost) && (
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button
                  color="blue-gray"
                  size="sm"
                  variant="text"
                  className="focus:outline-none"
                >
                  <SlOptions className="lg:text-xl text-base transition duration-150 ease-in-out hover:scale-105" />
                </Button>
              </MenuHandler>
              <MenuList className="z-50">
                {post?.userId === userId && (
                  <>
                    <MenuItem
                      className=" flex items-center gap-2"
                      onClick={handlePostEdit}
                    >
                      <BiEditAlt className="text-lg" />
                      <div className="text-md">Edit</div>
                      <EditPostDialogBox
                        open={open}
                        handleOpen={handleOpen}
                        post={post}
                        setPostEdited={setPostEdited}
                      />
                    </MenuItem>
                    <MenuItem
                      className=" flex items-center gap-2"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <RiDeleteBin6Line className="text-lg" />
                      <div className="text-md">Delete</div>
                    </MenuItem>
                  </>
                )}
                {post?.userId !== userId && (
                  <Menu placement="bottom-start" offset={15}>
                    <MenuHandler>
                      <MenuItem className=" flex items-center gap-2">
                        <MdOutlineReportGmailerrorred className="text-xl" />
                        <div className="text-md">Report</div>
                      </MenuItem>
                    </MenuHandler>
                    <MenuList>
                      {reportReasons.map((label) => {
                        return (
                          <MenuItem
                            key={label}
                            className="text-md"
                            onClick={() => handleReport(label, post._id)}
                          >
                            {label}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                )}
              </MenuList>
            </Menu>
          )}
        </div>
        <div className="w-full rounded-lg border shadow-lg">
          <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
            <div className="px-4">
              <div
                className="mt-2 text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: post?.description as TrustedHTML,
                }}
              ></div>
              <div className="mt-4 mb-2">
                {post?.hashtagsArray?.map((hashtag, index) => (
                  <span
                    className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold transition ease-in-out duration-150 text-gray-900 cursor-pointer hover:scale-105 hover:text-gray-100 hover:bg-gray-900"
                    key={index}
                    onClick={() => handleHashtagClick(hashtag)}
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
            {post.image && post?.image.length > 0 && (
              <div className="flex items-center justify-self-center px-1 w-full lg:h-72 h-56">
                {post.image.length > 1 ? (
                  <Carousel
                    className="w-full h-full"
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                        {new Array(length).fill("").map((_, i) => (
                          <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                              activeIndex === i
                                ? "w-8 bg-white"
                                : "w-4 bg-white/50"
                            }`}
                            onClick={() => setActiveIndex(i)}
                          />
                        ))}
                      </div>
                    )}
                  >
                    {post?.image.map((image, index) => (
                      <img
                        src={image}
                        alt="post-image"
                        className="h-full w-full object-fill lg:object-cover rounded-lg"
                        key={index}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <img
                    src={post.image[0]}
                    alt="Laptop"
                    className="h-full w-full rounded-lg object-fill lg:object-cover"
                  />
                )}
              </div>
            )}
            <div className="flex items-center justify-between px-2 text-black">
              <div className="flex items-center justify-start gap-4">
                {likesArray.includes(userId) || isLiked ? (
                  <AiFillHeart
                    className="text-2xl cursor-pointer text-socioverse-500 transition ease-in-out duration-150 hover:text-red-500 hover:scale-105"
                    onClick={handleLike}
                  />
                ) : (
                  <AiOutlineHeart
                    className="text-2xl cursor-pointer hover:text-socioverse-500 hover:scale-105 transition ease-in-out duration-150"
                    onClick={handleLike}
                  />
                )}
                <AiOutlineComment
                  className="text-2xl cursor-pointer"
                  onClick={() => {
                    handleCommentPopupOpen();
                    handleGetPostDetails(post._id);
                  }}
                />
                <BiShareAlt className="text-2xl cursor-pointer" 
                onClick={() => {
                  toast.dismiss()
                  copy(`${common.CLIENT_BASE_URL}/share/${post._id}`)
                  toast.success("Copied link to the clipboard", { ...TOAST_ACTION, closeButton: false, autoClose: 2000 })
                }}
                />
              </div>
              {(savedPostsArray && savedPostsArray.includes(userId)) ||
              isSaved ? (
                <MdOutlineBookmark
                  className="text-2xl cursor-pointer text-black hover:scale-105 transition ease-in-out duration-150"
                  onClick={handleSavePost}
                />
              ) : (
                <MdOutlineBookmarkBorder
                  className="text-2xl cursor-pointer hover:scale-105 transition ease-in-out duration-150 "
                  onClick={handleSavePost}
                />
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-start gap-4 px-2">
                <span
                  className="lg:text-[12px] text-[10px] font-medium text-gray-500 cursor-pointer"
                  onClick={() => {
                    handleGetLikedUsers(post._id);
                    setOpenLikedUsersDialog(true);
                  }}
                >
                  {likesArray.length} likes
                </span>
                <span className="text-[12px] font-medium text-gray-500">
                  {commentsLength} comments
                </span>
              </div>
              <span className="lg:text-[12px] text-[10px] font-medium text-gray-500">
                {moment(post.createdAt).startOf("minutes").fromNow()}
                {post.createdAt !== post.updatedAt && " ( Edited )"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <PostLikedUsers
        likedUsers={likedUsers}
        openLikedUsersDialog={openLikedUsersDialog}
        handleOpenLikedUsersDialog={handleOpenLikedUsersDialog}
      />
      <CommentPopup
        commentPopupOpen={commentPopupOpen}
        handleCommentPopupOpen={handleCommentPopupOpen}
        postDetails={postDetails}
        likesArray={likesArray}
        savedPostsArray={savedPostsArray}
        setCommentsLength={setCommentsLength}
        isLiked={isLiked}
        handleLike={handleLike}
        isSaved={isSaved}
        handleSavePost={handleSavePost}
      />
    </>
  );
}

export default PostCard;
