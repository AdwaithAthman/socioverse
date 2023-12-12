import { useEffect, useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Carousel,
} from "@material-tailwind/react";
import {
  AiOutlineCloseCircle,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import {
  MdOutlineBookmarkBorder,
  MdOutlineBookmark,
  MdOutlineReportGmailerrorred,
} from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { BiEditAlt, BiShareAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputEmoji from "react-input-emoji";
import common, { TOAST_ACTION } from "../../Constants/common";
import { toast, ToastContainer } from "react-toastify";
import {
  addComment,
  addReply,
  getComments,
  getLikedUsers,
  getReplies,
} from "../../API/Post";
import moment from "moment";
import store from "../../Redux/Store";
import classnames from "classnames";
import {
  updateComment,
  deleteComment,
  likeComment,
  likeReply,
  deleteReply,
  reportComment,
  reportReply,
} from "../../API/Post";
import ConfirmDeleteToast from "../../utils/customToasts/confirmDeleteToast";
import { useDispatch } from "react-redux";
import { setHashtagSearch } from "../../Redux/PostSlice";
import { Link } from "react-router-dom";
import PostLikedUsers from "./PostLikedUsers";
import copy from "copy-to-clipboard";

//importing types
import {
  CommentInterface,
  PostDataInterface,
  ReplyInterface,
} from "../../Types/post";
import { User } from "../../Types/loginUser";

const CommentPopup = ({
  commentPopupOpen,
  handleCommentPopupOpen,
  postDetails,
  likesArray,
  savedPostsArray,
  setCommentsLength,
  isLiked,
  handleLike,
  isSaved,
  handleSavePost,
}: {
  commentPopupOpen: boolean;
  handleCommentPopupOpen: () => void;
  postDetails: PostDataInterface | null;
  likesArray: string[];
  savedPostsArray: string[];
  setCommentsLength: React.Dispatch<React.SetStateAction<number>>;
  isLiked: boolean;
  handleLike: () => void;
  isSaved: boolean;
  handleSavePost: () => void;
}) => {
  const dispatch = useDispatch();
  const [onReply, setOnReply] = useState<boolean>(false);
  const [taggedUser, setTaggedUser] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [newCommentStatus, setNewCommentStatus] = useState<boolean>(false);
  const [commentToBeReplied, setCommentToBeReplied] = useState<string | null>(
    null
  );
  const [editComment, setEditComment] = useState<CommentInterface | null>(null);
  const [editCommentMode, setEditCommentMode] = useState<boolean>(false);
  const [newlyUpdatedComment, setNewlyUpdatedComment] =
    useState<CommentInterface | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [newlyAddedReply, setNewlyAddedReply] = useState<ReplyInterface | null>(
    null
  );
  const userId = store.getState().auth.user?._id as string;
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [openLikedUsersDialog, setOpenLikedUsersDialog] =
    useState<boolean>(false);
  const handleOpenLikedUsersDialog = () =>
    setOpenLikedUsersDialog(!openLikedUsersDialog);

  useEffect(() => {
    if (postDetails) {
      fetchComments(postDetails._id);
    }
  }, [postDetails]);

  async function fetchComments(postId: string) {
    const response = await getComments(postId);
    if (response.status === "success") {
      setComments(response.comments);
    }
  }
  useEffect(() => {
    if (onReply && postDetails) {
      console.log("comment to be replied: ", commentToBeReplied);
      console.log("tagged user name: ", taggedUser);
    } else {
      setTaggedUser(null);
      setCommentToBeReplied(null);
    }
  }, [onReply, postDetails]);

  useEffect(() => {
    if (newCommentStatus) {
      fetchComments(postDetails?._id as string);
      setNewCommentStatus(false);
    }
  }, [newCommentStatus, postDetails]);

  useEffect(() => {
    setCommentsLength(comments.length);
  }, [comments.length]);

  useEffect(() => {
    if (newlyUpdatedComment) {
      const index = comments.findIndex(
        (comment) => comment._id === newlyUpdatedComment._id
      );
      if (index !== -1) {
        const updatedComments = [...comments];
        updatedComments[index] = newlyUpdatedComment;
        setComments(updatedComments);
      }
      setNewlyUpdatedComment(null);
    }
  }, [comments, newlyUpdatedComment]);

  useEffect(() => {
    if (deleteCommentId) {
      const index = comments.findIndex(
        (comment) => comment._id === deleteCommentId
      );
      if (index !== -1) {
        const updatedComments = [...comments];
        updatedComments.splice(index, 1);
        setComments(updatedComments);
      }
      setDeleteCommentId(null);
    }
  }, [comments, deleteCommentId]);

  const handleHashtagClick = (hashtag: string) => {
    dispatch(setHashtagSearch(hashtag));
    handleCommentPopupOpen();
  };

  const handleGetLikedUsers = async (postId: string) => {
    const response = await getLikedUsers(postId);
    setLikedUsers(response.users);
  };

  return (
    <>
      <Dialog
        open={commentPopupOpen}
        size="lg"
        handler={handleCommentPopupOpen}
        dismiss={{
          enabled: false,
        }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <ToastContainer />
        <DialogBody>
          <DialogHeader className="p-0">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center justify-between gap-5 transition-transform duration-300 mx-1 px-2 pb-3 rounded-lg cursor-pointer hover:bg-gray-200 hover:scale-105">
                {postDetails && (
                  <Link to={`/profile/${postDetails.userId}`}>
                    <div className="mt-3 flex items-center space-x-2">
                      {postDetails?.user.dp ? (
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          src={postDetails?.user.dp}
                          alt="Profile Picture"
                        />
                      ) : (
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          src={
                            postDetails?.user.dp
                              ? postDetails?.user.dp
                              : common.DEFAULT_IMG
                          }
                          alt="Profile Picture"
                        />
                      )}
                      <span className="flex flex-col">
                        <span className="text-[14px] font-bold text-gray-900">
                          {postDetails.user.name}
                        </span>
                        <span className="text-[11px] font-bold text-green-500">
                          @{postDetails.user.username}
                        </span>
                      </span>
                    </div>
                  </Link>
                )}
              </div>
              <div>
                <AiOutlineCloseCircle
                  className="text-3xl cursor-pointer"
                  onClick={handleCommentPopupOpen}
                />
              </div>
            </div>
          </DialogHeader>
          <section>
            <div className="flex gap-8 items-start justify-start">
              <div className="relative hidden md:flex w-1/2 pl-4 pb-5">
                <div className="flex flex-col w-full h-full items-start gap-2">
                  <div className="w-full rounded-lg border shadow-lg">
                    <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
                      <div className="px-4">
                        <div
                          className="mt-2 text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: postDetails?.description as TrustedHTML,
                          }}
                        ></div>
                        <div className="mt-4 mb-2">
                          {postDetails?.hashtagsArray?.map((hashtag, index) => (
                            <span
                              className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold transition ease-in-out duration-150
                               text-gray-900 cursor-pointer hover:scale-105 hover:text-gray-100 hover:bg-gray-900"
                              key={index}
                              onClick={() => handleHashtagClick(hashtag)}
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {postDetails?.image && postDetails?.image.length > 0 && (
                        <div className="flex items-center justify-self-center px-1 w-full h-64">
                          {postDetails.image.length > 1 ? (
                            <Carousel
                              className="w-full h-full"
                              navigation={({
                                setActiveIndex,
                                activeIndex,
                                length,
                              }) => (
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
                              {postDetails?.image.map((image, index) => (
                                <img
                                  src={image}
                                  alt="post-image"
                                  className="h-full w-full object-cover rounded-lg"
                                  key={index}
                                />
                              ))}
                            </Carousel>
                          ) : (
                            <img
                              src={postDetails.image[0]}
                              alt="Laptop"
                              className="h-full w-full rounded-lg object-cover"
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
                          <BiShareAlt
                            className="text-2xl cursor-pointer"
                            onClick={() => {
                              toast.dismiss();
                              postDetails &&
                                copy(
                                  `${common.CLIENT_BASE_URL}/share/${postDetails._id}`
                                );
                              toast.success("Copied link to the clipboard", {
                                ...TOAST_ACTION,
                                closeButton: false,
                              });
                            }}
                          />
                        </div>
                        {(savedPostsArray &&
                          savedPostsArray.includes(userId)) ||
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
                            className="text-[12px] font-medium text-gray-500 cursor-pointer"
                            onClick={() => {
                              postDetails &&
                                handleGetLikedUsers(postDetails._id);
                              setOpenLikedUsersDialog(true);
                            }}
                          >
                            {likesArray.length} likes
                          </span>
                          <span className="text-[12px] font-medium text-gray-500">
                            {comments.length} comments
                          </span>
                        </div>
                        <span className="text-[12px] font-medium text-gray-500">
                          {moment(postDetails?.createdAt)
                            .startOf("minutes")
                            .fromNow()}
                          {postDetails?.createdAt !== postDetails?.updatedAt &&
                            " ( Edited )"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full md:w-1/2 h-[32rem] md:pr-4 md:pb-5">
                <div className="flex flex-col w-full h-full items-start border-2 rounded-lg shadow-lg">
                  {/* <div className="h-5/6 w-full"></div>
                  <div className="h-1/6 w-full border-t-2"></div> */}
                  <div className="h-full w-full overflow-y-scroll no-scrollbar">
                    {comments.length ? (
                      comments.map((comment) => (
                        <Comment
                          onReply={onReply}
                          setOnReply={setOnReply}
                          commentData={comment}
                          commentToBeReplied={commentToBeReplied}
                          setCommentToBeReplied={setCommentToBeReplied}
                          setTaggedUser={setTaggedUser}
                          editCommentMode={editCommentMode}
                          setEditComment={setEditComment}
                          setDeleteCommentId={setDeleteCommentId}
                          newlyAddedReply={newlyAddedReply}
                          setNewlyAddedReply={setNewlyAddedReply}
                          key={comment._id}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center justify-center">
                          <p>No comments yet...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="h-fit w-full p-2 md:p-4 border-t-2">
                    {postDetails && (
                      <CommentBoxTextarea
                        postId={postDetails._id}
                        onReply={onReply}
                        setOnReply={setOnReply}
                        taggedUser={taggedUser}
                        setNewCommentStatus={setNewCommentStatus}
                        commentToBeReplied={commentToBeReplied}
                        setCommentToBeReplied={setCommentToBeReplied}
                        editComment={editComment}
                        setEditComment={setEditComment}
                        editCommentMode={editCommentMode}
                        setEditCommentMode={setEditCommentMode}
                        setNewlyUpdatedComment={setNewlyUpdatedComment}
                        setNewlyAddedReply={setNewlyAddedReply}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </DialogBody>
      </Dialog>
      <PostLikedUsers
        likedUsers={likedUsers}
        openLikedUsersDialog={openLikedUsersDialog}
        handleOpenLikedUsersDialog={handleOpenLikedUsersDialog}
      />
    </>
  );
};

function CommentBoxTextarea({
  postId,
  onReply,
  setOnReply,
  taggedUser,
  setNewCommentStatus,
  commentToBeReplied,
  setCommentToBeReplied,
  editComment,
  setEditComment,
  editCommentMode,
  setEditCommentMode,
  setNewlyUpdatedComment,
  setNewlyAddedReply,
}: {
  postId: string;
  onReply: boolean;
  setOnReply: React.Dispatch<React.SetStateAction<boolean>>;
  taggedUser: string | null;
  setNewCommentStatus: React.Dispatch<React.SetStateAction<boolean>>;
  commentToBeReplied: string | null;
  setCommentToBeReplied: React.Dispatch<React.SetStateAction<string | null>>;
  editComment: CommentInterface | null;
  setEditComment: React.Dispatch<React.SetStateAction<CommentInterface | null>>;
  editCommentMode: boolean;
  setEditCommentMode: React.Dispatch<React.SetStateAction<boolean>>;
  setNewlyUpdatedComment: React.Dispatch<
    React.SetStateAction<CommentInterface | null>
  >;
  setNewlyAddedReply: React.Dispatch<
    React.SetStateAction<ReplyInterface | null>
  >;
}) {
  const [text, setText] = useState("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onReply && taggedUser) {
      inputRef.current?.focus();
      setText(`@${taggedUser} `);
      setEditCommentMode(false);
    } else {
      setText("");
      setCommentToBeReplied(null);
    }
  }, [onReply, taggedUser]);

  useEffect(() => {
    if (editComment) {
      setEditCommentMode(true);
      setText(editComment.comment);
      setEditCommentId(editComment._id);
      inputRef.current?.focus();
      setEditComment(null);
      setOnReply(false);
    }
  }, [editComment, setEditComment, setEditCommentMode]);

  const handleOnEnter = async (text: string) => {
    if (text.length > 0) {
      const commentObj = {
        postId,
        comment: text,
      };
      if (onReply && commentToBeReplied) {
        const replyObj = {
          commentId: commentToBeReplied,
          reply: text,
        };
        const response = addReply(replyObj);
        toast.promise(response, {
          pending: "Replying to the comment...",
          success: "Comment added successfully!",
          error: "Error adding comment!",
        });
        (await response).status === "success" && setCommentToBeReplied(null);
        setNewlyAddedReply((await response).reply);
        setOnReply(false);
      } else if (editCommentMode) {
        const response = updateComment(editCommentId as string, text);
        toast.promise(response, {
          pending: "Making Changes...",
          success: "Successfully Edited the comment!",
          error: "Error making changes!",
        });
        (await response).status === "success" &&
          (setNewlyUpdatedComment((await response).editedComment),
          setEditCommentMode(false));
      } else {
        const response = addComment(commentObj);
        toast.promise(response, {
          pending: "Adding comment...",
          success: "Comment added successfully!",
          error: "Error adding comment!",
        });
        (await response).status === "success" && setNewCommentStatus(true);
      }
    }
  };

  return (
    <>
      <InputEmoji
        ref={inputRef}
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder="Add a comment..."
        theme="auto"
        fontSize={14}
        fontFamily="sans-serif"
        keepOpened={true}
        searchMention={async (text) => {
          return ["no user"].filter((user) => user.includes(text));
        }}
      />
      {onReply ? (
        <Button
          variant="text"
          size="sm"
          className="text-xs text-socioverse-500 mr-10 float-right"
          onClick={() => setOnReply(false)}
        >
          Cancel Reply
        </Button>
      ) : editCommentMode ? (
        <Button
          variant="text"
          size="sm"
          className="text-xs text-socioverse-500 mr-10 float-right"
          onClick={() => setEditCommentMode(false)}
        >
          Cancel Edit
        </Button>
      ) : (
        ""
      )}
    </>
  );
}

function Comment({
  onReply,
  commentToBeReplied,
  setCommentToBeReplied,
  setOnReply,
  commentData,
  setTaggedUser,
  editCommentMode,
  setEditComment,
  setDeleteCommentId,
  newlyAddedReply,
  setNewlyAddedReply,
}: {
  onReply: boolean;
  commentToBeReplied: string | null;
  setCommentToBeReplied: React.Dispatch<React.SetStateAction<string | null>>;
  setOnReply: React.Dispatch<React.SetStateAction<boolean>>;
  commentData: CommentInterface;
  setTaggedUser: React.Dispatch<React.SetStateAction<string | null>>;
  editCommentMode: boolean;
  setEditComment: React.Dispatch<React.SetStateAction<CommentInterface | null>>;
  setDeleteCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  newlyAddedReply: ReplyInterface | null;
  setNewlyAddedReply: React.Dispatch<
    React.SetStateAction<ReplyInterface | null>
  >;
}) {
  const userId = store.getState().auth.user?._id as string;
  const [commentLikes, setCommentLikes] = useState<string[]>(commentData.likes);
  const [commentIsLiked, setCommentIsLiked] = useState<boolean>(false);
  const [openReplies, setOpenReplies] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyInterface[]>([]);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [fromId, setFromId] = useState<string | null>(null);
  const [replyForReply, setReplyForReply] = useState<boolean>(false);
  const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);

  // const [isEditButtonClicked, setIsEditButtonClicked] = useState<boolean>(false);

  const toggleMenuVisibility = () => {
    setMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    if (commentData) {
      setCommentLikes(commentData.likes);
    }
    if (commentData && commentData.likes.includes(userId)) {
      setCommentIsLiked(true);
    } else {
      setCommentIsLiked(false);
    }
  }, [commentData, userId]);

  useEffect(() => {
    if (newlyAddedReply) {
      setReplies((prev) => [newlyAddedReply, ...prev]);
      setNewlyAddedReply(null);
    }
  }, [newlyAddedReply, setNewlyAddedReply]);

  useEffect(() => {
    if (openReplies) {
      fetchReplies();
    } else {
      setReplies([]);
    }
  }, [openReplies]);

  useEffect(() => {
    if (!editCommentMode) {
      setEditCommentId(null);
    }
  }, [editCommentMode]);

  //deleting reply
  useEffect(() => {
    if (deleteReplyId) {
      const index = replies.findIndex((reply) => reply._id === deleteReplyId);
      if (index !== -1) {
        const updatedReplies = [...replies];
        updatedReplies.splice(index, 1);
        setReplies(updatedReplies);
      }
      setDeleteCommentId(null);
    }
  }, [replies, deleteReplyId, setDeleteCommentId]);

  async function fetchReplies() {
    const replies = await getReplies(commentData._id);
    if (replies.status === "success") {
      setReplies(replies.replies);
    }
  }

  const handleOnReply = (
    commentId: string,
    commentUser: string | null,
    replyUser: string | null,
    fromId: string | null,
    replyForReply: boolean
  ) => {
    setOnReply((prev) => !prev);
    setCommentToBeReplied(commentId);
    setFromId(fromId);
    setReplyForReply(replyForReply);
    if (commentUser) setTaggedUser(commentUser);
    else if (replyUser) setTaggedUser(replyUser);
  };

  const handleEditComment = () => {
    setEditComment(commentData);
    setEditCommentId(commentData._id);
  };

  const handleDeleteComment = () => {
    toast.dismiss();
    toast(
      <ConfirmDeleteToast
        onDelete={confirmDeleteComment}
        message={"Are you sure you want to delete this Comment?"}
      />,
      { ...TOAST_ACTION, closeButton: false }
    );
  };

  const confirmDeleteComment = async () => {
    const response = deleteComment(commentData._id);
    toast.promise(response, {
      pending: "Deleting Comment...",
      success: "Comment deleted successfully!",
      error: "Error deleting comment!",
    });
    (await response).status === "success" &&
      setDeleteCommentId(commentData._id);
  };

  const handleReportComment = async () => {
    toast.dismiss();
    const response = reportComment(commentData._id);
    toast.promise(response, {
      pending: "Reporting Comment...",
      success: "Comment reported successfully!",
      error: "Error reporting comment!",
    });
  };

  const handleLikeComment = async () => {
    toast.dismiss();
    if (commentIsLiked) {
      const response = await likeComment(commentData._id, "dislike");
      if (response.status === "success") {
        setCommentIsLiked(false);
        setCommentLikes((prev) => prev.filter((id) => id !== userId));
      } else {
        toast.error("Error occured", TOAST_ACTION);
      }
    } else {
      const response = await likeComment(commentData._id, "like");
      if (response.status === "success") {
        setCommentIsLiked(true);
        setCommentLikes((prev) => [...prev, userId]);
      } else {
        toast.error("Error occured", TOAST_ACTION);
      }
    }
  };

  return (
    <div className={classnames("rounded-xl flex flex-col border m-3")}>
      <div className="transition-transform duration-300 rounded-lg cursor-pointer w-full">
        <div
          className={classnames(
            "space-x-2 flex items-start p-1 md:p-4 rounded-lg shadow-lg",
            {
              "bg-blue-gray-50":
                (onReply &&
                  !replyForReply &&
                  commentToBeReplied === commentData._id) ||
                (editCommentMode && editCommentId === commentData._id),
            },
            { "bg-white": !onReply && !editCommentMode }
          )}
        >
          {commentData && (
            <Link to={`/profile/${commentData.user?._id}`}>
              {commentData.user?.dp ? (
                <img
                  className="inline-block h-8 w-8 md:h-10 md:w-10 rounded-full"
                  src={commentData.user?.dp}
                  alt="user dp"
                />
              ) : (
                <img
                  className="inline-block h-8 w-8 md:h-10 md:w-10 rounded-full"
                  src={common.DEFAULT_IMG}
                  alt="user dp"
                />
              )}
            </Link>
          )}
          <div className="w-full">
            <div className="flex justify-between items-center">
              {commentData && (
                <Link to={`/profile/${commentData.user?._id}`}>
                  <span className="text-xs md:text-sm font-bold text-gray-900">
                    {commentData.user?.name}
                  </span>
                </Link>
              )}
              <div className="group inline-block relative">
                <Button
                  color="blue-gray"
                  size="sm"
                  variant="text"
                  className="focus:outline-none"
                  onClick={toggleMenuVisibility}
                >
                  <SlOptions className="text-sm transition duration-150 ease-in-out hover:scale-105" />
                </Button>
                {isMenuVisible && (
                  <div
                    className={`${
                      isMenuVisible ? "block" : "hidden"
                    } absolute right-0 w-36 rounded-md z-10`}
                  >
                    <div
                      className={`${
                        isMenuVisible ? "block" : "hidden"
                      } absolute right-0 mt-1 w-full bg-white border border-blue-gray-300/20 shadow-lg rounded-md z-10`}
                    >
                      {commentData.user?._id === userId ? (
                        <>
                          <button
                            className="flex items-center w-full pl-5 py-[0.6rem] text-blue-gray-700 hover:bg-blue-100/50 hover:text-blue-gray-800 text-left"
                            onClick={() => {
                              handleEditComment();
                              setMenuVisible(false);
                            }}
                          >
                            <BiEditAlt className="mr-2 text-lg" />
                            <p className="text-sm">Edit</p>
                          </button>
                          <button
                            className="flex items-center w-full pl-5 py-[0.6rem] text-blue-gray-700 hover:bg-blue-100/50 hover:text-blue-gray-800 text-left"
                            onClick={() => {
                              handleDeleteComment();
                              setMenuVisible(false);
                            }}
                          >
                            <RiDeleteBin6Line className="mr-2 text-md" />
                            <p className="text-sm">Delete</p>
                          </button>
                        </>
                      ) : (
                        <button
                          className="flex items-center w-full pl-5 py-[0.6rem] text-blue-gray-700 hover:bg-blue-100/50 hover:text-blue-gray-800 text-left"
                          onClick={() => {
                            handleReportComment();
                            setMenuVisible(false);
                          }}
                        >
                          <MdOutlineReportGmailerrorred className="mr-2 text-lg" />
                          <p className="text-sm">Report</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="flex-1">
              <p className="text-xs md:text-sm text-gray-600">
                {commentData.comment}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                <div className="flex gap-5">
                  {commentLikes.includes(userId) ? (
                    <button
                      onClick={handleLikeComment}
                      className="flex gap-1 items-center"
                    >
                      <p className="text-[0.6rem] md:text-xs font-bold">
                        {commentLikes.length}
                      </p>
                      <AiFillHeart className="text-sm md:text-md cursor-pointer text-socioverse-500 hover:scale-105" />
                    </button>
                  ) : (
                    <button
                      onClick={handleLikeComment}
                      className="flex gap-1 items-center"
                    >
                      <p className="text-[0.6rem] md:text-xs font-bold">
                        {commentLikes.length}
                      </p>
                      <AiOutlineHeart className="text-sm md:text-md cursor-pointer hover:text-socioverse-500" />
                    </button>
                  )}
                  <button
                    className="text-[0.6rem] md:text-xs font-bold"
                    onClick={() =>
                      commentData.user &&
                      handleOnReply(
                        commentData._id,
                        commentData.user?.name,
                        null,
                        commentData.user?._id,
                        false
                      )
                    }
                  >
                    Reply
                  </button>
                  <button
                    className="text-[0.6rem] md:text-xs font-bold"
                    onClick={() => setOpenReplies((prev) => !prev)}
                  >
                    Replies {replies.length || commentData.replies.length}
                  </button>
                </div>
                <p className="text-[0.6rem] md:text-xs">
                  {moment(commentData.createdAt).startOf("minutes").fromNow()}
                  {commentData.createdAt !== commentData.updatedAt &&
                    " ( Edited )"}
                </p>
              </div>
            </span>
          </div>
        </div>
        {openReplies && replies.length > 0 && (
          <div className="mt-5 flex flex-col gap-4">
            {replies.map((reply) => (
              <Reply
                key={reply._id}
                userId={userId}
                reply={reply}
                commentId={commentData._id}
                handleOnReply={handleOnReply}
                onReply={onReply}
                fromId={fromId}
                setDeleteReplyId={setDeleteReplyId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Reply = ({
  userId,
  reply,
  commentId,
  handleOnReply,
  onReply,
  fromId,
  setDeleteReplyId,
}: {
  userId: string;
  reply: ReplyInterface;
  commentId: string;
  handleOnReply: (
    commentId: string,
    commentUser: string | null,
    replyUser: string,
    fromId: string,
    replyForReply: boolean
  ) => void;
  onReply: boolean;
  fromId: string | null;
  setDeleteReplyId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [replyLikes, setReplyLikes] = useState<string[]>(reply.likes);
  const [replyIsLiked, setReplyIsLiked] = useState<boolean>(false);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  const toggleMenuVisibility = () => {
    setMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    if (reply) {
      setReplyLikes(reply.likes);
    }
    if (reply && reply.likes.includes(userId)) {
      setReplyIsLiked(true);
    } else {
      setReplyIsLiked(false);
    }
  }, [reply, userId]);

  const handleLikeReply = async () => {
    toast.dismiss();
    if (replyIsLiked) {
      const response = await likeReply(reply._id, commentId, "dislike");
      if (response.status === "success") {
        setReplyIsLiked(false);
        setReplyLikes((prev) => prev.filter((id) => id !== userId));
      } else {
        toast.error("Error occured", TOAST_ACTION);
      }
    } else {
      const response = await likeReply(reply._id, commentId, "like");
      if (response.status === "success") {
        setReplyIsLiked(true);
        setReplyLikes((prev) => [...prev, userId]);
      } else {
        toast.error("Error occured", TOAST_ACTION);
      }
    }
  };

  const handleDeleteComment = () => {
    toast.dismiss();
    toast(
      <ConfirmDeleteToast
        onDelete={confirmDeleteComment}
        message={"Are you sure you want to delete this reply comment?"}
      />,
      { ...TOAST_ACTION, closeButton: false }
    );
  };

  const confirmDeleteComment = async () => {
    const response = deleteReply(reply._id, commentId);
    toast.promise(response, {
      pending: "Deleting Reply...",
      success: "Reply deleted successfully!",
      error: "Error deleting reply!",
    });
    (await response).status === "success" && setDeleteReplyId(reply._id);
  };

  const handleReportReply = () => {
    toast.dismiss();
    const response = reportReply(reply._id, commentId);
    toast.promise(response, {
      pending: "Reporting Reply...",
      success: "Reply reported successfully!",
      error: "Error reporting reply!",
    });
  };

  return (
    <>
      <div className=" pl-10 pr-2">
        <div
          className={classnames(
            "space-x-2 p-1 md:p-4 rounded-lg shadow-lg border flex items-start",
            { "bg-blue-gray-50": onReply && fromId === reply._id },
            { "bg-white": !onReply }
          )}
        >
          {reply && (
            <Link to={`/profile/${reply.userId}`}>
              {reply.user?.dp ? (
                <img
                  className="inline-block h-8 w-8 md:h-10 md:w-10 rounded-full"
                  src={reply.user?.dp}
                  alt="Profile Picture"
                />
              ) : (
                <img
                  className="inline-block h-8 w-8 md:h-10 md:w-10 rounded-full"
                  src={common.DEFAULT_IMG}
                  alt="Profile Picture"
                />
              )}
            </Link>
          )}
          <div className="w-full">
            <div className="flex justify-between items-center">
              {reply && (
                <Link to={`/profile/${reply.userId}`}>
                  <span className="text-xs md:text-sm font-bold text-gray-900">
                    {reply.user?.name}
                  </span>
                </Link>
              )}
              <div className="group inline-block relative">
                <Button
                  color="blue-gray"
                  size="sm"
                  variant="text"
                  className="focus:outline-none"
                  onClick={toggleMenuVisibility}
                >
                  <SlOptions className="text-sm transition duration-150 ease-in-out hover:scale-105" />
                </Button>
                {isMenuVisible && (
                  <div
                    className={`${
                      isMenuVisible ? "block" : "hidden"
                    } absolute right-0 w-36 rounded-md z-10`}
                  >
                    <div
                      className={`${
                        isMenuVisible ? "block" : "hidden"
                      } absolute right-0 mt-1 w-full bg-white border border-blue-gray-300/20 shadow-lg rounded-md z-10`}
                    >
                      {reply.user?._id === userId ? (
                        <button
                          className="flex items-center w-full pl-5 py-[0.6rem] text-blue-gray-700 hover:bg-blue-100/50 hover:text-blue-gray-800 text-left"
                          onClick={() => {
                            handleDeleteComment();
                            setMenuVisible(false);
                          }}
                        >
                          <RiDeleteBin6Line className="mr-2 text-md" />
                          <p className="text-sm">Delete</p>
                        </button>
                      ) : (
                        <button
                          className="flex items-center w-full pl-5 py-[0.6rem] text-blue-gray-700 hover:bg-blue-100/50 hover:text-blue-gray-800 text-left"
                          onClick={() => {
                            handleReportReply();
                            setMenuVisible(false);
                          }}
                        >
                          <MdOutlineReportGmailerrorred className="mr-2 text-lg" />
                          <p className="text-sm">Report</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="flex-1">
              <p className="text-xs md:text-sm text-gray-600">{reply.reply}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                <div className="flex gap-5">
                  {replyLikes.includes(userId) ? (
                    <button
                      onClick={handleLikeReply}
                      className="flex gap-1 items-center"
                    >
                      <p className="text-[0.6rem] md:text-xs font-bold">
                        {replyLikes.length}
                      </p>
                      <AiFillHeart className="text-sm md:text-md cursor-pointer text-socioverse-500 hover:scale-105" />
                    </button>
                  ) : (
                    <button
                      onClick={handleLikeReply}
                      className="flex gap-1 items-center"
                    >
                      <p className="text-[0.6rem] md:text-xs font-bold">
                        {replyLikes.length}
                      </p>
                      <AiOutlineHeart className="text-sm md:text-md cursor-pointer hover:text-socioverse-500" />
                    </button>
                  )}
                  <button
                    className="text-[0.6rem] md:text-xs font-bold"
                    onClick={() => {
                      reply.user &&
                        handleOnReply(
                          commentId,
                          null,
                          reply.user?.name,
                          reply._id,
                          true
                        );
                    }}
                  >
                    Reply
                  </button>
                </div>
                <p className="text-[0.6rem] md:text-xs">
                  {moment(reply.createdAt).startOf("minutes").fromNow()}
                </p>
              </div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPopup;
