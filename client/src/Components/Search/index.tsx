import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ImSearch } from "react-icons/im";
import PostCard from "../Post/PostCard";
import { useEffect, useRef, useState } from "react";
import { searchUsers } from "../../API/Profile";
import loader from "../../assets/Loader.svg";
import { searchPosts } from "../../API/Post";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetHashtagSearch } from "../../Redux/PostSlice";

//importing types
import { User } from "../../Types/loginUser";
import { PostDataInterface } from "../../Types/post";
import { StoreType } from "../../Redux/Store";
import common from "../../Constants/common";

const SearchInputDialog = ({
  handleSearchDialog,
  showSearchDialog,
  hashtagSearchOn,
}: {
  handleSearchDialog: () => void;
  showSearchDialog: boolean;
  hashtagSearchOn?: boolean;
}) => {
  const dispatch = useDispatch();
  const hashtagSearchValue = useSelector(
    (state: StoreType) => state.post.hashtagSearch
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultUsers, setSearchResultUsers] = useState<User[]>([]);
  const [searchResultPosts, setSearchResultPosts] = useState<
    PostDataInterface[]
  >([]);
  const [searchResultPostsCount, setSearchResultPostsCount] =
    useState<number>(0);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [postPage, setPostPage] = useState<number>(1);
  const [isLastPostPage, setIsLastPostPage] = useState<boolean>(false);
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);
  const sentinelRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setPostPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (hashtagSearchOn) {
      setSearchQuery(hashtagSearchValue as string);
      dispatch(resetHashtagSearch());
    }
  }, [dispatch, hashtagSearchOn, hashtagSearchValue]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performSearch = async () => {
      const usersResult = await searchUsers(searchQuery);
      setSearchResultUsers(usersResult.users);
      setIsLastPostPage(false);
      const postResult = await searchPosts(searchQuery, 1);
      setSearchResultPosts(postResult.posts);
      setSearchResultPostsCount(postResult.count);
      setPostPage(2);
      setIsPostLoading(false);
    };

    if (searchQuery) {
      timer = setTimeout(performSearch, 800);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          !isPostLoading &&
          !isLastPostPage &&
          showSearchDialog
        ) {
          setIsPostLoading(true);
          const newPostResult = await searchPosts(searchQuery, postPage);
          if (newPostResult.posts.length === 0) {
            setIsPostLoading(false);
            setIsLastPostPage(true);
            return;
          }
          setSearchResultPosts([...searchResultPosts, ...newPostResult.posts]);
          setPostPage(postPage + 1);
          setIsPostLoading(false);
        }
      },
      {
        threshold: 1,
      }
    );

    if (sentinelRef.current) {
      // Check if the sentinel element exists
      observer.observe(sentinelRef.current); // Use the ref to get the DOM element
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isPostLoading, searchResultPosts, postPage, searchQuery, isLastPostPage]);

  useEffect(() => {
    if (!showSearchDialog) {
      setSearchQuery("");
      setIsLastPostPage(false);
      setPostPage(1);
      setSearchResultUsers([]);
      setSearchResultPosts([]);
      setSearchResultPostsCount(0);
    }
  }, [showSearchDialog]);

  useEffect(() => {
    if (deletedPostId) {
      setSearchResultPosts(
        searchResultPosts.filter((post) => post._id !== deletedPostId)
      );
      setDeletedPostId(null);
    }
  }, [deletedPostId]);

  useEffect(() => {
    if (reportedPostId) {
      setSearchResultPosts(
        searchResultPosts.filter((post) => post._id !== reportedPostId)
      );
      setReportedPostId(null);
    }
  }, [reportedPostId]);

  return (
    <Dialog
      open={showSearchDialog}
      size="lg"
      handler={handleSearchDialog}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      {/* <ToastContainer /> */}
      <DialogHeader className=" mt-0 md:mt-4 mx-0 md:mx-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-0 md:gap-3 items-center justify-start w-full">
            <div className="flex w-5/6 md:w-4/6 flex-row items-center md:gap-2 rounded-[99px] border shadow-md border-black/40 bg-blue-gray-100/30 md:p-2">
              <Textarea
                rows={1}
                resize={false}
                value={searchQuery}
                placeholder="Search for people, posts, and more..."
                className="min-h-full !border-0 focus:border-transparent w-full"
                containerProps={{
                  className: "grid h-full",
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div>
                <IconButton
                  variant="text"
                  className="rounded-full text-blue-gray-700"
                >
                  <ImSearch className="h-5 w-5" />
                </IconButton>
              </div>
            </div>
          </div>
          <div>
            <AiOutlineCloseCircle
              className=" text-3xl md:text-4xl cursor-pointer"
              onClick={handleSearchDialog}
            />
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="mx-1 md:mx-6 ">
        <div className="mb-6">
          <h1 className="text-lg md:text-2xl overflow-x-scroll md:no-scrollbar">
            Showing the search result for{" "}
            <span className="font-semibold">{searchQuery}</span> ...
          </h1>
          <em className="text-sm text-gray-500">
            {searchResultUsers.length}{" "}
            {searchResultUsers.length < 2 ? "user" : "users"} and{" "}
            {searchResultPostsCount}{" "}
            {searchResultPostsCount < 2 ? "post" : "posts"} are available
          </em>
        </div>
        {(searchResultUsers.length > 0 || searchResultPosts.length > 0) && (
          <div className="md:mx-2 flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8">
            {searchResultUsers.length > 0 && (
              <div
                className="flex flex-row md:flex-col w-full md:w-4/12 md:overflow-y-auto overflow-x-scroll 
              md:overflow-x-hidden md:h-[55vh] md:no-scrollbar gap-4 md:gap-0"
              >
                {searchResultUsers.length > 0 ? (
                  searchResultUsers.map((user) => (
                    <div
                      className="flex w-36 md:w-60 px-1 md:px-4 py-2 mb-2 md:mb-5 items-center justify-between transition duration-100 ease-in-out rounded-lg 
                      shadow-md hover:scale-105 hover:rounded-lg cursor-pointer flex-shrink-0"
                      key={user._id}
                      onClick={() => {
                        navigate(`/profile/${user._id}`);
                        handleSearchDialog();
                      }}
                    >
                      <div className="s) => setLimt-3 flex items-center space-x-2">
                        <img
                          className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-full"
                          src={user.dp ? user.dp : common.DEFAULT_IMG}
                          alt="dp"
                        />
                        <span className="flex flex-col">
                          <span className="text-[11px] md:text-[14px] font-medium text-gray-900">
                            {user.name}
                          </span>
                          <span className="text-[9px] md:text-[11px] font-medium text-gray-500">
                            @{user.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center mt-5"> No users...</div>
                )}
              </div>
            )}
            <div className="md:hidden border-t-4 border-dotted border-gray-300 w-full"></div>
            {searchResultPosts.length > 0 && (
              <div className="flex flex-col w-full md:w-8/12 overflow-y-auto h-[55vh] no-scrollbar items-center">
                {searchResultPosts.map((post, index) => (
                  <div className="mb-10 w-full md:w-[80%]" key={index}>
                    <PostCard
                      postData={post}
                      setDeletedPostId={setDeletedPostId}
                      setReportedPostId={setReportedPostId}
                    />
                  </div>
                ))}
                {isLastPostPage && (
                  <div className="text-center mt-5"> No posts...</div>
                )}
                <div
                  id="sentinel"
                  style={{ height: "1px" }}
                  className="mt-10"
                  ref={sentinelRef}
                >
                  {!isLastPostPage && searchQuery.length > 0 && (
                    <img src={loader} className="w-20 h-20" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default SearchInputDialog;
