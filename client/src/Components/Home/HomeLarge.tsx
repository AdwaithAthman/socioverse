import { useEffect, useState } from "react";
import { Avatar } from "@material-tailwind/react";
import loader from "../../assets/Loader.svg";

//components
import AsideTwo from "./Aside_2";
import AsideOne from "./Aside_1";
import PostBox from "../Post/PostBox";
import PostCard from "../Post/PostCard";
import PostDialogBox from "../Post/PostDialogBox";
import { getUserInfo } from "../../API/Profile";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../Redux/AuthSlice";
import { getPosts } from "../../API/Post";

//importing types
import { User } from "../../Types/loginUser";
import store from "../../Redux/Store";
import { PostDataInterface } from "../../Types/post";
import UsernameInputPopup from "../UsernameInputPopup";
import { useNavigate } from "react-router-dom";
import common from "../../Constants/common";
import { Socket } from "socket.io-client";

const HomeLarge = ({ user, socket }: { user: User; socket: Socket }) => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<PostDataInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);
  const [postCreated, setPostCreated] = useState<PostDataInterface | null>(
    null
  );
  const [postEdited, setPostEdited] = useState<PostDataInterface | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] =
    useState<boolean>(false);
  const [usernameInputPopupOpen, setUsernameInputPopupOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsUsernameAvailable(user.username ? true : false);
    }
  }, [user]);

  useEffect(() => {
    if (!isUsernameAvailable) {
      setUsernameInputPopupOpen(true);
    } else {
      setUsernameInputPopupOpen(false);
    }
  }, [isUsernameAvailable]);

  const handleUsernameInputPopup = () => {
    setUsernameInputPopupOpen((prev) => !prev);
  };

  const loadInitialPosts = async () => {
    // Fetch initial posts from the backend
    const initialPosts = await getPosts(page);
    setPosts(initialPosts.posts);
    setPage(page + 1);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialPosts();
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById("sentinel");

    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !isLoading && !isLastPage) {
        setIsLoading(true);
        // Fetch more posts from the backend
        const newPosts = await getPosts(page);
        if (newPosts.posts.length === 0) {
          setIsLastPage(true);
          setIsLoading(false);
          return;
        } else {
          setIsLastPage(false);
        }
        setPosts([...posts, ...newPosts.posts]);
        setPage(page + 1);
        setIsLoading(false);
      }
    });

    observer.observe(sentinel as HTMLElement);

    return () => {
      observer.unobserve(sentinel as HTMLElement);
    };
  }, [isLoading, posts, page, isLastPage]);

  useEffect(() => {
    if (!user) {
      getUserInfo().then((res) => {
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: store.getState().auth.accessToken,
          })
        );
      });
    }
  }, [dispatch, user]);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);
  const handlePostBox = () => {
    setOpen(true);
  };
  const [newFollowing, setNewFollowing] = useState<boolean>(false);
  const [removeFollowing, setRemoveFollowing] = useState<boolean>(false);
  const handleFollowingAdd = (boolValue: boolean) => {
    setNewFollowing(boolValue);
  };
  const handleFollowingRemove = (boolValue: boolean) => {
    setRemoveFollowing(boolValue);
  };

  if (deletedPostId) {
    setPosts(posts.filter((post) => post._id !== deletedPostId));
    setDeletedPostId(null);
  }

  useEffect(() => {
    if (reportedPostId) {
      setPosts(posts.filter((post) => post._id !== reportedPostId));
      setReportedPostId(null);
    }
  }, [posts, reportedPostId]);

  useEffect(() => {
    if (postCreated) {
      setPosts([{ ...postCreated, newPostCreated: true }, ...posts]);
      setPostCreated(null);
    }
  }, [postCreated, posts]);

  useEffect(() => {
    if (postEdited) {
      setPosts(
        posts.map((post) => {
          if (post._id === postEdited._id) {
            return postEdited;
          }
          return post;
        })
      );
      setPostEdited(null);
    }
  }, [postEdited, posts]);

  return (
    <>
      <div className="lg:flex gap-3 items-start justify-between h-[80vh] lg:h-[85vh]">
        <aside className="hidden lg:block w-3/12 px-3 sticky top-28 overflow-y-auto h-[80vh] no-scrollbar">
          <AsideOne
            newFollowing={newFollowing}
            handleFollowingAdd={handleFollowingAdd}
            removeFollowing={removeFollowing}
            handleFollowingRemove={handleFollowingRemove}
            socket={socket}
          />
        </aside>
        <main className="w-full lg:w-6/12 px-3 md:px-6 overflow-x-hidden overflow-y-auto h-[85vh] no-scrollbar flex flex-col items-center p-2">
          <div className="flex items-center justify-between w-full md:p-2 mb-8 gap-3 md:gap-5 sticky top-0 z-40">
            <Avatar
              variant="circular"
              alt="user dp"
              className="border h-12 w-12 md:h-14 md:w-14 border-gray-500 p-0.5 cursor-pointer"
              src={user && user.dp ? user.dp : common.DEFAULT_IMG}
              onClick={() => navigate(`/profile/${user && user._id}`)}
            />
            <div className="w-full" onClick={handlePostBox}>
              <PostBox />
            </div>
          </div>
          {/* <hr className="border-t-2 border-gray-900 my-4"></hr> */}
          <div className=" overflow-y-auto h-[85vh] w-full no-scrollbar flex flex-col items-center">
            <div className="mb-10 max-w-[30rem] w-full">
              {posts.map((post, index) => (
                <div className="mb-10 w-full" key={index}>
                  <PostCard
                    postData={post}
                    setDeletedPostId={setDeletedPostId}
                    setReportedPostId={setReportedPostId}
                    setPostEdited={setPostEdited}
                  />
                </div>
              ))}
              <PostDialogBox
                open={open}
                handleOpen={handleOpen}
                setIsLastPage={setIsLastPage}
                setPostCreated={setPostCreated}
              />
            </div>
            {isLastPage && <div> No posts...</div>}
            <div id="sentinel" style={{ height: "1px" }} className="mt-10">
              {!isLastPage && <img src={loader} className="w-20 h-20" />}
            </div>
          </div>
        </main>
        <aside className="hidden lg:block w-3/12 px-3 pb-5 sticky top-28 overflow-hidden">
          <AsideTwo
            handleFollowingAdd={handleFollowingAdd}
            handleFollowingRemove={handleFollowingRemove}
          />
        </aside>
      </div>
      <UsernameInputPopup
        handleUsernameInputPopup={handleUsernameInputPopup}
        usernameInputPopupOpen={usernameInputPopupOpen}
        setIsUsernameAvailable={setIsUsernameAvailable}
      />
    </>
  );
};

export default HomeLarge;
